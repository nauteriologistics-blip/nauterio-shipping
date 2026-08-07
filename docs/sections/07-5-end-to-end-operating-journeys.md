# 5. End-to-end operating journeys

<img src="/mnt/data/Nauterio_Claude_Code_Skills_Kit/docs/spec-media/media/image2.png" style="width:7in;height:2.53333in" alt="Image: image2.png" />

*Figure 1. The shared customer and operations journey. Every milestone is backed by a real event.*

## 5.1 Standard parcel journey

16. Customer gets a quote using origin, destination, package measurements, weight and content summary.

17. Customer selects a service, enters sender/receiver and customs items, chooses pickup/drop-off, reviews declarations and pays.

18. The platform creates master and package numbers, invoice/receipt and a label.

19. Warehouse or driver scan records physical custody; warehouse confirms condition and measurements.

20. If measurements change the price, the system creates a review and does not silently charge.

21. Customs documents are reviewed; verified carrier/broker events update export, transit and import milestones.

22. Delivery agent records required proof; customer receives the delivered event and controlled proof link.

23. Shipment closes after finance, document and exception checks; records move to retention rather than deletion.

## 5.2 Manual commercial cargo quote

24. Business customer provides cartons/pallets, commodity, values, service mode, pickup/delivery and target date.

25. Operations requests carrier/freight costs; pricing records cost, margin, validity and approvals.

26. Customer receives a PDF and portal quote, accepts it and supplies any required commercial documents.

27. Accepted quote creates the booking; deposit or full payment is collected according to terms.

28. Cargo milestones, documents and amendments remain visible in the same shipment record.

## 5.3 Customs action journey

29. Customs/broker event creates a case with action type, owner, deadline and public wording.

30. Customer receives the exact document, clarification or payment request, not a generic “customs issue” message.

31. Uploaded evidence enters a review queue and remains private.

32. Broker response and release reference are stored; public status changes only after authorised confirmation.

33. If goods are refused, seized, abandoned or returned, the applicable policy and cost process is recorded.

## 5.4 Delay or missing shipment journey

34. A carrier gap, missed milestone or staff report creates an exception; it does not automatically label the shipment lost.

35. Operations investigates scans, custody, partner data and warehouse movements.

36. Customer sees controlled “delayed” or “under investigation” wording and receives meaningful updates.

37. Loss is confirmed only by an authorised decision, after which claim/compensation rules apply.

## 5.5 Claim journey

38. Customer starts from an authenticated shipment where possible.

39. The form asks only evidence relevant to loss, damage, missing contents, incorrect delivery or charge dispute.

40. Claims staff check eligibility, evidence, liability, carrier case and protection terms.

41. Decision, appeal, payment and closure remain visible with a complete audit trail.
