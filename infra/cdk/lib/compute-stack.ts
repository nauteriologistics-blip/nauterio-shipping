import { Stack, StackProps, Tags, Duration } from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as elbv2 from "aws-cdk-lib/aws-elasticloadbalancingv2";
import * as ecr from "aws-cdk-lib/aws-ecr";
import { Construct } from "constructs";

export interface ComputeStackProps extends StackProps {
  vpc: ec2.Vpc;
}

/**
 * Compute stack (ADR 0001 section 10, spec sections 20, 21.1, 22.1, 22.5).
 *
 * Four independent ECS Fargate services (web, admin, api, worker) - spec:
 * "Each has independent CPU, memory, scaling and deployment." Worker has
 * no load balancer target (it is not an HTTP service).
 *
 * One ALB with ONE HTTP listener, routed by Host header to the matching
 * service's target group - this matches spec 22.1's real subdomain scheme
 * (www/app/admin/api.<company>.com all resolving to the same ALB, not
 * different ports). A domain does not exist yet (ADR 0001 section 11), so
 * `hostHeader` values here are placeholders using ".example" - replace
 * with the real domain's subdomains once one is registered and DO NOT
 * treat these placeholder hostnames as real (CLAUDE.md: no fabricated
 * business facts).
 *
 * HTTP only for now (no ACM certificate exists without a real domain);
 * add an HTTPS listener + certificate + HTTP->HTTPS redirect before any
 * real traffic (spec 31: "TLS in transit").
 *
 * Image references point at ECR repositories that CI pushes to (spec
 * 36.1) - this stack does not build or push images itself.
 *
 * Desired count is 1 here (cost-appropriate for a stack that is not
 * actually deployed yet); spec 22.5 requires >=2 for critical services
 * "after pilot" - bump this once there is real traffic to justify it, not
 * before.
 */
export class ComputeStack extends Stack {
  constructor(scope: Construct, id: string, props: ComputeStackProps) {
    super(scope, id, props);

    const cluster = new ecs.Cluster(this, "NauterioCluster", {
      vpc: props.vpc,
      containerInsightsV2: ecs.ContainerInsights.ENABLED,
    });

    const alb = new elbv2.ApplicationLoadBalancer(this, "NauterioAlb", {
      vpc: props.vpc,
      internetFacing: true,
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
    });

    // Default listener: HTTP 80, default action is a 404 - each service
    // below adds a host-based rule; nothing should ever match the default.
    const listener = alb.addListener("HttpListener", {
      port: 80,
      protocol: elbv2.ApplicationProtocol.HTTP,
      open: true,
      defaultAction: elbv2.ListenerAction.fixedResponse(404, { messageBody: "Not found" }),
    });

    const apiRepo = new ecr.Repository(this, "ApiRepo", { repositoryName: "nauterio/api" });
    const webRepo = new ecr.Repository(this, "WebRepo", { repositoryName: "nauterio/web" });
    const adminRepo = new ecr.Repository(this, "AdminRepo", { repositoryName: "nauterio/admin" });
    const workerRepo = new ecr.Repository(this, "WorkerRepo", { repositoryName: "nauterio/worker" });

    // Placeholder hostnames - spec 22.1's real scheme is
    // www/app/admin/api.<company>.com once a domain is registered.
    this.createHttpService(cluster, listener, "ApiService", apiRepo, 4000, "/v1/content/pages/health", 1, "api.nauterio.example", 10);
    this.createHttpService(cluster, listener, "WebService", webRepo, 3000, "/", 1, "www.nauterio.example", 20);
    this.createHttpService(cluster, listener, "AdminService", adminRepo, 3001, "/", 1, "admin.nauterio.example", 30);
    this.createWorkerService(cluster, workerRepo);

    Tags.of(this).add("nauterio:stack", "compute");
  }

  private createHttpService(
    cluster: ecs.Cluster,
    listener: elbv2.ApplicationListener,
    id: string,
    repo: ecr.Repository,
    containerPort: number,
    healthCheckPath: string,
    desiredCount: number,
    hostHeader: string,
    rulePriority: number
  ): ecs.FargateService {
    const taskDefinition = new ecs.FargateTaskDefinition(this, `${id}TaskDef`, {
      cpu: 512,
      memoryLimitMiB: 1024,
    });
    taskDefinition.addContainer(`${id}Container`, {
      image: ecs.ContainerImage.fromEcrRepository(repo, "latest"),
      portMappings: [{ containerPort }],
      logging: ecs.LogDrivers.awsLogs({ streamPrefix: id }),
      // Environment variables (DATABASE_URL, COGNITO_*, etc.) are injected
      // via Secrets Manager/SSM references at deploy time, never hardcoded
      // here (CLAUDE.md: no secrets in repository or images).
    });

    const service = new ecs.FargateService(this, id, {
      cluster,
      taskDefinition,
      desiredCount,
      minHealthyPercent: 100,
      maxHealthyPercent: 200, // supports rolling deploys per spec 22.5
      circuitBreaker: { rollback: true }, // spec 22.5: "automatic rollback on failed alarms"
    });

    listener.addTargets(`${id}Target`, {
      priority: rulePriority,
      conditions: [elbv2.ListenerCondition.hostHeaders([hostHeader])],
      port: containerPort,
      protocol: elbv2.ApplicationProtocol.HTTP,
      targets: [service],
      healthCheck: { path: healthCheckPath, interval: Duration.seconds(30) },
    });

    return service;
  }

  private createWorkerService(cluster: ecs.Cluster, repo: ecr.Repository): ecs.FargateService {
    const taskDefinition = new ecs.FargateTaskDefinition(this, "WorkerTaskDef", {
      cpu: 512,
      memoryLimitMiB: 1024,
    });
    taskDefinition.addContainer("WorkerContainer", {
      image: ecs.ContainerImage.fromEcrRepository(repo, "latest"),
      logging: ecs.LogDrivers.awsLogs({ streamPrefix: "Worker" }),
    });

    // No ALB target - the worker has no HTTP surface (ADR 0001 section 3.1).
    // Real deployment should scale this on SQS queue depth (spec 22.5),
    // configured as a step-scaling policy once real SQS queues exist.
    return new ecs.FargateService(this, "WorkerService", {
      cluster,
      taskDefinition,
      desiredCount: 1,
      minHealthyPercent: 0, // single-task background service - no ALB target to keep healthy during deploys
      circuitBreaker: { rollback: true },
    });
  }
}
