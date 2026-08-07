import { Stack, StackProps, Tags, RemovalPolicy, Duration } from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as rds from "aws-cdk-lib/aws-rds";
import * as elasticache from "aws-cdk-lib/aws-elasticache";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as kms from "aws-cdk-lib/aws-kms";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import { Construct } from "constructs";

export interface DataStackProps extends StackProps {
  vpc: ec2.Vpc;
}

/**
 * Data stack (ADR 0001 section 10, spec sections 20, 22.3, 33.3).
 *
 * - A KMS key for database/S3/secrets encryption at rest, owned here (not
 *   SecurityStack - see security-stack.ts's doc comment for why: RDS Proxy
 *   needs an IAM grant on it, and a grant to a role in another stack
 *   creates a circular CloudFormation dependency).
 * - RDS PostgreSQL 18, Multi-AZ, private-isolated subnets, encrypted with
 *   that key, automated backups + point-in-time recovery (spec 32: 35-day
 *   PITR retention target).
 * - RDS Proxy in front of it (ADR 0001 section 4.3 - this is the
 *   research-driven addition: Prisma 7's driver-adapter pooling has no
 *   default timeout, and N horizontally-scaled Fargate tasks each holding
 *   their own pool will exhaust RDS connections without a proxy in front).
 * - ElastiCache Serverless for Valkey - rate limits/locks only, never a
 *   system of record (spec 29.3).
 * - Two S3 buckets: a private quarantine bucket for unscanned uploads and
 *   a separate protected bucket for approved documents (spec 28.1's
 *   secure-upload flow requires these to be genuinely separate, not the
 *   same bucket with a prefix, so an IAM policy mistake can't expose
 *   unscanned files).
 */
export class DataStack extends Stack {
  public readonly database: rds.DatabaseInstance;
  public readonly quarantineBucket: s3.Bucket;
  public readonly documentsBucket: s3.Bucket;
  public readonly dataKey: kms.Key;

  constructor(scope: Construct, id: string, props: DataStackProps) {
    super(scope, id, props);

    this.dataKey = new kms.Key(this, "NauterioDataKey", {
      description: "Nauterio Logistics - database/S3/secrets encryption key",
      enableKeyRotation: true,
      removalPolicy: RemovalPolicy.RETAIN, // never destroy a key that may still protect data at rest
    });

    const dbSecurityGroup = new ec2.SecurityGroup(this, "DatabaseSecurityGroup", {
      vpc: props.vpc,
      description: "Nauterio RDS PostgreSQL - inbound only from the app security group",
      allowAllOutbound: false,
    });

    // Owned here, not in SecurityStack - see this file's class doc comment
    // for why (avoids a circular cross-stack dependency with RDS Proxy).
    const databaseCredentialsSecret = new secretsmanager.Secret(this, "DatabaseCredentials", {
      description: "RDS PostgreSQL master credentials",
      encryptionKey: this.dataKey,
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: "nauterio_admin" }),
        generateStringKey: "password",
        excludePunctuation: true,
        passwordLength: 32,
      },
    });

    this.database = new rds.DatabaseInstance(this, "NauterioDatabase", {
      engine: rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_18 }),
      vpc: props.vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
      securityGroups: [dbSecurityGroup],
      credentials: rds.Credentials.fromSecret(databaseCredentialsSecret),
      storageEncryptionKey: this.dataKey,
      multiAz: true, // spec 33.3: "Multi-AZ RDS, automated backups and point-in-time recovery"
      backupRetention: Duration.days(35), // spec Appendix G: "Database point-in-time backups: 35 days"
      deletionProtection: true,
      removalPolicy: RemovalPolicy.RETAIN,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T4G, ec2.InstanceSize.MEDIUM), // launch-scale sizing per spec 33.1; revisit before real load testing
      publiclyAccessible: false, // spec 22.3: "RDS and ElastiCache are not publicly reachable"
      cloudwatchLogsExports: ["postgresql"],
    });

    // RDS Proxy - see class doc comment above for why this is not optional.
    new rds.DatabaseProxy(this, "NauterioDatabaseProxy", {
      proxyTarget: rds.ProxyTarget.fromInstance(this.database),
      secrets: [databaseCredentialsSecret],
      vpc: props.vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
      securityGroups: [dbSecurityGroup],
      requireTLS: true,
    });

    // ElastiCache Serverless for Valkey (spec 20's approved stack table).
    const cacheSecurityGroup = new ec2.SecurityGroup(this, "CacheSecurityGroup", {
      vpc: props.vpc,
      description: "Nauterio ElastiCache Valkey - inbound only from the app security group",
      allowAllOutbound: false,
    });
    new elasticache.CfnServerlessCache(this, "NauterioCache", {
      engine: "valkey",
      serverlessCacheName: "nauterio-cache",
      securityGroupIds: [cacheSecurityGroup.securityGroupId],
      subnetIds: props.vpc.selectSubnets({ subnetType: ec2.SubnetType.PRIVATE_ISOLATED }).subnetIds,
    });

    this.quarantineBucket = new s3.Bucket(this, "NauterioQuarantineBucket", {
      encryption: s3.BucketEncryption.KMS,
      encryptionKey: this.dataKey,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL, // spec 28.1/31: no public URLs, ever
      versioned: true,
      lifecycleRules: [{ expiration: Duration.days(7) }], // unscanned files do not linger
      removalPolicy: RemovalPolicy.RETAIN,
    });

    this.documentsBucket = new s3.Bucket(this, "NauterioDocumentsBucket", {
      encryption: s3.BucketEncryption.KMS,
      encryptionKey: this.dataKey,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      versioned: true, // spec 33.3: "Critical S3 versioning/lifecycle"
      removalPolicy: RemovalPolicy.RETAIN,
    });

    Tags.of(this).add("nauterio:stack", "data");
  }
}
