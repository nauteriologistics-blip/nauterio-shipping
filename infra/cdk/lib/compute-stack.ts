import { Stack, StackProps, Tags, Duration } from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as elbv2 from "aws-cdk-lib/aws-elasticloadbalancingv2";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as rds from "aws-cdk-lib/aws-rds";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import * as logs from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";

export interface ComputeStackProps extends StackProps {
  vpc: ec2.Vpc;
  databaseProxy: rds.DatabaseProxy;
  databaseCredentialsSecret: secretsmanager.Secret;
}

// REL-014: a combined DATABASE_URL secret cannot be assembled at CDK synth
// time without resolving (and thereby exposing) the password in the
// template - the standard pattern is to inject the individual libpq-style
// PG* fields instead and let the Postgres client compose the connection
// itself, which packages/database/src/index.ts's createPool() now supports
// natively when DATABASE_URL is absent.
const DATABASE_NAME = "nauterio";
const LOG_RETENTION = logs.RetentionDays.ONE_MONTH; // REL-013: was unset (never expires) on every log group

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
 * before. Autoscaling policies are wired regardless (REL-014), so scaling
 * out is a config change, not a code change, once that traffic exists.
 */
export class ComputeStack extends Stack {
  public readonly alb: elbv2.ApplicationLoadBalancer;

  constructor(scope: Construct, id: string, props: ComputeStackProps) {
    super(scope, id, props);

    const cluster = new ecs.Cluster(this, "NauterioCluster", {
      vpc: props.vpc,
      containerInsightsV2: ecs.ContainerInsights.ENABLED,
    });

    this.alb = new elbv2.ApplicationLoadBalancer(this, "NauterioAlb", {
      vpc: props.vpc,
      internetFacing: true,
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
    });
    const alb = this.alb;

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

    // REL-001: was /v1/content/pages/health - a database-querying content
    // route that always 404s (no such ContentPage row is ever seeded), so
    // the API could never reach a healthy steady state behind the ALB.
    // REL-014: desiredCount 2 (not 1) is the spec's own "≥2 for critical
    // services" requirement - at 1, any single task failure is a total API
    // outage, and the autoScaleTaskCount policy below inherits this as its
    // minCapacity, so 1 also meant the fleet could never scale-in-then-out
    // back to a genuinely redundant floor.
    this.createHttpService(cluster, listener, "ApiService", apiRepo, 4000, "/v1/health", 2, "api.nauterio.example", 10, props, true);
    this.createHttpService(cluster, listener, "WebService", webRepo, 3000, "/", 1, "www.nauterio.example", 20, props, false);
    this.createHttpService(cluster, listener, "AdminService", adminRepo, 3001, "/", 1, "admin.nauterio.example", 30, props, false);
    this.createWorkerService(cluster, workerRepo, props);

    Tags.of(this).add("nauterio:stack", "compute");
  }

  private databaseEnvironment(props: ComputeStackProps): {
    environment: Record<string, string>;
    secrets: Record<string, ecs.Secret>;
  } {
    return {
      environment: {
        PGHOST: props.databaseProxy.endpoint,
        PGPORT: "5432",
        PGDATABASE: DATABASE_NAME,
      },
      secrets: {
        PGUSER: ecs.Secret.fromSecretsManager(props.databaseCredentialsSecret, "username"),
        PGPASSWORD: ecs.Secret.fromSecretsManager(props.databaseCredentialsSecret, "password"),
      },
    };
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
    rulePriority: number,
    props: ComputeStackProps,
    needsDatabase: boolean
  ): ecs.FargateService {
    const taskDefinition = new ecs.FargateTaskDefinition(this, `${id}TaskDef`, {
      cpu: 512,
      memoryLimitMiB: 1024,
    });

    const db = needsDatabase ? this.databaseEnvironment(props) : { environment: {}, secrets: {} };

    taskDefinition.addContainer(`${id}Container`, {
      image: ecs.ContainerImage.fromEcrRepository(repo, "latest"),
      portMappings: [{ containerPort }],
      logging: ecs.LogDrivers.awsLogs({ streamPrefix: id, logRetention: LOG_RETENTION }),
      environment: {
        NODE_ENV: "production",
        PORT: String(containerPort),
        // Explicit, not just the zod schema default - REL-014/SEC-007: a
        // production task must never rely on LOCAL_AUTH_MODE's default
        // rather than stating its own intent. COGNITO_* are deliberately
        // NOT set here: no real Cognito User Pool exists yet
        // (REQUIRES_BUSINESS_EVIDENCE / ADR 0001 section 11), so the API
        // correctly refuses to verify identity until one is provisioned
        // and these are wired - that is the honest state, not a gap to
        // paper over with placeholder values.
        ...(needsDatabase ? { LOCAL_AUTH_MODE: "false", ...db.environment } : {}),
      },
      secrets: needsDatabase ? db.secrets : undefined,
    });

    const service = new ecs.FargateService(this, id, {
      cluster,
      taskDefinition,
      desiredCount,
      minHealthyPercent: 100,
      maxHealthyPercent: 200, // supports rolling deploys per spec 22.5
      circuitBreaker: { rollback: true }, // spec 22.5: "automatic rollback on failed alarms"
      // REL-014: NestJS + Prisma client init is not instantaneous - without
      // this the ALB begins health-checking before the process can
      // possibly be listening, compounding REL-001's failure mode.
      healthCheckGracePeriod: Duration.seconds(60),
    });

    // REL-014: policy exists so scaling out is a `desiredCount`/limit
    // change, not new code, once real traffic justifies more than one task.
    const scaling = service.autoScaleTaskCount({ minCapacity: desiredCount, maxCapacity: Math.max(desiredCount * 4, 4) });
    scaling.scaleOnCpuUtilization(`${id}CpuScaling`, {
      targetUtilizationPercent: 70,
      scaleInCooldown: Duration.seconds(60),
      scaleOutCooldown: Duration.seconds(60),
    });

    listener.addTargets(`${id}Target`, {
      priority: rulePriority,
      conditions: [elbv2.ListenerCondition.hostHeaders([hostHeader])],
      port: containerPort,
      protocol: elbv2.ApplicationProtocol.HTTP,
      targets: [service],
      healthCheck: {
        path: healthCheckPath,
        interval: Duration.seconds(30),
        healthyHttpCodes: "200",
      },
      // REL-002: let an in-flight request finish draining before ECS tears
      // the task down, instead of the ALB still routing to a task that has
      // already received SIGTERM.
      deregistrationDelay: Duration.seconds(30),
    });

    return service;
  }

  private createWorkerService(
    cluster: ecs.Cluster,
    repo: ecr.Repository,
    props: ComputeStackProps
  ): ecs.FargateService {
    const taskDefinition = new ecs.FargateTaskDefinition(this, "WorkerTaskDef", {
      cpu: 512,
      memoryLimitMiB: 1024,
    });
    const db = this.databaseEnvironment(props);
    taskDefinition.addContainer("WorkerContainer", {
      image: ecs.ContainerImage.fromEcrRepository(repo, "latest"),
      logging: ecs.LogDrivers.awsLogs({ streamPrefix: "Worker", logRetention: LOG_RETENTION }),
      environment: { NODE_ENV: "production", ...db.environment },
      secrets: db.secrets,
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
