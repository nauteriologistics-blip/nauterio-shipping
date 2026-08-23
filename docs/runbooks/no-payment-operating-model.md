# No-payment operating model

Nauterio does not run customer checkout or online card payment in the current operating model. Invoices still exist: they are issued for customer review and internal/offline settlement.

## Active flow

1. Customer creates an account.
2. Customer creates a shipment request from an indicative or approved-rate estimate.
3. Operations reviews the request.
4. Approval creates the invoice, shipment, package row, first tracking event, and customer notification.
5. The customer can review invoice details in the portal.
6. Any commercial settlement, partner delivery terms, or protection terms are handled directly by operations outside the public website.

## Disabled paths

- Stripe is not required in production configuration.
- Render Blueprint does not ask for Stripe secrets.
- Customer portal renders invoice details but no payment action.
- Invoice creation is active for staff/approval flows.
- Invoice payment endpoints fail closed with a clear disabled message.

Historical invoice/payment tables remain in the schema so production data is not destroyed by a destructive migration.
