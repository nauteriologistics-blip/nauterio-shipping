# 33. Performance, scale and reliability

## 33.1 Launch and growth assumptions

| **Measure**          | **Launch design**                      | **Growth without redesign**                                |
|----------------------|----------------------------------------|------------------------------------------------------------|
| Shipments/month      | 1,000                                  | 20,000+                                                    |
| Registered customers | 10,000                                 | 250,000                                                    |
| Staff/partner users  | 130 total                              | 300+                                                       |
| Facilities           | Up to 5                                | Multiple countries/facilities                              |
| Stored documents     | 100,000                                | Millions                                                   |
| Peak public tracking | 50 concurrent normal; load-test higher | About 1,000 concurrent burst with scaling/caching controls |
| Tracking events      | ~30 per shipment average               | Millions overall                                           |

## 33.2 Service-level objectives

| **Measure**                      | **Target**                                                                                                 |
|----------------------------------|------------------------------------------------------------------------------------------------------------|
| Critical monthly availability    | 99.9% excluding approved maintenance.                                                                      |
| Public tracking latency          | p95 below 1.5 seconds at planned traffic.                                                                  |
| Normal authenticated list/search | p95 below 2 seconds for ordinary filters.                                                                  |
| Quote calculation                | Below 2 seconds for configured automatic parcel quote; manual freight returns acknowledgement immediately. |
| Normal UI interaction            | Client response under 300 ms when no network operation is required.                                        |
| Label generation                 | Below 5 seconds for normal label.                                                                          |
| Standard PDF                     | Below 10 seconds; otherwise asynchronous.                                                                  |
| RPO                              | 15 minutes for critical transactional data.                                                                |
| RTO                              | 4 hours for critical tracking and operations.                                                              |

## 33.3 Reliability controls

- Multi-AZ RDS, automated backups and point-in-time recovery; quarterly restore test.

- Critical S3 versioning/lifecycle and cross-region recovery copy according to classification.

- At least two critical service tasks after pilot, health checks and automatic replacement.

- SQS decoupling, dead-letter queues, alarms and replay tools.

- Provider timeouts, retries, circuit breakers and scheduled reconciliation for stuck transitional states.

- Graceful degradation: public content/tracking explanation remains available when quote/payment/carrier systems are impaired where technically possible.

- Independent status page and incident communication.

## 33.4 Disaster recovery

- Pilot-light recovery in Frankfurt rather than costly active-active launch architecture.

- Infrastructure recreated from CDK; database restored from approved recovery point; critical objects replicated/restored; DNS switched under runbook.

- Quarterly technical exercise and annual business continuity exercise.

- Recovery credentials and runbooks available to named company-controlled personnel, not only an external developer.
