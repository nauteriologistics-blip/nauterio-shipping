# 20. Approved technology stack

| **Layer**              | **Approved choice**                              | **Reason and implementation rule**                                                                                            |
|------------------------|--------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------|
| Language               | TypeScript                                       | One language across web, API, workers, shared contracts and infrastructure; strong type checking and AI-friendly consistency. |
| Runtime                | Node.js 24 LTS                                   | Use the active LTS line at specification date \[T1\]. Pin exact patch in containers and update through controlled releases.   |
| Public/customer web    | Next.js 16.3                                     | Server rendering, App Router, internationalisation, responsive UI and PWA assets \[T2\].                                      |
| Administration web     | Separate Next.js 16.3 application                | Security and deployment separation from public/customer interfaces.                                                           |
| API                    | NestJS 11                                        | Modular TypeScript REST service, validation, dependency injection, OpenAPI and webhook endpoints \[T3\].                      |
| Database               | PostgreSQL 18 on Amazon RDS                      | Relational transactions, constraints, JSON where justified, robust indexing and managed recovery \[T4\].                      |
| ORM/data access        | Prisma ORM 7 plus reviewed SQL                   | Type-safe access and migrations; parameterised SQL for complex reporting when necessary \[T5\].                               |
| Architecture           | Modular monolith with event-driven workers       | Avoid premature microservices while keeping clear module boundaries.                                                          |
| Containers             | Docker on Amazon ECS Fargate                     | Separate web, admin, API and worker services without managing servers \[T7\].                                                 |
| Queues                 | Amazon SQS                                       | Asynchronous jobs, retries, dead-letter queues and workload isolation.                                                        |
| Cache/locks            | Amazon ElastiCache Serverless for Valkey         | Rate-limit counters, short-lived cache and distributed locks; never source-of-truth records.                                  |
| Files                  | Amazon S3 with KMS                               | Private objects, lifecycle, versioning, signed access and replication.                                                        |
| Identity               | Amazon Cognito User Pools                        | Email verification, password/passkey, MFA, token/session management; application roles remain in PostgreSQL.                  |
| Payments               | Stripe primary; PayPal secondary                 | Hosted/controlled payment surfaces, verified webhooks and idempotency \[T8\].                                                 |
| Maps/address           | Google Maps Platform                             | Address Validation, Places, geocoding and route launch \[T9\].                                                                |
| Messaging              | Amazon SES + Twilio                              | Transactional email, SMS and WhatsApp; verify provider webhooks \[T10\].                                                      |
| Support                | Zendesk Support and Messaging                    | Mature ticket/chat workspace rather than building custom chat \[T11\].                                                        |
| Infrastructure as code | AWS CDK v2 in TypeScript                         | Versioned, reproducible AWS environments.                                                                                     |
| CI/CD                  | GitHub Actions                                   | Build, test, scan, container publish and controlled environment deployments.                                                  |
| Observability          | OpenTelemetry + CloudWatch/CloudTrail            | Structured logs, metrics, traces, audit and alarms.                                                                           |
| Testing                | Jest, React Testing Library, Playwright, k6, axe | Unit, integration, component, end-to-end, load and accessibility coverage.                                                    |
| Package/repository     | pnpm monorepo in company GitHub organisation     | Shared packages without duplicate definitions and company ownership.                                                          |

<table>
<colgroup>
<col style="width: 1%" />
<col style="width: 98%" />
</colgroup>
<thead>
<tr class="header">
<th></th>
<th><strong>Version policy<br />
</strong>The major stack choices are fixed for the first build. Exact patch versions must be pinned in the lockfile and container images. Before development begins, the technical lead must verify current security releases and compatibility; version upgrades require staging tests, migration notes and rollback instructions.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## 20.1 Why a modular monolith

- Shipment, package, quote, payment, customs and claim transactions require strong consistency and are easier to reason about inside one deployable API boundary.

- A small team can develop, test and operate it without the network, deployment and tracing burden of many microservices.

- Clear modules, events, queues and database ownership rules preserve a future extraction path if volume or organisation boundaries justify it.

- Carrier, payment, notification and document work still runs asynchronously so external outages do not block normal requests.
