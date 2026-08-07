# 38. AI-assisted build protocol

<table>
<colgroup>
<col style="width: 1%" />
<col style="width: 98%" />
</colgroup>
<thead>
<tr class="header">
<th></th>
<th><strong>AI use rule<br />
</strong>AI may accelerate implementation, but it must not invent business rules, provider fields, credentials, legal text, prices, status transitions or database changes. Every output is reviewed, tested and merged through the same engineering process as human-written code.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## 38.1 Work-package method

103. Select one approved route/module and cite the exact specification sections, entities, API contract and acceptance criteria.

104. Ask the AI to restate assumptions, affected files, data/security impact and tests before writing code.

105. Create or update shared contract/schema first; do not duplicate types locally.

106. Implement the smallest vertical slice across UI, API, database and test fixtures.

107. Generate unit/integration/end-to-end tests and accessibility states with the feature.

108. Run all checks, inspect migration diff and review for secrets/PII/log leakage.

109. Have a qualified developer review; deploy to preview/staging; obtain business acceptance; then merge/release.

## 38.2 Required prompt header for coding AI

PROJECT: Nauterio Logistics  
SPECIFICATION: Complete Product and Technical Specification v1.0  
FEATURE: \<exact screen/module/use case\>  
SOURCE SECTIONS: \<section numbers and appendix rows\>  
STACK: TypeScript, Node.js 24 LTS, Next.js 16.3, NestJS 11, PostgreSQL 18, Prisma 7, AWS  
RULES:  
- Do not invent business rules, fields, statuses, prices or provider responses.  
- Use existing shared contracts, design tokens, permissions and error format.  
- Enforce authorisation on the server.  
- Use integer minor units for money and UTC timestamps.  
- Preserve audit and idempotency requirements.  
- Do not log secrets, addresses, document contents or payment data.  
- Include loading, empty, validation, error, permission and success states.  
- Include unit/integration/end-to-end tests appropriate to the change.  
DELIVERABLE: implementation plan, changed files, code, migration if required, tests, manual verification and rollback notes.

## 38.3 Build order for an AI-assisted team

110. Design tokens, component library, route shells and localisation foundation.

111. Identity, user/organisation context and permission framework.

112. Database schema, migrations, audit and outbox/inbox framework.

113. Services/routes/rating and quote vertical slice.

114. Booking, shipment, package and tracking vertical slice.

115. Documents, labels and customs vertical slice.

116. Payments, invoices and notification vertical slice.

117. Admin operations, warehouse and driver workflows.

118. Claims, returns, support and business integration features.

119. Security/performance/recovery hardening and controlled pilot.

## 38.4 AI completion checklist

- Requirement and acceptance criterion referenced.

- No invented business/legal/provider rule.

- Authorisation and privacy reviewed.

- Validation, idempotency and audit included where applicable.

- Responsive and accessible states present.

- No secret or sensitive-data logging.

- Tests pass and fail for the expected reasons.

- Migration and rollback reviewed.

- Staging evidence/screenshots/API examples attached.

- Human code and business review complete.
