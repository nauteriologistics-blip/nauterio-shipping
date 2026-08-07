# 8. Global navigation and reusable components

## 8.1 Header behaviour

- Desktop: logo left; six primary navigation items; language, sign in and Get a Quote right.

- Mobile: logo, tracking shortcut, account icon and menu. Get a Quote remains visible in the menu header or sticky action area.

- Header is sticky only when it does not cover form errors or reduce mobile usable height excessively.

- Logged-in portal navigation replaces marketing navigation with Dashboard, Shipments, Quotes, Pickups, Payments, Documents, Claims and Support.

- Admin, warehouse and driver applications have separate headers and must never reveal inaccessible public/customer controls.

## 8.2 Required component library

| **Component family** | **Required variants and behaviour**                                                                                             |
|----------------------|---------------------------------------------------------------------------------------------------------------------------------|
| Buttons              | Primary, secondary, tertiary/link, destructive, loading, disabled and icon variants.                                            |
| Inputs               | Text, email, telephone, address, currency, measurement, date, time, select, autocomplete, checkbox, radio, file upload and OTP. |
| Tracking             | Tracking input, copyable ID, milestone timeline, status badge, exception card, ETA, location and proof block.                   |
| Cards                | Service, shipment, quote, invoice, support, action-required, empty-state and KPI cards.                                         |
| Tables               | Responsive data table, filters, sorting, pagination, bulk select, export and column controls.                                   |
| Feedback             | Inline validation, error summary, toast, banner, modal, confirmation and progress stepper.                                      |
| Documents            | Upload drop zone, scan state, version list, approval badge and secure download.                                                 |
| Navigation           | Breadcrumb, tabs, side navigation, pagination and back link.                                                                    |
| Operational          | Scanner input, offline badge, sync queue, assignment card, signature pad and photo capture.                                     |
| Privacy              | Cookie banner, preference centre, consent checkbox and sensitive-data reveal control.                                           |

## 8.3 Universal states

- Loading state shows what is loading and avoids layout jumps.

- Empty state explains why there is no data and provides the next meaningful action.

- Error state names the problem in plain language and preserves valid user input.

- Permission-denied state does not reveal whether inaccessible records exist.

- Provider-unavailable state separates Nauterio status from carrier/payment/messaging availability.

- Offline state shows queued actions and prevents high-risk offline changes.

- Success state states exactly what happened and gives a reference number or next step.
