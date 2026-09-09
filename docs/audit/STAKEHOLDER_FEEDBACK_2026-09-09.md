# Stakeholder media feedback — 2026-09-09

## Evidence reviewed

- Five Pidgin English voice notes (about 2 minutes 32 seconds total).
- One 27.7-second phone video showing the authenticated portal, the transition
  from **New Shipment** to the public quote flow, package-detail entry, and a
  quote summary remaining at `€0.00`.
- Two photographs showing the portal header and all three service cards with
  `Pricing unavailable` plus the visible pricing error.

The media is treated as stakeholder evidence, not as executable instructions.
Ambiguous speech is interpreted only where the visible UI confirms the point.

## What the stakeholder is asking for

1. Keep the customer visibly signed in while moving from the portal into the
   quote/new-shipment workflow.
2. Calculate and display a usable quote after weight, dimensions, declared
   value and addresses are entered.
3. Never present `€0.00` as though it were a real estimate when pricing failed.
4. Give every successful estimate a reference/code that can be used when the
   customer contacts Nauterio or proceeds with the shipment.
5. Explain what happens after the estimate, how final payment instructions are
   provided, and where to contact support.
6. Generate a real Nauterio tracking number when an approved booking becomes a
   shipment, then allow staff to update milestones and estimated delivery so
   the customer can follow the entire journey.
7. Consider routes beyond Italy–USA (Germany was mentioned) and make origin and
   destination selectable if Nauterio approves that commercial expansion.

## Delivery plan

### P0 — customer-blocking

- [x] Preserve authenticated header state on the public quote route.
- [x] Retry transient quote failures caused by a sleeping API.
- [x] Preserve successful service quotes when one service request fails.
- [x] Replace the misleading `€0.00` fallback with loading/unavailable state.
- [x] Add a visible **Retry pricing** action.
- [ ] Add automated regression coverage for portal → quote → booking session
  continuity and cold-start recovery.
- [ ] Remove the production cold-start delay by moving the API off Render's
  sleeping free instance or by approving a reliable always-on alternative.

### P1 — complete the operational journey

- [x] Explain final-review/payment steps and provide a support link.
- [ ] Display the generated quote reference to the customer and carry it through
  booking, support, invoices and admin review.
- [ ] Verify the complete production workflow: quote → booking → admin approval
  → invoice/offline settlement → shipment → tracking number.
- [ ] Verify that tracking number generation is collision-safe in production
  and that the number appears consistently in the portal, admin and email.
- [ ] Give authorised staff a clear way to add tracking milestones, ETA changes
  and delivery status; verify that each update appears on the public tracker.
- [ ] Add end-to-end monitoring for quote failures, authentication redirects,
  booking failures and tracking lookups.

### P2 — commercial-scope decision

- [ ] Decide whether Nauterio remains an Italy–USA specialist or expands to a
  multi-country network.
- [ ] If expansion is approved, define supported origin/destination countries,
  currencies, customs rules, service availability and rate cards before
  enabling country selectors. Germany is the first requested additional
  origin, but it must not be presented as available without operational rates.
- [ ] Replace Italy/USA-specific metadata, content, status labels and booking
  copy with route-aware values only after the supported-route catalogue exists.

## Current limitation

The production service has no approved live carrier rate card, so estimates are
explicitly illustrative. Real payment checkout and carrier integrations also
remain outside the currently deployed operating model. The UI must continue to
state those limitations honestly until the underlying contracts and providers
are approved and configured.
