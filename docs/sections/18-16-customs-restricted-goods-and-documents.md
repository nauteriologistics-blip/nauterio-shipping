# 16. Customs, restricted goods and documents

<table>
<colgroup>
<col style="width: 1%" />
<col style="width: 98%" />
</colgroup>
<thead>
<tr class="header">
<th></th>
<th><strong>Legal boundary<br />
</strong>The platform can guide, validate and coordinate documents, but it is not a substitute for a licensed customs broker or legal advice. Final import/export responsibilities, importer-of-record model and DDP/DAP use require professional approval.</th>
</tr>
</thead>
<tbody>
</tbody>
</table>

## 16.1 Required customs data

- Detailed plain-language item description, quantity, unit and total value, currency, country of origin, intended use and HS code where known.

- Sender, receiver and importer details; commercial invoice and packing list for commercial shipments.

- Supporting licences/certificates for controlled categories.

- Battery, liquid, food, medicine, chemical, perishable and high-value screening answers.

- Customer declaration that contents and value are complete and accurate.

## 16.2 Prohibited and restricted handling

| **Category**                                                                                     | **Platform treatment**                                                                                                     |
|--------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------|
| Illegal drugs, illegal weapons, explosives, stolen/counterfeit goods and items prohibited by law | Block booking and refer to policy; preserve required incident information and escalate according to law.                   |
| Batteries and battery-powered equipment                                                          | Require battery type/configuration questions and compliance review; IATA guidance applies to air transport \[L6\].         |
| Food, plants, seeds, meat, dairy and animal products                                             | Require pre-approval and relevant US agency/customs guidance; CBP lists many agricultural categories as restricted \[L4\]. |
| Medicines and medical devices                                                                    | Require regulatory and prescription/commercial review; do not offer automatic acceptance.                                  |
| Alcohol, tobacco, chemicals, aerosols, perfume and paint                                         | Require service/carrier and legal approval; block automatic booking.                                                       |
| High-value jewellery, precious metal, artwork and antiques                                       | Require value, provenance, insurer/carrier approval and enhanced proof.                                                    |
| Dangerous, perishable, temperature-controlled or live goods                                      | Not available at launch unless a specialist approved service is configured.                                                |

## 16.3 Document lifecycle

60. Customer uploads through a private controlled channel.

61. System validates extension, content signature, size and malware scan \[Q3\].

62. Document receives type, owner, shipment, version and review status.

63. Customs/operations reviewer approves, rejects or requests replacement with a reason.

64. Approved file is provided to the authorised carrier/broker through the integration or controlled download.

65. Views/downloads of sensitive documents are logged where required.

66. Retention/lifecycle rules archive or delete the object after the approved period.
