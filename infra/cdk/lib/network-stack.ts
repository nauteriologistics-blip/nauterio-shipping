import { Stack, StackProps, Tags } from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";

/**
 * Network stack (ADR 0001 section 10, spec section 22.3).
 *
 * - >=3 AZ VPC (spec says Milan/eu-south-1 where supported - eu-south-1 has
 *   3 AZs at the time this was written; verify before deploying to a region
 *   with fewer).
 * - Public subnets hold only the ALB/NAT; ECS, RDS, and cache live in
 *   private (egress-only) subnets - spec: "RDS and ElastiCache are not
 *   publicly reachable."
 * - VPC endpoints for S3/SQS/ECR/CloudWatch reduce public egress and cost
 *   (spec: "reduce public network exposure").
 *
 * NOT deployed by this session - see ADR 0001 section 11 and CLAUDE.md's
 * safety rules: creating real AWS infrastructure needs an explicit,
 * separate approval and a real AWS account, neither of which exist yet.
 */
export class NetworkStack extends Stack {
  public readonly vpc: ec2.Vpc;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.vpc = new ec2.Vpc(this, "NauterioVpc", {
      maxAzs: 3,
      natGateways: 2, // one per AZ minus one, for cost/resilience balance at launch scale (spec 33.1's launch assumptions)
      subnetConfiguration: [
        {
          name: "public",
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 24,
        },
        {
          name: "private-app",
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
          cidrMask: 20,
        },
        {
          name: "private-data",
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
          cidrMask: 24,
        },
      ],
    });

    // VPC endpoints so ECS tasks reach these AWS services without a public
    // route (spec 22.3).
    this.vpc.addGatewayEndpoint("S3Endpoint", { service: ec2.GatewayVpcEndpointAwsService.S3 });
    this.vpc.addInterfaceEndpoint("EcrApiEndpoint", { service: ec2.InterfaceVpcEndpointAwsService.ECR });
    this.vpc.addInterfaceEndpoint("EcrDockerEndpoint", { service: ec2.InterfaceVpcEndpointAwsService.ECR_DOCKER });
    this.vpc.addInterfaceEndpoint("CloudWatchLogsEndpoint", {
      service: ec2.InterfaceVpcEndpointAwsService.CLOUDWATCH_LOGS,
    });
    this.vpc.addInterfaceEndpoint("SqsEndpoint", { service: ec2.InterfaceVpcEndpointAwsService.SQS });
    this.vpc.addInterfaceEndpoint("SecretsManagerEndpoint", {
      service: ec2.InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
    });

    Tags.of(this).add("nauterio:stack", "network");
  }
}
