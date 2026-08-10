#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { NetworkStack } from "../lib/network-stack";
import { SecurityStack } from "../lib/security-stack";
import { DataStack } from "../lib/data-stack";
import { ComputeStack } from "../lib/compute-stack";
import { EdgeStack } from "../lib/edge-stack";
import { ObservabilityStack } from "../lib/observability-stack";

/**
 * Nauterio Logistics AWS infrastructure (ADR 0001 section 10).
 *
 * `env` is deliberately left undefined by default - CDK will use whatever
 * account/region the CLI's current credentials resolve to. This app has
 * NOT been synthesized against a real AWS account by this session, and
 * must not be `cdk deploy`-ed without explicit user approval (CLAUDE.md:
 * "Do not... Create or destroy production infrastructure... without
 * explicit user approval in the current session").
 */
const app = new cdk.App();

const env: cdk.Environment | undefined = process.env.CDK_DEFAULT_ACCOUNT
  ? { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION ?? "eu-south-1" }
  : undefined;

const network = new NetworkStack(app, "Nauterio-Network", { env });
new SecurityStack(app, "Nauterio-Security", { env });
const data = new DataStack(app, "Nauterio-Data", {
  env,
  vpc: network.vpc,
});
const compute = new ComputeStack(app, "Nauterio-Compute", {
  env,
  vpc: network.vpc,
  databaseProxy: data.databaseProxy,
  databaseCredentialsSecret: data.databaseCredentialsSecret,
});
new EdgeStack(app, "Nauterio-Edge", { env, alb: compute.alb });
new ObservabilityStack(app, "Nauterio-Observability", { env, database: data.database });

cdk.Tags.of(app).add("nauterio:project", "logistics-platform");
cdk.Tags.of(app).add("nauterio:managed-by", "cdk");
