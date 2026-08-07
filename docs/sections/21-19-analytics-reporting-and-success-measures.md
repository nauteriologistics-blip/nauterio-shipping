# 19. Analytics, reporting and success measures

## 19.1 Customer funnel events

- Homepage primary action; tracking search/success/error; quote start/complete/manual review; account registration/verification; booking step completion; payment success/failure; pickup booked; shipment created; support escalation.

- Analytics must not record raw address, item description, tracking number, payment detail or uploaded-file contents.

## 19.2 Operational KPIs

| **KPI**                      | **Definition**                                                        |
|------------------------------|-----------------------------------------------------------------------|
| Quote conversion             | Accepted quotes divided by issued eligible quotes.                    |
| Booking completion           | Completed bookings divided by started bookings.                       |
| First-pass document approval | Documents approved without replacement divided by reviewed documents. |
| Warehouse dwell time         | Time from receipt to dispatch, separated by service and exception.    |
| On-time milestone rate       | Milestones achieved within the configured service target.             |
| Delivery success             | Delivered without failed attempt divided by attempted deliveries.     |
| Claim rate                   | Claims per delivered shipment by type, service and partner.           |
| Support self-service         | Tracking/help sessions that do not create a ticket.                   |
| Payment reconciliation age   | Time between payment provider/bank event and full allocation.         |
| Data quality                 | Address, measurement, commodity and customs error rates.              |

**PART II**

**Technical Architecture and Implementation**

> This part converts the business and screen requirements into an exact technology, data, security, integration, testing and delivery specification.

**Nauterio Logistics**
