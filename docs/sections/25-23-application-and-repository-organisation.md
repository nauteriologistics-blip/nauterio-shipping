# 23. Application and repository organisation

## 23.1 Monorepo structure

apps/  
web/ \# public + customer/business portal  
admin/ \# staff administration  
api/ \# NestJS REST API and webhooks  
worker/ \# SQS consumers and scheduled tasks  
packages/  
database/ \# Prisma schema, migrations, query helpers  
contracts/ \# shared API DTOs, events and enums  
ui/ \# approved component library and design tokens  
validation/ \# shared schemas and business validation  
integrations/ \# carrier/payment/messaging adapters  
configuration/ \# typed environment configuration  
observability/ \# logging, metrics, tracing helpers  
testing/ \# fixtures, factories and test utilities  
infra/  
cdk/ \# AWS infrastructure stacks  
docs/  
adr/ \# architecture decision records  
operations/ \# runbooks and support procedures

## 23.2 Code rules

- Strict TypeScript; no implicit any; runtime validation at all external and API boundaries.

- Shared enums/contracts come from one package; do not duplicate tracking statuses or money fields in multiple applications.

- Business logic belongs in domain/application services, not React components or controller methods.

- Database transactions protect multi-record business changes; external network calls do not occur inside long database transactions.

- All provider integrations are behind typed adapters and can be disabled or replaced without changing core shipment logic.

- Money uses integer minor units plus ISO currency; never floating-point totals.

- Measurements store value and unit; normalised comparison values may be stored separately.

- Dates/times are stored in UTC with source timezone/offset metadata when an external/local event is involved.

- Every log includes environment, service, correlation ID and safe identifiers; secrets/PII are redacted.
