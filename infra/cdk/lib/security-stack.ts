import { Stack, StackProps, Tags } from "aws-cdk-lib";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import { Construct } from "constructs";

/**
 * Security stack (ADR 0001 section 10, spec section 31 and 31.1).
 *
 * - A Secrets Manager placeholder for the Stripe API key - the value is
 *   never set by CDK/CI (spec: "no secrets in repository... or logs"); an
 *   authorised operator populates it out-of-band after this stack
 *   deploys, once a real Stripe account exists (ADR 0001 section 11).
 *
 * The shared KMS data-encryption key and the RDS master credentials
 * secret are deliberately NOT here - both live in DataStack instead (see
 * data-stack.ts). A KMS key or secret whose IAM grants must reach a
 * consumer role in a DIFFERENT stack creates a circular CloudFormation
 * dependency (the consumer stack references the key/secret, and the
 * key/secret's resource policy is modified to reference the consumer's
 * role back) - CDK cannot resolve that cycle. Owning shared
 * encryption/credentials in the same stack as their primary IAM consumer
 * (RDS, RDS Proxy) avoids the whole class of cycle. This was hit and
 * fixed for real while writing this stack, not a hypothetical concern.
 *
 * WAF, GuardDuty, Security Hub, and CloudTrail organisation trail are
 * account/organisation-level concerns (spec 22.2) that belong in a
 * dedicated security/management account setup, not a per-application
 * stack - out of scope for this stack, noted here so the gap is visible
 * rather than silently assumed.
 */
export class SecurityStack extends Stack {
  public readonly stripeSecret: secretsmanager.Secret;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Placeholder secret shape only - real value is set by an authorised
    // operator via the AWS console/CLI after a real Stripe account exists,
    // never committed or generated here (CLAUDE.md: never invent vendor
    // credentials). Uses the default AWS-managed key, not the shared data
    // key, precisely to avoid the cross-stack grant cycle described above -
    // Stripe's secret has no consumer in another stack yet that would need
    // an explicit grant.
    this.stripeSecret = new secretsmanager.Secret(this, "StripeApiKey", {
      description: "Stripe secret API key - value set manually post-deploy, not by CDK",
    });

    Tags.of(this).add("nauterio:stack", "security");
  }
}
