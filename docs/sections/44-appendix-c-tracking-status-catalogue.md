# Appendix C. Tracking status catalogue

| **Code**                | **Customer label**              | **Meaning**                                                              | **Visibility/control**                   |
|-------------------------|---------------------------------|--------------------------------------------------------------------------|------------------------------------------|
| SHIPMENT_CREATED        | Shipment created                | Booking exists; physical package may not yet be received.                | Customer visible                         |
| AWAITING_PAYMENT        | Awaiting payment                | Required payment has not been completed.                                 | Customer visible                         |
| PAYMENT_CONFIRMED       | Payment confirmed               | Required payment has been recorded.                                      | Customer visible                         |
| PICKUP_SCHEDULED        | Pickup scheduled                | Collection date or window is confirmed.                                  | Customer visible                         |
| PACKAGE_COLLECTED       | Package collected               | Driver has collected the package.                                        | Customer visible                         |
| RECEIVED_ORIGIN         | Received at origin facility     | Package has been scanned into the Italian facility.                      | Customer visible                         |
| PROCESSING_ORIGIN       | Processing at origin facility   | Inspection, measuring, packing and documentation checks are in progress. | Customer visible                         |
| DOCUMENTATION_REQUIRED  | Documentation required          | Customer or importer must provide information or a file.                 | Customer visible; action required        |
| MEASUREMENT_REVIEW      | Measurement review              | Actual dimensions or weight differ from the booking.                     | Customer visible if price changes        |
| READY_FOR_EXPORT        | Ready for export                | Origin processing is complete.                                           | Customer visible                         |
| EXPORT_CLEARANCE        | Export clearance in progress    | Export customs processing is underway.                                   | Customer visible                         |
| EXPORT_CLEARED          | Export clearance completed      | Shipment is cleared for departure.                                       | Customer visible                         |
| DEPARTED_ORIGIN         | Departed Italy                  | Shipment has left the origin country or gateway.                         | Customer visible                         |
| INTERNATIONAL_TRANSIT   | In international transit        | Shipment is moving between origin and destination.                       | Customer visible                         |
| ARRIVED_DESTINATION     | Arrived in the United States    | Shipment has reached the destination country or gateway.                 | Customer visible                         |
| IMPORT_CLEARANCE        | Customs clearance in progress   | US import processing is underway.                                        | Customer visible                         |
| CUSTOMS_ACTION_REQUIRED | Customs action required         | Document, clarification or payment is required.                          | Customer visible; action required        |
| CUSTOMS_HELD            | Held by customs                 | Customs or another authority has placed the shipment on hold.            | Customer visible with controlled wording |
| CUSTOMS_CLEARED         | Customs cleared                 | Import release has been received.                                        | Customer visible                         |
| DESTINATION_FACILITY    | At destination facility         | Shipment is at the delivery facility.                                    | Customer visible                         |
| TRANSFERRED_PARTNER     | Transferred to delivery partner | Custody has moved to an approved last-mile partner.                      | Customer visible                         |
| OUT_FOR_DELIVERY        | Out for delivery                | Final delivery attempt is underway.                                      | Customer visible                         |
| DELIVERY_ATTEMPTED      | Delivery attempted              | A delivery was attempted but not completed.                              | Customer visible; action may be required |
| HELD_FOR_COLLECTION     | Held for collection             | Shipment is available at an approved collection point.                   | Customer visible                         |
| DELIVERED               | Delivered                       | Delivery has been completed with required evidence.                      | Customer visible                         |
| DELAYED                 | Shipment delayed                | The current estimate cannot be met.                                      | Customer visible                         |
| ADDRESS_ISSUE           | Address information required    | Address is invalid, incomplete or inaccessible.                          | Customer visible; action required        |
| DAMAGED                 | Damage reported                 | Damage has been identified and an operational review is open.            | Controlled customer wording              |
| MISSING_INVESTIGATION   | Shipment under investigation    | Shipment or package cannot currently be located.                         | Customer visible                         |
| LOST_CONFIRMED          | Shipment loss confirmed         | Investigation concluded that the shipment is lost.                       | Customer visible after approval          |
| RETURN_REQUESTED        | Return requested                | Return workflow has been initiated.                                      | Customer visible                         |
| RETURN_IN_TRANSIT       | Return in transit               | Shipment is moving back to sender or approved destination.               | Customer visible                         |
| RETURNED_SENDER         | Returned to sender              | Return delivery is complete.                                             | Customer visible                         |
| CANCELLED               | Shipment cancelled              | Booking or shipment has been cancelled.                                  | Customer visible                         |
| ARCHIVED                | Archived                        | Operational record is closed and retained.                               | Internal only                            |

## Status transition controls

- A status transition is permitted only by a configured source/role and may require prerequisite status, location, note, document, payment or evidence.

- External carrier statuses are mapped; they do not automatically become customer-visible if the mapping or payload is ambiguous.

- Backdated events retain received time and source time. Corrections link to the original event rather than deleting it.

- Delivered, loss confirmed, refund approved and claim decision transitions require stronger permission and evidence.
