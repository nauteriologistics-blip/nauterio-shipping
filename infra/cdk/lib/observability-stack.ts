import { Stack, StackProps, Tags, Duration } from "aws-cdk-lib";
import * as cloudwatch from "aws-cdk-lib/aws-cloudwatch";
import * as sns from "aws-cdk-lib/aws-sns";
import * as rds from "aws-cdk-lib/aws-rds";
import * as budgets from "aws-cdk-lib/aws-budgets";
import * as iam from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

export interface ObservabilityStackProps extends StackProps {
  database: rds.DatabaseInstance;
}

/**
 * Observability stack (ADR 0001 section 10, spec section 34.2's required
 * alarms table). Implements the subset of alarms that depend only on
 * resources this CDK app already creates (database). The remaining
 * alarms in spec 34.2 - queue oldest-message age, payment webhook
 * failures, notification bounce spikes, cert/domain expiry, cost anomaly -
 * depend on SQS queues, SES identities, and a real domain that do not
 * exist yet (ADR 0001 section 11); add them as those resources are
 * provisioned, not as empty placeholder alarms now.
 */
export class ObservabilityStack extends Stack {
  constructor(scope: Construct, id: string, props: ObservabilityStackProps) {
    super(scope, id, props);

    const alertTopic = new sns.Topic(this, "NauterioAlertsTopic", {
      displayName: "Nauterio operational alerts",
    });
    // Real subscription endpoints (PagerDuty/Slack/email) are added by an
    // authorised operator post-deploy - not hardcoded here.

    new cloudwatch.Alarm(this, "DatabaseCpuHighAlarm", {
      metric: props.database.metricCPUUtilization(),
      threshold: 80,
      evaluationPeriods: 3,
      datapointsToAlarm: 3,
      alarmDescription: "RDS CPU utilisation above 80% for 3 consecutive periods",
    }).addAlarmAction({ bind: () => ({ alarmActionArn: alertTopic.topicArn }) });

    new cloudwatch.Alarm(this, "DatabaseFreeStorageLowAlarm", {
      metric: props.database.metricFreeStorageSpace(),
      threshold: 5 * 1024 * 1024 * 1024, // 5 GiB
      comparisonOperator: cloudwatch.ComparisonOperator.LESS_THAN_THRESHOLD,
      evaluationPeriods: 1,
      alarmDescription: "RDS free storage below 5 GiB - spec 34.2: escalate immediately, protect writes and scale/repair",
    }).addAlarmAction({ bind: () => ({ alarmActionArn: alertTopic.topicArn }) });

    new cloudwatch.Alarm(this, "DatabaseFreeableMemoryLowAlarm", {
      metric: props.database.metricFreeableMemory(),
      threshold: 256 * 1024 * 1024, // 256 MiB
      comparisonOperator: cloudwatch.ComparisonOperator.LESS_THAN_THRESHOLD,
      evaluationPeriods: 3,
      alarmDescription: "RDS freeable memory low for 3 consecutive periods",
    }).addAlarmAction({ bind: () => ({ alarmActionArn: alertTopic.topicArn }) });

    // REL-013: an AWS Budgets alarm needs no application resource and was
    // flagged as addable today. Threshold is REQUIRES_BUSINESS_EVIDENCE - no
    // approved monthly AWS spend target exists yet; $500/month is a
    // conservative placeholder for a launch-scale single-region deployment,
    // not a business figure. Budgets requires the SNS topic to explicitly
    // allow the budgets service principal to publish.
    alertTopic.addToResourcePolicy(
      new iam.PolicyStatement({
        actions: ["sns:Publish"],
        principals: [new iam.ServicePrincipal("budgets.amazonaws.com")],
        resources: [alertTopic.topicArn],
      })
    );

    new budgets.CfnBudget(this, "NauterioMonthlyCostBudget", {
      budget: {
        budgetType: "COST",
        timeUnit: "MONTHLY",
        budgetLimit: { amount: 500, unit: "USD" }, // REQUIRES_BUSINESS_EVIDENCE - placeholder, not an approved figure
      },
      notificationsWithSubscribers: [
        {
          notification: {
            notificationType: "ACTUAL",
            comparisonOperator: "GREATER_THAN",
            threshold: 80,
            thresholdType: "PERCENTAGE",
          },
          subscribers: [{ subscriptionType: "SNS", address: alertTopic.topicArn }],
        },
        {
          notification: {
            notificationType: "FORECASTED",
            comparisonOperator: "GREATER_THAN",
            threshold: 100,
            thresholdType: "PERCENTAGE",
          },
          subscribers: [{ subscriptionType: "SNS", address: alertTopic.topicArn }],
        },
      ],
    });

    new cloudwatch.Dashboard(this, "NauterioOperationalDashboard", {
      dashboardName: "nauterio-operational",
      widgets: [
        [
          new cloudwatch.GraphWidget({
            title: "Database CPU",
            left: [props.database.metricCPUUtilization()],
            period: Duration.minutes(5),
          }),
          new cloudwatch.GraphWidget({
            title: "Database connections",
            left: [props.database.metricDatabaseConnections()],
            period: Duration.minutes(5),
          }),
        ],
      ],
    });

    Tags.of(this).add("nauterio:stack", "observability");
  }
}
