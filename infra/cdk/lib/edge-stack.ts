import { Stack, StackProps, Tags } from "aws-cdk-lib";
import * as wafv2 from "aws-cdk-lib/aws-wafv2";
import { Construct } from "constructs";

/**
 * Edge stack (ADR 0001 section 10, spec sections 21.1, 22.1, 31).
 *
 * Only the WAF WebACL is created here. CloudFront distribution and Route
 * 53 records are deliberately NOT included yet: both need a real,
 * registered domain (spec's "Decisions still requiring real company
 * evidence": "Final .com availability, trademark clearance and ownership
 * registration") which does not exist. Wiring a CloudFront distribution to
 * a placeholder/fake domain would be exactly the kind of fabricated
 * business fact CLAUDE.md prohibits - add domain-dependent resources once
 * a real domain is confirmed, not before.
 */
export class EdgeStack extends Stack {
  public readonly webAcl: wafv2.CfnWebACL;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.webAcl = new wafv2.CfnWebACL(this, "NauterioWebAcl", {
      scope: "CLOUDFRONT",
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

    Tags.of(this).add("nauterio:stack", "edge");
  }
}
