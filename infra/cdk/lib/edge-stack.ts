import { Stack, StackProps, Tags } from "aws-cdk-lib";
import * as wafv2 from "aws-cdk-lib/aws-wafv2";
import type * as elbv2 from "aws-cdk-lib/aws-elasticloadbalancingv2";
import { Construct } from "constructs";

export interface EdgeStackProps extends StackProps {
  alb: elbv2.ApplicationLoadBalancer;
}

/**
 * Edge stack (ADR 0001 section 10, spec sections 21.1, 22.1, 31).
 *
 * REL-012: this previously created a CLOUDFRONT-scoped WebACL, associated
 * with nothing. That scope cannot be associated with an ALB at all (only
 * with a CloudFront distribution, which correctly does not exist yet - see
 * below), and CLOUDFRONT-scoped WebACLs can only be created in us-east-1,
 * while this app deploys everything to eu-south-1 - `cdk deploy` of the
 * original resource would have failed outright. This is now a REGIONAL
 * WebACL, explicitly associated with the real ALB that actually serves
 * traffic today, so it is load-bearing rather than an orphan resource.
 *
 * CloudFront distribution and Route 53 records are still deliberately NOT
 * included: both need a real, registered domain (spec's "Decisions still
 * requiring real company evidence": "Final .com availability, trademark
 * clearance and ownership registration") which does not exist. Add a
 * second, CLOUDFRONT-scoped WebACL in a us-east-1-pinned stack alongside
 * the distribution once a real domain is confirmed - do not wire either to
 * a placeholder/fake domain (CLAUDE.md: no fabricated business facts).
 */
export class EdgeStack extends Stack {
  public readonly webAcl: wafv2.CfnWebACL;

  constructor(scope: Construct, id: string, props: EdgeStackProps) {
    super(scope, id, props);

    this.webAcl = new wafv2.CfnWebACL(this, "NauterioWebAcl", {
      scope: "REGIONAL",
      defaultAction: { allow: {} },
      visibilityConfig: {
        cloudWatchMetricsEnabled: true,
        metricName: "NauterioWebAcl",
        sampledRequestsEnabled: true,
      },
      rules: [
        {
          name: "AWSManagedRulesCommonRuleSet",
          priority: 0,
          statement: { managedRuleGroupStatement: { vendorName: "AWS", name: "AWSManagedRulesCommonRuleSet" } },
          overrideAction: { none: {} },
          visibilityConfig: {
            cloudWatchMetricsEnabled: true,
            metricName: "CommonRuleSet",
            sampledRequestsEnabled: true,
          },
        },
        {
          name: "RateLimitPerIp",
          priority: 1,
          statement: {
            rateBasedStatement: { limit: 2000, aggregateKeyType: "IP" }, // spec 31: "rate limits" - starting point, tune against real traffic
          },
          action: { block: {} },
          visibilityConfig: {
            cloudWatchMetricsEnabled: true,
            metricName: "RateLimitPerIp",
            sampledRequestsEnabled: true,
          },
        },
      ],
    });

    new wafv2.CfnWebACLAssociation(this, "NauterioWebAclAlbAssociation", {
      resourceArn: props.alb.loadBalancerArn,
      webAclArn: this.webAcl.attrArn,
    });

    Tags.of(this).add("nauterio:stack", "edge");
  }
}
