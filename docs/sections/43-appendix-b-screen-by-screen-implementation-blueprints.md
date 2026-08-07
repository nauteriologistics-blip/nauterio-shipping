# Appendix B. Screen-by-screen implementation blueprints

The following specification card is repeated for all 201 screens so that no route is left as an unexplained name. Designers may combine shared visual templates, but developers and testers must still implement each route’s purpose, action and access rules.

## Public and authentication

### Home

Route: / \| Area: Public and authentication \| Primary action: Track shipment

| **Specification item** | **Requirement**                                                                                                                                                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain the service, provide tracking and move visitors to quote or shipment creation.                                                                          |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                         |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                    |
| Core content           | The screen must present only information needed to complete “Track shipment”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Track shipment                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                             |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.         |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                     |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                      |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.         |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Track shipment” without undocumented staff assistance.                    |

### Track shipment

Route: /track \| Area: Public and authentication \| Primary action: Track

| **Specification item** | **Requirement**                                                                                                                                         |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Accept one tracking number and explain where to find it.                                                                                                |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                 |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                            |
| Core content           | The screen must present only information needed to complete “Track”, with a clear title, concise explanation, structured data and contextual guidance.  |
| Primary action         | Track                                                                                                                                                   |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                     |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant. |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.             |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.              |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values. |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Track” without undocumented staff assistance.                     |

### Tracking result

Route: /track/\[trackingNumber\] \| Area: Public and authentication \| Primary action: View details

| **Specification item** | **Requirement**                                                                                                                                               |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Show current status, expected delivery, milestones and permitted proof of delivery.                                                                           |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                       |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                  |
| Core content           | The screen must present only information needed to complete “View details”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | View details                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                           |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.       |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                   |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                    |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.       |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “View details” without undocumented staff assistance.                    |

### Track multiple shipments

Route: /track/multiple \| Area: Public and authentication \| Primary action: Track all

| **Specification item** | **Requirement**                                                                                                                                            |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Accept several tracking numbers for business or repeat users.                                                                                              |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                    |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                               |
| Core content           | The screen must present only information needed to complete “Track all”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Track all                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                        |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.    |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                 |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.    |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Track all” without undocumented staff assistance.                    |

### Get a quote

Route: /quote \| Area: Public and authentication \| Primary action: Calculate quote

| **Specification item** | **Requirement**                                                                                                                                                  |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Collect route, package and service details for an instant estimate or manual review.                                                                             |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                          |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                     |
| Core content           | The screen must present only information needed to complete “Calculate quote”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Calculate quote                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                              |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.          |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                      |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                       |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.          |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Calculate quote” without undocumented staff assistance.                    |

### Quote result

Route: /quote/results \| Area: Public and authentication \| Primary action: Select service

| **Specification item** | **Requirement**                                                                                                                                                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Compare available services, prices, transit targets and inclusions.                                                                                             |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                         |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                    |
| Core content           | The screen must present only information needed to complete “Select service”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Select service                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                             |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.         |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                     |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                      |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.         |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Select service” without undocumented staff assistance.                    |

### Start shipment

Route: /ship \| Area: Public and authentication \| Primary action: Start booking

| **Specification item** | **Requirement**                                                                                                                                                |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain the booking process and continue a saved draft.                                                                                                        |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                        |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                   |
| Core content           | The screen must present only information needed to complete “Start booking”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Start booking                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                            |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.        |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                    |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                     |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.        |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Start booking” without undocumented staff assistance.                    |

### Select service

Route: /ship/service \| Area: Public and authentication \| Primary action: Continue

| **Specification item** | **Requirement**                                                                                                                                           |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Choose service level and delivery method.                                                                                                                 |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                   |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                              |
| Core content           | The screen must present only information needed to complete “Continue”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Continue                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                       |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.   |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.               |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.   |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Continue” without undocumented staff assistance.                    |

### Sender details

Route: /ship/sender \| Area: Public and authentication \| Primary action: Continue

| **Specification item** | **Requirement**                                                                                                                                           |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Collect and validate origin contact and address.                                                                                                          |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                   |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                              |
| Core content           | The screen must present only information needed to complete “Continue”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Continue                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                       |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.   |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.               |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.   |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Continue” without undocumented staff assistance.                    |

### Receiver details

Route: /ship/receiver \| Area: Public and authentication \| Primary action: Continue

| **Specification item** | **Requirement**                                                                                                                                           |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Collect and validate destination contact and address.                                                                                                     |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                   |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                              |
| Core content           | The screen must present only information needed to complete “Continue”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Continue                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                       |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.   |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.               |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.   |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Continue” without undocumented staff assistance.                    |

### Package details

Route: /ship/packages \| Area: Public and authentication \| Primary action: Continue

| **Specification item** | **Requirement**                                                                                                                                           |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Capture package count, dimensions, weight and packaging.                                                                                                  |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                   |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                              |
| Core content           | The screen must present only information needed to complete “Continue”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Continue                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                       |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.   |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.               |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.   |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Continue” without undocumented staff assistance.                    |

### Customs contents

Route: /ship/customs \| Area: Public and authentication \| Primary action: Continue

| **Specification item** | **Requirement**                                                                                                                                           |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Capture item descriptions, values, origin and HS information.                                                                                             |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                   |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                              |
| Core content           | The screen must present only information needed to complete “Continue”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Continue                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                       |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.   |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.               |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.   |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Continue” without undocumented staff assistance.                    |

### Pickup or drop-off

Route: /ship/pickup \| Area: Public and authentication \| Primary action: Continue

| **Specification item** | **Requirement**                                                                                                                                           |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Choose collection, time window or warehouse drop-off.                                                                                                     |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                   |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                              |
| Core content           | The screen must present only information needed to complete “Continue”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Continue                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                       |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.   |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.               |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.   |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Continue” without undocumented staff assistance.                    |

### Review shipment

Route: /ship/review \| Area: Public and authentication \| Primary action: Confirm booking

| **Specification item** | **Requirement**                                                                                                                                                  |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Show all details, charges, declarations and terms before payment.                                                                                                |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                          |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                     |
| Core content           | The screen must present only information needed to complete “Confirm booking”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Confirm booking                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                              |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.          |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                      |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                       |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.          |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Confirm booking” without undocumented staff assistance.                    |

### Shipment payment

Route: /ship/payment \| Area: Public and authentication \| Primary action: Pay securely

| **Specification item** | **Requirement**                                                                                                                                               |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Collect payment using hosted provider components.                                                                                                             |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                       |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                  |
| Core content           | The screen must present only information needed to complete “Pay securely”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Pay securely                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                           |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.       |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                   |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                    |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.       |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Pay securely” without undocumented staff assistance.                    |

### Shipment confirmation

Route: /ship/confirmation \| Area: Public and authentication \| Primary action: View shipment

| **Specification item** | **Requirement**                                                                                                                                                |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Show booking, tracking number, documents and next steps.                                                                                                       |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                        |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                   |
| Core content           | The screen must present only information needed to complete “View shipment”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | View shipment                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                            |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.        |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                    |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                     |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.        |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “View shipment” without undocumented staff assistance.                    |

### Services overview

Route: /services \| Area: Public and authentication \| Primary action: Compare services

| **Specification item** | **Requirement**                                                                                                                                                   |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Present all active logistics services and who each suits.                                                                                                         |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                           |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                      |
| Core content           | The screen must present only information needed to complete “Compare services”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Compare services                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                               |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.           |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                       |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                        |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.           |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Compare services” without undocumented staff assistance.                    |

### Air Express

Route: /services/air-express \| Area: Public and authentication \| Primary action: Get quote

| **Specification item** | **Requirement**                                                                                                                                            |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Describe urgent air service, eligibility, timing and exclusions.                                                                                           |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                    |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                               |
| Core content           | The screen must present only information needed to complete “Get quote”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Get quote                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                        |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.    |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                 |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.    |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Get quote” without undocumented staff assistance.                    |

### Air Economy

Route: /services/air-economy \| Area: Public and authentication \| Primary action: Get quote

| **Specification item** | **Requirement**                                                                                                                                            |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Describe lower-cost air service.                                                                                                                           |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                    |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                               |
| Core content           | The screen must present only information needed to complete “Get quote”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Get quote                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                        |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.    |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                 |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.    |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Get quote” without undocumented staff assistance.                    |

### Parcel Shipping

Route: /services/parcels \| Area: Public and authentication \| Primary action: Get quote

| **Specification item** | **Requirement**                                                                                                                                            |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain personal and retail parcel shipping.                                                                                                               |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                    |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                               |
| Core content           | The screen must present only information needed to complete “Get quote”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Get quote                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                        |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.    |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                 |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.    |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Get quote” without undocumented staff assistance.                    |

### Document Shipping

Route: /services/documents \| Area: Public and authentication \| Primary action: Get quote

| **Specification item** | **Requirement**                                                                                                                                            |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain document envelope service and restrictions.                                                                                                        |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                    |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                               |
| Core content           | The screen must present only information needed to complete “Get quote”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Get quote                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                        |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.    |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                 |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.    |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Get quote” without undocumented staff assistance.                    |

### Commercial Cargo

Route: /services/commercial-cargo \| Area: Public and authentication \| Primary action: Request cargo quote

| **Specification item** | **Requirement**                                                                                                                                                      |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain pallet, carton and equipment shipping.                                                                                                                       |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                              |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                         |
| Core content           | The screen must present only information needed to complete “Request cargo quote”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Request cargo quote                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                                  |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.              |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                          |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                           |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.              |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Request cargo quote” without undocumented staff assistance.                    |

### Sea Freight

Route: /services/sea-freight \| Area: Public and authentication \| Primary action: Compare sea options

| **Specification item** | **Requirement**                                                                                                                                                      |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain LCL and FCL options.                                                                                                                                         |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                              |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                         |
| Core content           | The screen must present only information needed to complete “Compare sea options”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Compare sea options                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                                  |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.              |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                          |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                           |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.              |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Compare sea options” without undocumented staff assistance.                    |

### LCL Freight

Route: /services/sea-freight/lcl \| Area: Public and authentication \| Primary action: Request LCL quote

| **Specification item** | **Requirement**                                                                                                                                                    |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain shared-container service and volume pricing.                                                                                                               |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                            |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                       |
| Core content           | The screen must present only information needed to complete “Request LCL quote”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Request LCL quote                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                                |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.            |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                        |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                         |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.            |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Request LCL quote” without undocumented staff assistance.                    |

### FCL Freight

Route: /services/sea-freight/fcl \| Area: Public and authentication \| Primary action: Request FCL quote

| **Specification item** | **Requirement**                                                                                                                                                    |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain dedicated container service.                                                                                                                               |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                            |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                       |
| Core content           | The screen must present only information needed to complete “Request FCL quote”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Request FCL quote                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                                |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.            |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                        |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                         |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.            |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Request FCL quote” without undocumented staff assistance.                    |

### Pickup Service

Route: /services/pickup \| Area: Public and authentication \| Primary action: Book pickup

| **Specification item** | **Requirement**                                                                                                                                              |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain collection availability, preparation and failed-pickup rules.                                                                                        |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                      |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                 |
| Core content           | The screen must present only information needed to complete “Book pickup”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Book pickup                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                          |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.      |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                  |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                   |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.      |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Book pickup” without undocumented staff assistance.                    |

### Warehouse Drop-off

Route: /services/drop-off \| Area: Public and authentication \| Primary action: Find location

| **Specification item** | **Requirement**                                                                                                                                                |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Show locations, hours, appointment and acceptance rules.                                                                                                       |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                        |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                   |
| Core content           | The screen must present only information needed to complete “Find location”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Find location                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                            |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.        |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                    |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                     |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.        |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Find location” without undocumented staff assistance.                    |

### Customs Assistance

Route: /services/customs-assistance \| Area: Public and authentication \| Primary action: Prepare documents

| **Specification item** | **Requirement**                                                                                                                                                    |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain document review, broker coordination and limitations.                                                                                                      |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                            |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                       |
| Core content           | The screen must present only information needed to complete “Prepare documents”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Prepare documents                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                                |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.            |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                        |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                         |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.            |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Prepare documents” without undocumented staff assistance.                    |

### Package Consolidation

Route: /services/consolidation \| Area: Public and authentication \| Primary action: Request consolidation

| **Specification item** | **Requirement**                                                                                                                                                        |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain package grouping, measurements and approval.                                                                                                                   |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                                |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                           |
| Core content           | The screen must present only information needed to complete “Request consolidation”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Request consolidation                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                                    |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.                |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                            |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                             |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.                |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Request consolidation” without undocumented staff assistance.                    |

### Repacking Service

Route: /services/repacking \| Area: Public and authentication \| Primary action: View requirements

| **Specification item** | **Requirement**                                                                                                                                                    |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain inspection, evidence, approval and fees.                                                                                                                   |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                            |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                       |
| Core content           | The screen must present only information needed to complete “View requirements”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | View requirements                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                                |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.            |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                        |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                         |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.            |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “View requirements” without undocumented staff assistance.                    |

### Shipment Protection

Route: /services/insurance \| Area: Public and authentication \| Primary action: Add protection

| **Specification item** | **Requirement**                                                                                                                                                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain optional protection, limits, exclusions and claims.                                                                                                     |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                         |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                    |
| Core content           | The screen must present only information needed to complete “Add protection”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Add protection                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                             |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.         |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                     |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                      |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.         |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Add protection” without undocumented staff assistance.                    |

### Returns Service

Route: /services/returns \| Area: Public and authentication \| Primary action: Start return

| **Specification item** | **Requirement**                                                                                                                                               |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain returns, return-to-sender and applicable charges.                                                                                                     |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                       |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                  |
| Core content           | The screen must present only information needed to complete “Start return”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Start return                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                           |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.       |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                   |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                    |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.       |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Start return” without undocumented staff assistance.                    |

### Italy to USA

Route: /routes/italy-to-usa \| Area: Public and authentication \| Primary action: Get quote

| **Specification item** | **Requirement**                                                                                                                                            |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Present the launch corridor, steps, coverage and customs expectations.                                                                                     |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                    |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                               |
| Core content           | The screen must present only information needed to complete “Get quote”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Get quote                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                        |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.    |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                 |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.    |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Get quote” without undocumented staff assistance.                    |

### Service areas

Route: /service-areas \| Area: Public and authentication \| Primary action: Check address

| **Specification item** | **Requirement**                                                                                                                                                |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Show active Italian origin and US destination coverage.                                                                                                        |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                        |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                   |
| Core content           | The screen must present only information needed to complete “Check address”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Check address                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                            |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.        |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                    |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                     |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.        |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Check address” without undocumented staff assistance.                    |

### Transit-time guide

Route: /transit-times \| Area: Public and authentication \| Primary action: Compare services

| **Specification item** | **Requirement**                                                                                                                                                   |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain estimated transit, processing time and causes of delay.                                                                                                   |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                           |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                      |
| Core content           | The screen must present only information needed to complete “Compare services”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Compare services                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                               |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.           |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                       |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                        |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.           |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Compare services” without undocumented staff assistance.                    |

### Pricing overview

Route: /pricing \| Area: Public and authentication \| Primary action: Get quote

| **Specification item** | **Requirement**                                                                                                                                            |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain how prices are formed without publishing unapproved rate cards.                                                                                    |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                    |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                               |
| Core content           | The screen must present only information needed to complete “Get quote”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Get quote                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                        |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.    |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                 |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.    |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Get quote” without undocumented staff assistance.                    |

### Surcharges

Route: /pricing/surcharges \| Area: Public and authentication \| Primary action: View quote

| **Specification item** | **Requirement**                                                                                                                                             |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain fuel, remote area, oversized, storage and handling charges.                                                                                         |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                     |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                |
| Core content           | The screen must present only information needed to complete “View quote”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | View quote                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                         |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.     |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                 |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                  |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.     |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “View quote” without undocumented staff assistance.                    |

### Packaging guide

Route: /guides/packaging \| Area: Public and authentication \| Primary action: Prepare package

| **Specification item** | **Requirement**                                                                                                                                                  |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Show packaging standards by item and service.                                                                                                                    |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                          |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                     |
| Core content           | The screen must present only information needed to complete “Prepare package”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Prepare package                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                              |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.          |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                      |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                       |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.          |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Prepare package” without undocumented staff assistance.                    |

### Measure and weigh

Route: /guides/measure-weight \| Area: Public and authentication \| Primary action: Calculate dimensions

| **Specification item** | **Requirement**                                                                                                                                                       |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain actual, dimensional and chargeable weight.                                                                                                                    |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                               |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                          |
| Core content           | The screen must present only information needed to complete “Calculate dimensions”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Calculate dimensions                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                                   |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.               |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                           |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                            |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.               |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Calculate dimensions” without undocumented staff assistance.                    |

### Customs overview

Route: /customs \| Area: Public and authentication \| Primary action: View customs steps

| **Specification item** | **Requirement**                                                                                                                                                     |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Introduce export and import responsibilities and documents.                                                                                                         |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                             |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                        |
| Core content           | The screen must present only information needed to complete “View customs steps”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | View customs steps                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                                 |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.             |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                         |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                          |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.             |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “View customs steps” without undocumented staff assistance.                    |

### Commercial invoice guide

Route: /customs/commercial-invoice \| Area: Public and authentication \| Primary action: Create invoice

| **Specification item** | **Requirement**                                                                                                                                                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain required invoice fields with examples.                                                                                                                  |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                         |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                    |
| Core content           | The screen must present only information needed to complete “Create invoice”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Create invoice                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                             |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.         |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                     |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                      |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.         |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Create invoice” without undocumented staff assistance.                    |

### HS code guide

Route: /customs/hs-codes \| Area: Public and authentication \| Primary action: Find guidance

| **Specification item** | **Requirement**                                                                                                                                                |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain classification and responsibility.                                                                                                                     |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                        |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                   |
| Core content           | The screen must present only information needed to complete “Find guidance”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Find guidance                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                            |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.        |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                    |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                     |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.        |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Find guidance” without undocumented staff assistance.                    |

### Duties and taxes

Route: /customs/duties-taxes \| Area: Public and authentication \| Primary action: Estimate costs

| **Specification item** | **Requirement**                                                                                                                                                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain payer options, estimates and customs authority decisions.                                                                                               |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                         |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                    |
| Core content           | The screen must present only information needed to complete “Estimate costs”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Estimate costs                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                             |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.         |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                     |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                      |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.         |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Estimate costs” without undocumented staff assistance.                    |

### Prohibited items

Route: /customs/prohibited-items \| Area: Public and authentication \| Primary action: Check an item

| **Specification item** | **Requirement**                                                                                                                                                |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | List goods the company will not accept.                                                                                                                        |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                        |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                   |
| Core content           | The screen must present only information needed to complete “Check an item”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Check an item                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                            |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.        |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                    |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                     |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.        |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Check an item” without undocumented staff assistance.                    |

### Restricted items

Route: /customs/restricted-items \| Area: Public and authentication \| Primary action: Request review

| **Specification item** | **Requirement**                                                                                                                                                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | List goods requiring pre-approval, licences or special handling.                                                                                                |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                         |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                    |
| Core content           | The screen must present only information needed to complete “Request review”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Request review                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                             |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.         |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                     |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                      |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.         |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Request review” without undocumented staff assistance.                    |

### Battery shipping

Route: /customs/batteries \| Area: Public and authentication \| Primary action: Request review

| **Specification item** | **Requirement**                                                                                                                                                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain battery questions, approval and documentation.                                                                                                          |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                         |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                    |
| Core content           | The screen must present only information needed to complete “Request review”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Request review                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                             |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.         |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                     |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                      |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.         |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Request review” without undocumented staff assistance.                    |

### Food and agriculture

Route: /customs/food-agriculture \| Area: Public and authentication \| Primary action: Request review

| **Specification item** | **Requirement**                                                                                                                                                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain that agricultural and food items need review.                                                                                                           |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                         |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                    |
| Core content           | The screen must present only information needed to complete “Request review”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Request review                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                             |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.         |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                     |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                      |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.         |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Request review” without undocumented staff assistance.                    |

### Medicines and medical items

Route: /customs/medicines-medical \| Area: Public and authentication \| Primary action: Request review

| **Specification item** | **Requirement**                                                                                                                                                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain regulatory review and documentation.                                                                                                                    |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                         |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                    |
| Core content           | The screen must present only information needed to complete “Request review”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Request review                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                             |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.         |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                     |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                      |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.         |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Request review” without undocumented staff assistance.                    |

### Personal effects

Route: /customs/personal-effects \| Area: Public and authentication \| Primary action: Prepare inventory

| **Specification item** | **Requirement**                                                                                                                                                    |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain inventory, values and used-goods declarations.                                                                                                             |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                            |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                       |
| Core content           | The screen must present only information needed to complete “Prepare inventory”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Prepare inventory                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                                |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.            |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                        |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                         |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.            |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Prepare inventory” without undocumented staff assistance.                    |

### Business imports

Route: /customs/business-imports \| Area: Public and authentication \| Primary action: Contact business team

| **Specification item** | **Requirement**                                                                                                                                                        |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain commercial records, importer information and broker workflow.                                                                                                  |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                                |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                           |
| Core content           | The screen must present only information needed to complete “Contact business team”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Contact business team                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                                    |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.                |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                            |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                             |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.                |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Contact business team” without undocumented staff assistance.                    |

### Help centre

Route: /help \| Area: Public and authentication \| Primary action: Search help

| **Specification item** | **Requirement**                                                                                                                                              |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Search and browse support content.                                                                                                                           |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                      |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                 |
| Core content           | The screen must present only information needed to complete “Search help”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Search help                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                          |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.      |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                  |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                   |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.      |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Search help” without undocumented staff assistance.                    |

### Tracking help

Route: /help/tracking \| Area: Public and authentication \| Primary action: Track shipment

| **Specification item** | **Requirement**                                                                                                                                                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Resolve invalid numbers, delayed scans and status questions.                                                                                                    |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                         |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                    |
| Core content           | The screen must present only information needed to complete “Track shipment”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Track shipment                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                             |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.         |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                     |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                      |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.         |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Track shipment” without undocumented staff assistance.                    |

### Quote and booking help

Route: /help/quote-booking \| Area: Public and authentication \| Primary action: Get help

| **Specification item** | **Requirement**                                                                                                                                           |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain quote expiry, edits and booking conversion.                                                                                                       |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                   |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                              |
| Core content           | The screen must present only information needed to complete “Get help”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Get help                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                       |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.   |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.               |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.   |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Get help” without undocumented staff assistance.                    |

### Payment and billing help

Route: /help/payment-billing \| Area: Public and authentication \| Primary action: Contact billing

| **Specification item** | **Requirement**                                                                                                                                                  |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain failed payments, invoices and bank transfers.                                                                                                            |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                          |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                     |
| Core content           | The screen must present only information needed to complete “Contact billing”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Contact billing                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                              |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.          |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                      |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                       |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.          |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Contact billing” without undocumented staff assistance.                    |

### Pickup and delivery help

Route: /help/pickup-delivery \| Area: Public and authentication \| Primary action: Manage delivery

| **Specification item** | **Requirement**                                                                                                                                                  |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain rescheduling, attempts and collection.                                                                                                                   |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                          |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                     |
| Core content           | The screen must present only information needed to complete “Manage delivery”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Manage delivery                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                              |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.          |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                      |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                       |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.          |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Manage delivery” without undocumented staff assistance.                    |

### Customs help

Route: /help/customs \| Area: Public and authentication \| Primary action: Upload document

| **Specification item** | **Requirement**                                                                                                                                                  |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain missing documents, holds and duties.                                                                                                                     |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                          |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                     |
| Core content           | The screen must present only information needed to complete “Upload document”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Upload document                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                              |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.          |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                      |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                       |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.          |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Upload document” without undocumented staff assistance.                    |

### Claims and returns help

Route: /help/claims-returns \| Area: Public and authentication \| Primary action: Start claim

| **Specification item** | **Requirement**                                                                                                                                              |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain eligibility, evidence and progress.                                                                                                                  |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                      |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                 |
| Core content           | The screen must present only information needed to complete “Start claim”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Start claim                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                          |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.      |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                  |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                   |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.      |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Start claim” without undocumented staff assistance.                    |

### Account and security help

Route: /help/account-security \| Area: Public and authentication \| Primary action: Secure account

| **Specification item** | **Requirement**                                                                                                                                                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain login, MFA, recovery and suspicious activity.                                                                                                           |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                         |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                    |
| Core content           | The screen must present only information needed to complete “Secure account”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Secure account                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                             |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.         |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                     |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                      |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.         |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Secure account” without undocumented staff assistance.                    |

### Contact

Route: /contact \| Area: Public and authentication \| Primary action: Contact support

| **Specification item** | **Requirement**                                                                                                                                                  |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Present phone, email, chat, address, hours and enquiry routes.                                                                                                   |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                          |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                     |
| Core content           | The screen must present only information needed to complete “Contact support”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Contact support                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                              |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.          |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                      |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                       |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.          |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Contact support” without undocumented staff assistance.                    |

### Submit support request

Route: /support/new \| Area: Public and authentication \| Primary action: Submit request

| **Specification item** | **Requirement**                                                                                                                                                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Create a structured support ticket.                                                                                                                             |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                         |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                    |
| Core content           | The screen must present only information needed to complete “Submit request”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Submit request                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                             |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.         |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                     |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                      |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.         |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Submit request” without undocumented staff assistance.                    |

### Support confirmation

Route: /support/confirmation \| Area: Public and authentication \| Primary action: View ticket

| **Specification item** | **Requirement**                                                                                                                                              |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Confirm ticket reference and expected response.                                                                                                              |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                      |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                 |
| Core content           | The screen must present only information needed to complete “View ticket”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | View ticket                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                          |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.      |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                  |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                   |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.      |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “View ticket” without undocumented staff assistance.                    |

### Claims overview

Route: /claims \| Area: Public and authentication \| Primary action: Start claim

| **Specification item** | **Requirement**                                                                                                                                              |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain claim types, evidence, time limits and process.                                                                                                      |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                      |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                 |
| Core content           | The screen must present only information needed to complete “Start claim”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Start claim                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                          |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.      |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                  |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                   |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.      |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Start claim” without undocumented staff assistance.                    |

### Submit claim

Route: /claims/new \| Area: Public and authentication \| Primary action: Submit claim

| **Specification item** | **Requirement**                                                                                                                                               |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Collect claimant, shipment, event and evidence.                                                                                                               |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                       |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                  |
| Core content           | The screen must present only information needed to complete “Submit claim”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Submit claim                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                           |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.       |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                   |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                    |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.       |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Submit claim” without undocumented staff assistance.                    |

### Claim confirmation

Route: /claims/confirmation \| Area: Public and authentication \| Primary action: View claim

| **Specification item** | **Requirement**                                                                                                                                             |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Confirm claim reference and review steps.                                                                                                                   |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                     |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                |
| Core content           | The screen must present only information needed to complete “View claim”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | View claim                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                         |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.     |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                 |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                  |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.     |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “View claim” without undocumented staff assistance.                    |

### Returns overview

Route: /returns \| Area: Public and authentication \| Primary action: Start return

| **Specification item** | **Requirement**                                                                                                                                               |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain return eligibility and charges.                                                                                                                       |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                       |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                  |
| Core content           | The screen must present only information needed to complete “Start return”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Start return                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                           |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.       |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                   |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                    |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.       |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Start return” without undocumented staff assistance.                    |

### Start return

Route: /returns/new \| Area: Public and authentication \| Primary action: Submit return

| **Specification item** | **Requirement**                                                                                                                                                |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Collect return reason, package and collection details.                                                                                                         |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                        |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                   |
| Core content           | The screen must present only information needed to complete “Submit return”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Submit return                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                            |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.        |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                    |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                     |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.        |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Submit return” without undocumented staff assistance.                    |

### About Nauterio

Route: /about \| Area: Public and authentication \| Primary action: Learn more

| **Specification item** | **Requirement**                                                                                                                                             |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain mission, route, operating model and verified company details.                                                                                       |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                     |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                |
| Core content           | The screen must present only information needed to complete “Learn more”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Learn more                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                         |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.     |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                 |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                  |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.     |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Learn more” without undocumented staff assistance.                    |

### Service alerts

Route: /service-alerts \| Area: Public and authentication \| Primary action: View alert

| **Specification item** | **Requirement**                                                                                                                                             |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Publish current operational disruptions and resolved notices.                                                                                               |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                     |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                |
| Core content           | The screen must present only information needed to complete “View alert”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | View alert                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                         |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.     |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                 |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                  |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.     |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “View alert” without undocumented staff assistance.                    |

### Resources hub

Route: /resources \| Area: Public and authentication \| Primary action: Read guide

| **Specification item** | **Requirement**                                                                                                                                             |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Publish practical cross-border shipping guidance.                                                                                                           |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                     |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                |
| Core content           | The screen must present only information needed to complete “Read guide”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Read guide                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                         |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.     |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                 |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                  |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.     |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Read guide” without undocumented staff assistance.                    |

### Resource article

Route: /resources/\[slug\] \| Area: Public and authentication \| Primary action: Related action

| **Specification item** | **Requirement**                                                                                                                                                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Present an individual editorial guide.                                                                                                                          |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                         |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                    |
| Core content           | The screen must present only information needed to complete “Related action”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Related action                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                             |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.         |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                     |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                      |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.         |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Related action” without undocumented staff assistance.                    |

### Legal hub

Route: /legal \| Area: Public and authentication \| Primary action: Read policies

| **Specification item** | **Requirement**                                                                                                                                                |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Link all legal, service and privacy policies.                                                                                                                  |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                        |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                   |
| Core content           | The screen must present only information needed to complete “Read policies”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Read policies                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                            |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.        |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                    |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                     |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.        |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Read policies” without undocumented staff assistance.                    |

### Privacy policy

Route: /privacy \| Area: Public and authentication \| Primary action: Manage privacy

| **Specification item** | **Requirement**                                                                                                                                                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain personal-data processing and rights.                                                                                                                    |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                         |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                    |
| Core content           | The screen must present only information needed to complete “Manage privacy”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Manage privacy                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                             |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.         |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                     |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                      |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.         |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Manage privacy” without undocumented staff assistance.                    |

### Cookie policy and preferences

Route: /cookies \| Area: Public and authentication \| Primary action: Manage cookies

| **Specification item** | **Requirement**                                                                                                                                                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain cookies and open consent settings.                                                                                                                      |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                         |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                    |
| Core content           | The screen must present only information needed to complete “Manage cookies”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Manage cookies                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                             |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.         |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                     |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                      |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.         |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Manage cookies” without undocumented staff assistance.                    |

### Terms and conditions

Route: /terms \| Area: Public and authentication \| Primary action: Read terms

| **Specification item** | **Requirement**                                                                                                                                             |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Present carriage, website and account terms.                                                                                                                |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                     |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                |
| Core content           | The screen must present only information needed to complete “Read terms”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Read terms                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                         |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.     |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                 |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                  |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.     |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Read terms” without undocumented staff assistance.                    |

### Sign in

Route: /signin \| Area: Public and authentication \| Primary action: Sign in

| **Specification item** | **Requirement**                                                                                                                                          |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Authenticate customers and staff through the appropriate route.                                                                                          |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                  |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                             |
| Core content           | The screen must present only information needed to complete “Sign in”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Sign in                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                      |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.  |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.              |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.               |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.  |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Sign in” without undocumented staff assistance.                    |

### Create account

Route: /register \| Area: Public and authentication \| Primary action: Create account

| **Specification item** | **Requirement**                                                                                                                                                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Register an individual or start business registration.                                                                                                          |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                         |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                    |
| Core content           | The screen must present only information needed to complete “Create account”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Create account                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                             |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.         |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                     |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                      |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.         |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Create account” without undocumented staff assistance.                    |

### Password and account recovery

Route: /password \| Area: Public and authentication \| Primary action: Recover account

| **Specification item** | **Requirement**                                                                                                                                                  |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Request reset, confirm code and set a new password.                                                                                                              |
| Primary audience       | Visitors, senders, receivers and prospective customers.                                                                                                          |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                     |
| Core content           | The screen must present only information needed to complete “Recover account”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Recover account                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                              |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.          |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                      |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                       |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.          |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Recover account” without undocumented staff assistance.                    |

## Customer portal

### Customer dashboard

Route: /app \| Area: Customer portal \| Primary action: View shipment

| **Specification item** | **Requirement**                                                                                                                                                |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Show active shipments, actions, alerts and recent documents.                                                                                                   |
| Primary audience       | Authenticated individual customers and authorised shipment participants.                                                                                       |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                   |
| Core content           | The screen must present only information needed to complete “View shipment”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | View shipment                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                            |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.        |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                    |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                     |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.        |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “View shipment” without undocumented staff assistance.                    |

### My shipments

Route: /app/shipments \| Area: Customer portal \| Primary action: Create shipment

| **Specification item** | **Requirement**                                                                                                                                                  |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Filter and search all customer shipments.                                                                                                                        |
| Primary audience       | Authenticated individual customers and authorised shipment participants.                                                                                         |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                     |
| Core content           | The screen must present only information needed to complete “Create shipment”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Create shipment                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                              |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.          |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                      |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                       |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.          |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Create shipment” without undocumented staff assistance.                    |

### Shipment detail

Route: /app/shipments/\[id\] \| Area: Customer portal \| Primary action: Track shipment

| **Specification item** | **Requirement**                                                                                                                                                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Show complete authorised shipment information and actions.                                                                                                      |
| Primary audience       | Authenticated individual customers and authorised shipment participants.                                                                                        |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                    |
| Core content           | The screen must present only information needed to complete “Track shipment”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Track shipment                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                             |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.         |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                     |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                      |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.         |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Track shipment” without undocumented staff assistance.                    |

### Detailed tracking

Route: /app/shipments/\[id\]/tracking \| Area: Customer portal \| Primary action: Download proof

| **Specification item** | **Requirement**                                                                                                                                                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Show milestone timeline, exceptions and proof of delivery.                                                                                                      |
| Primary audience       | Authenticated individual customers and authorised shipment participants.                                                                                        |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                    |
| Core content           | The screen must present only information needed to complete “Download proof”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Download proof                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                             |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.         |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                     |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                      |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.         |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Download proof” without undocumented staff assistance.                    |

### Create shipment

Route: /app/shipments/new \| Area: Customer portal \| Primary action: Start shipment

| **Specification item** | **Requirement**                                                                                                                                                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Start or resume a logged-in shipment flow.                                                                                                                      |
| Primary audience       | Authenticated individual customers and authorised shipment participants.                                                                                        |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                    |
| Core content           | The screen must present only information needed to complete “Start shipment”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Start shipment                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                             |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.         |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                     |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                      |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.         |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Start shipment” without undocumented staff assistance.                    |

### Draft shipments

Route: /app/drafts \| Area: Customer portal \| Primary action: Resume draft

| **Specification item** | **Requirement**                                                                                                                                               |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | List incomplete bookings and expiry dates.                                                                                                                    |
| Primary audience       | Authenticated individual customers and authorised shipment participants.                                                                                      |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                  |
| Core content           | The screen must present only information needed to complete “Resume draft”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Resume draft                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                           |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.       |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                   |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                    |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.       |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Resume draft” without undocumented staff assistance.                    |

### Quotes

Route: /app/quotes \| Area: Customer portal \| Primary action: Request quote

| **Specification item** | **Requirement**                                                                                                                                                |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | List draft, pending, issued, accepted and expired quotes.                                                                                                      |
| Primary audience       | Authenticated individual customers and authorised shipment participants.                                                                                       |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                   |
| Core content           | The screen must present only information needed to complete “Request quote”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Request quote                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                            |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.        |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                    |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                     |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.        |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Request quote” without undocumented staff assistance.                    |

### Quote detail

Route: /app/quotes/\[id\] \| Area: Customer portal \| Primary action: Accept quote

| **Specification item** | **Requirement**                                                                                                                                               |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Show pricing, service, conditions and acceptance.                                                                                                             |
| Primary audience       | Authenticated individual customers and authorised shipment participants.                                                                                      |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                  |
| Core content           | The screen must present only information needed to complete “Accept quote”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Accept quote                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                           |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.       |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                   |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                    |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.       |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Accept quote” without undocumented staff assistance.                    |

### Pickups

Route: /app/pickups \| Area: Customer portal \| Primary action: Book pickup

| **Specification item** | **Requirement**                                                                                                                                              |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | List scheduled, completed, failed and cancelled pickups.                                                                                                     |
| Primary audience       | Authenticated individual customers and authorised shipment participants.                                                                                     |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                 |
| Core content           | The screen must present only information needed to complete “Book pickup”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Book pickup                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                          |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.      |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                  |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                   |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.      |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Book pickup” without undocumented staff assistance.                    |

### Pickup detail

Route: /app/pickups/\[id\] \| Area: Customer portal \| Primary action: Reschedule

| **Specification item** | **Requirement**                                                                                                                                             |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Show address, window, instructions and reschedule controls.                                                                                                 |
| Primary audience       | Authenticated individual customers and authorised shipment participants.                                                                                    |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                |
| Core content           | The screen must present only information needed to complete “Reschedule”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Reschedule                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                         |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.     |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                 |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                  |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.     |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Reschedule” without undocumented staff assistance.                    |

### Saved addresses

Route: /app/addresses \| Area: Customer portal \| Primary action: Add address

| **Specification item** | **Requirement**                                                                                                                                              |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Manage validated sender and receiver addresses.                                                                                                              |
| Primary audience       | Authenticated individual customers and authorised shipment participants.                                                                                     |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                 |
| Core content           | The screen must present only information needed to complete “Add address”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Add address                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                          |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.      |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                  |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                   |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.      |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Add address” without undocumented staff assistance.                    |

### Saved contacts

Route: /app/contacts \| Area: Customer portal \| Primary action: Add contact

| **Specification item** | **Requirement**                                                                                                                                              |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Manage sender and receiver contacts.                                                                                                                         |
| Primary audience       | Authenticated individual customers and authorised shipment participants.                                                                                     |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                 |
| Core content           | The screen must present only information needed to complete “Add contact”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Add contact                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                          |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.      |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                  |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                   |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.      |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Add contact” without undocumented staff assistance.                    |

### Payments

Route: /app/payments \| Area: Customer portal \| Primary action: Pay balance

| **Specification item** | **Requirement**                                                                                                                                              |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | List payment status, amount and linked invoices.                                                                                                             |
| Primary audience       | Authenticated individual customers and authorised shipment participants.                                                                                     |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                 |
| Core content           | The screen must present only information needed to complete “Pay balance”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Pay balance                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                          |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.      |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                  |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                   |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.      |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Pay balance” without undocumented staff assistance.                    |

### Payment detail

Route: /app/payments/\[id\] \| Area: Customer portal \| Primary action: Download receipt

| **Specification item** | **Requirement**                                                                                                                                                   |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Show provider reference, allocation, receipt and refund state.                                                                                                    |
| Primary audience       | Authenticated individual customers and authorised shipment participants.                                                                                          |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                      |
| Core content           | The screen must present only information needed to complete “Download receipt”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Download receipt                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                               |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.           |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                       |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                        |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.           |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Download receipt” without undocumented staff assistance.                    |

### Invoices

Route: /app/invoices \| Area: Customer portal \| Primary action: Download invoice

| **Specification item** | **Requirement**                                                                                                                                                   |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | List invoices, credit notes and outstanding balances.                                                                                                             |
| Primary audience       | Authenticated individual customers and authorised shipment participants.                                                                                          |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                      |
| Core content           | The screen must present only information needed to complete “Download invoice”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Download invoice                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                               |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.           |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                       |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                        |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.           |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Download invoice” without undocumented staff assistance.                    |

### Invoice detail

Route: /app/invoices/\[id\] \| Area: Customer portal \| Primary action: Pay invoice

| **Specification item** | **Requirement**                                                                                                                                              |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Show line items, tax information and payment state.                                                                                                          |
| Primary audience       | Authenticated individual customers and authorised shipment participants.                                                                                     |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                 |
| Core content           | The screen must present only information needed to complete “Pay invoice”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Pay invoice                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                          |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.      |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                  |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                   |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.      |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Pay invoice” without undocumented staff assistance.                    |

### Documents

Route: /app/documents \| Area: Customer portal \| Primary action: Upload document

| **Specification item** | **Requirement**                                                                                                                                                  |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | List customs, commercial, generated and delivery files.                                                                                                          |
| Primary audience       | Authenticated individual customers and authorised shipment participants.                                                                                         |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                     |
| Core content           | The screen must present only information needed to complete “Upload document”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Upload document                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                              |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.          |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                      |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                       |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.          |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Upload document” without undocumented staff assistance.                    |

### Document detail

Route: /app/documents/\[id\] \| Area: Customer portal \| Primary action: Download

| **Specification item** | **Requirement**                                                                                                                                           |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Show file type, status, version and authorised download.                                                                                                  |
| Primary audience       | Authenticated individual customers and authorised shipment participants.                                                                                  |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                              |
| Core content           | The screen must present only information needed to complete “Download”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Download                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                       |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.   |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.               |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.   |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Download” without undocumented staff assistance.                    |

### Claims

Route: /app/claims \| Area: Customer portal \| Primary action: Start claim

| **Specification item** | **Requirement**                                                                                                                                              |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | List claim status and required actions.                                                                                                                      |
| Primary audience       | Authenticated individual customers and authorised shipment participants.                                                                                     |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                 |
| Core content           | The screen must present only information needed to complete “Start claim”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Start claim                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                          |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.      |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                  |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                   |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.      |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Start claim” without undocumented staff assistance.                    |

### Claim detail

Route: /app/claims/\[id\] \| Area: Customer portal \| Primary action: Add evidence

| **Specification item** | **Requirement**                                                                                                                                               |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Show evidence, messages, decision and settlement.                                                                                                             |
| Primary audience       | Authenticated individual customers and authorised shipment participants.                                                                                      |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                  |
| Core content           | The screen must present only information needed to complete “Add evidence”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Add evidence                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                           |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.       |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                   |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                    |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.       |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Add evidence” without undocumented staff assistance.                    |

### Returns

Route: /app/returns \| Area: Customer portal \| Primary action: Start return

| **Specification item** | **Requirement**                                                                                                                                               |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | List return requests and returned shipments.                                                                                                                  |
| Primary audience       | Authenticated individual customers and authorised shipment participants.                                                                                      |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                  |
| Core content           | The screen must present only information needed to complete “Start return”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Start return                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                           |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.       |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                   |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                    |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.       |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Start return” without undocumented staff assistance.                    |

### Return detail

Route: /app/returns/\[id\] \| Area: Customer portal \| Primary action: Download label

| **Specification item** | **Requirement**                                                                                                                                                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Show approval, charge, label and tracking.                                                                                                                      |
| Primary audience       | Authenticated individual customers and authorised shipment participants.                                                                                        |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                    |
| Core content           | The screen must present only information needed to complete “Download label”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Download label                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                             |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.         |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                     |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                      |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.         |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Download label” without undocumented staff assistance.                    |

### Support tickets

Route: /app/support \| Area: Customer portal \| Primary action: New ticket

| **Specification item** | **Requirement**                                                                                                                                             |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | List open and closed support requests.                                                                                                                      |
| Primary audience       | Authenticated individual customers and authorised shipment participants.                                                                                    |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                |
| Core content           | The screen must present only information needed to complete “New ticket”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | New ticket                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                         |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.     |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                 |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                  |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.     |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “New ticket” without undocumented staff assistance.                    |

### Ticket detail

Route: /app/support/\[id\] \| Area: Customer portal \| Primary action: Reply

| **Specification item** | **Requirement**                                                                                                                                         |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Show conversation, attachments and related shipment.                                                                                                    |
| Primary audience       | Authenticated individual customers and authorised shipment participants.                                                                                |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                            |
| Core content           | The screen must present only information needed to complete “Reply”, with a clear title, concise explanation, structured data and contextual guidance.  |
| Primary action         | Reply                                                                                                                                                   |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                     |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant. |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.             |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.              |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values. |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Reply” without undocumented staff assistance.                     |

### Notification centre

Route: /app/notifications \| Area: Customer portal \| Primary action: Mark read

| **Specification item** | **Requirement**                                                                                                                                            |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Show operational messages and delivery state.                                                                                                              |
| Primary audience       | Authenticated individual customers and authorised shipment participants.                                                                                   |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                               |
| Core content           | The screen must present only information needed to complete “Mark read”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Mark read                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                        |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.    |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                 |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.    |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Mark read” without undocumented staff assistance.                    |

### Profile and security

Route: /app/profile-security \| Area: Customer portal \| Primary action: Secure account

| **Specification item** | **Requirement**                                                                                                                                                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Manage identity, password, passkeys, MFA and sessions.                                                                                                          |
| Primary audience       | Authenticated individual customers and authorised shipment participants.                                                                                        |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                    |
| Core content           | The screen must present only information needed to complete “Secure account”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Secure account                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                             |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.         |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                     |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                      |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.         |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Secure account” without undocumented staff assistance.                    |

### Preferences and consent

Route: /app/preferences \| Area: Customer portal \| Primary action: Save preferences

| **Specification item** | **Requirement**                                                                                                                                                   |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Manage language, time zone, channels, cookies and marketing consent.                                                                                              |
| Primary audience       | Authenticated individual customers and authorised shipment participants.                                                                                          |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                      |
| Core content           | The screen must present only information needed to complete “Save preferences”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Save preferences                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                               |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.           |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                       |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                        |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.           |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Save preferences” without undocumented staff assistance.                    |

## Business portal

### Business dashboard

Route: /business \| Area: Business portal \| Primary action: Create shipment

| **Specification item** | **Requirement**                                                                                                                                                  |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Show organisation shipment, spend, delay and credit summaries.                                                                                                   |
| Primary audience       | Authorised users of a verified business organisation.                                                                                                            |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                     |
| Core content           | The screen must present only information needed to complete “Create shipment”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Create shipment                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                              |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.          |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                      |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                       |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.          |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Create shipment” without undocumented staff assistance.                    |

### Organisation profile

Route: /business/organisation \| Area: Business portal \| Primary action: Edit profile

| **Specification item** | **Requirement**                                                                                                                                               |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Manage legal, billing and operational company data.                                                                                                           |
| Primary audience       | Authorised users of a verified business organisation.                                                                                                         |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                  |
| Core content           | The screen must present only information needed to complete “Edit profile”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Edit profile                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                           |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.       |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                   |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                    |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.       |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Edit profile” without undocumented staff assistance.                    |

### Team users

Route: /business/team \| Area: Business portal \| Primary action: Invite user

| **Specification item** | **Requirement**                                                                                                                                              |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Invite, suspend and remove organisation users.                                                                                                               |
| Primary audience       | Authorised users of a verified business organisation.                                                                                                        |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                 |
| Core content           | The screen must present only information needed to complete “Invite user”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Invite user                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                          |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.      |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                  |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                   |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.      |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Invite user” without undocumented staff assistance.                    |

### Roles and approvals

Route: /business/roles \| Area: Business portal \| Primary action: Create role

| **Specification item** | **Requirement**                                                                                                                                              |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Set organisation permissions and internal approval rules.                                                                                                    |
| Primary audience       | Authorised users of a verified business organisation.                                                                                                        |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                 |
| Core content           | The screen must present only information needed to complete “Create role”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Create role                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                          |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.      |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                  |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                   |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.      |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Create role” without undocumented staff assistance.                    |

### Bulk shipment import

Route: /business/import \| Area: Business portal \| Primary action: Upload file

| **Specification item** | **Requirement**                                                                                                                                              |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Upload a controlled shipment spreadsheet.                                                                                                                    |
| Primary audience       | Authorised users of a verified business organisation.                                                                                                        |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                 |
| Core content           | The screen must present only information needed to complete “Upload file”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Upload file                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                          |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.      |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                  |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                   |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.      |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Upload file” without undocumented staff assistance.                    |

### Import result

Route: /business/import/result \| Area: Business portal \| Primary action: Fix errors

| **Specification item** | **Requirement**                                                                                                                                             |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Show validated rows, errors and accepted records.                                                                                                           |
| Primary audience       | Authorised users of a verified business organisation.                                                                                                       |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                |
| Core content           | The screen must present only information needed to complete “Fix errors”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Fix errors                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                         |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.     |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                 |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                  |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.     |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Fix errors” without undocumented staff assistance.                    |

### Shipment templates

Route: /business/templates \| Area: Business portal \| Primary action: Create template

| **Specification item** | **Requirement**                                                                                                                                                  |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Save repeat routes, contacts, contents and package sets.                                                                                                         |
| Primary audience       | Authorised users of a verified business organisation.                                                                                                            |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                     |
| Core content           | The screen must present only information needed to complete “Create template”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Create template                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                              |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.          |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                      |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                       |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.          |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Create template” without undocumented staff assistance.                    |

### Saved commodities

Route: /business/commodities \| Area: Business portal \| Primary action: Add commodity

| **Specification item** | **Requirement**                                                                                                                                                |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Manage reusable customs item descriptions and codes.                                                                                                           |
| Primary audience       | Authorised users of a verified business organisation.                                                                                                          |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                   |
| Core content           | The screen must present only information needed to complete “Add commodity”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Add commodity                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                            |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.        |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                    |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                     |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.        |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Add commodity” without undocumented staff assistance.                    |

### Contract rates

Route: /business/rates \| Area: Business portal \| Primary action: Get quote

| **Specification item** | **Requirement**                                                                                                                                            |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Show negotiated rates, effective dates and exclusions.                                                                                                     |
| Primary audience       | Authorised users of a verified business organisation.                                                                                                      |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                               |
| Core content           | The screen must present only information needed to complete “Get quote”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Get quote                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                        |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.    |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                 |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.    |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Get quote” without undocumented staff assistance.                    |

### Statements and credit

Route: /business/statements \| Area: Business portal \| Primary action: Pay balance

| **Specification item** | **Requirement**                                                                                                                                              |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Show account balance, terms, statements and overdue items.                                                                                                   |
| Primary audience       | Authorised users of a verified business organisation.                                                                                                        |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                 |
| Core content           | The screen must present only information needed to complete “Pay balance”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Pay balance                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                          |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.      |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                  |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                   |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.      |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Pay balance” without undocumented staff assistance.                    |

### Business reports

Route: /business/reports \| Area: Business portal \| Primary action: Generate report

| **Specification item** | **Requirement**                                                                                                                                                  |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Run shipment, cost, delivery and exception reports.                                                                                                              |
| Primary audience       | Authorised users of a verified business organisation.                                                                                                            |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                     |
| Core content           | The screen must present only information needed to complete “Generate report”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Generate report                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                              |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.          |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                      |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                       |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.          |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Generate report” without undocumented staff assistance.                    |

### API credentials

Route: /business/api \| Area: Business portal \| Primary action: Create key

| **Specification item** | **Requirement**                                                                                                                                             |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Create scoped keys and view usage.                                                                                                                          |
| Primary audience       | Authorised users of a verified business organisation.                                                                                                       |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                |
| Core content           | The screen must present only information needed to complete “Create key”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Create key                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                         |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.     |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                 |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                  |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.     |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Create key” without undocumented staff assistance.                    |

### Webhooks and integrations

Route: /business/webhooks \| Area: Business portal \| Primary action: Add webhook

| **Specification item** | **Requirement**                                                                                                                                              |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Register endpoints and inspect delivery attempts.                                                                                                            |
| Primary audience       | Authorised users of a verified business organisation.                                                                                                        |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                 |
| Core content           | The screen must present only information needed to complete “Add webhook”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Add webhook                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                          |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.      |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                  |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                   |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.      |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Add webhook” without undocumented staff assistance.                    |

## Administration

### Operations dashboard

Route: /admin \| Area: Administration \| Primary action: Open exceptions

| **Specification item** | **Requirement**                                                                                                                                                  |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Show live shipment, exception, finance and queue summaries.                                                                                                      |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                      |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                     |
| Core content           | The screen must present only information needed to complete “Open exceptions”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Open exceptions                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                              |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.          |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                      |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                       |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.          |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Open exceptions” without undocumented staff assistance.                    |

### Shipment management

Route: /admin/shipments \| Area: Administration \| Primary action: Create shipment

| **Specification item** | **Requirement**                                                                                                                                                  |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Search, filter and export permitted shipment records.                                                                                                            |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                      |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                     |
| Core content           | The screen must present only information needed to complete “Create shipment”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Create shipment                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                              |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.          |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                      |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                       |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.          |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Create shipment” without undocumented staff assistance.                    |

### Shipment administration

Route: /admin/shipments/\[id\] \| Area: Administration \| Primary action: Add event

| **Specification item** | **Requirement**                                                                                                                                            |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Manage complete shipment, packages, documents and events.                                                                                                  |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                               |
| Core content           | The screen must present only information needed to complete “Add event”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Add event                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                        |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.    |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                 |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.    |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Add event” without undocumented staff assistance.                    |

### Create shipment

Route: /admin/shipments/new \| Area: Administration \| Primary action: Create

| **Specification item** | **Requirement**                                                                                                                                         |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Create a shipment on behalf of a customer.                                                                                                              |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                             |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                            |
| Core content           | The screen must present only information needed to complete “Create”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Create                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                     |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant. |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.             |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.              |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values. |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Create” without undocumented staff assistance.                    |

### Package management

Route: /admin/packages \| Area: Administration \| Primary action: Scan package

| **Specification item** | **Requirement**                                                                                                                                               |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Search packages across shipments and locations.                                                                                                               |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                   |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                  |
| Core content           | The screen must present only information needed to complete “Scan package”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Scan package                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                           |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.       |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                   |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                    |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.       |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Scan package” without undocumented staff assistance.                    |

### Package detail

Route: /admin/packages/\[id\] \| Area: Administration \| Primary action: Update package

| **Specification item** | **Requirement**                                                                                                                                                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Manage measurements, photos, labels and condition.                                                                                                              |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                     |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                    |
| Core content           | The screen must present only information needed to complete “Update package”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Update package                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                             |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.         |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                     |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                      |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.         |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Update package” without undocumented staff assistance.                    |

### Tracking event queue

Route: /admin/tracking \| Area: Administration \| Primary action: Resolve event

| **Specification item** | **Requirement**                                                                                                                                                |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Review recent events, conflicts and integration errors.                                                                                                        |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                    |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                   |
| Core content           | The screen must present only information needed to complete “Resolve event”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Resolve event                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                            |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.        |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                    |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                     |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.        |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Resolve event” without undocumented staff assistance.                    |

### Add or correct tracking event

Route: /admin/tracking/new \| Area: Administration \| Primary action: Save event

| **Specification item** | **Requirement**                                                                                                                                             |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Create an authorised event or correction with reason.                                                                                                       |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                 |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                |
| Core content           | The screen must present only information needed to complete “Save event”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Save event                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                         |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.     |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                 |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                  |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.     |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Save event” without undocumented staff assistance.                    |

### Quote management

Route: /admin/quotes \| Area: Administration \| Primary action: Create quote

| **Specification item** | **Requirement**                                                                                                                                               |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Search and manage automatic and manual quotes.                                                                                                                |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                   |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                  |
| Core content           | The screen must present only information needed to complete “Create quote”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Create quote                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                           |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.       |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                   |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                    |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.       |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Create quote” without undocumented staff assistance.                    |

### Quote detail

Route: /admin/quotes/\[id\] \| Area: Administration \| Primary action: Issue quote

| **Specification item** | **Requirement**                                                                                                                                              |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Review cost, margin, approval and customer response.                                                                                                         |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                  |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                 |
| Core content           | The screen must present only information needed to complete “Issue quote”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Issue quote                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                          |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.      |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                  |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                   |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.      |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Issue quote” without undocumented staff assistance.                    |

### Pricing rules

Route: /admin/pricing \| Area: Administration \| Primary action: Add rule

| **Specification item** | **Requirement**                                                                                                                                           |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Configure calculation order and eligibility.                                                                                                              |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                               |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                              |
| Core content           | The screen must present only information needed to complete “Add rule”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Add rule                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                       |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.   |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.               |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.   |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Add rule” without undocumented staff assistance.                    |

### Rate cards

Route: /admin/rate-cards \| Area: Administration \| Primary action: Import rates

| **Specification item** | **Requirement**                                                                                                                                               |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Manage route, zone, weight and effective-date rates.                                                                                                          |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                   |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                  |
| Core content           | The screen must present only information needed to complete “Import rates”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Import rates                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                           |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.       |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                   |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                    |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.       |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Import rates” without undocumented staff assistance.                    |

### Surcharges

Route: /admin/surcharges \| Area: Administration \| Primary action: Add surcharge

| **Specification item** | **Requirement**                                                                                                                                                |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Manage fuel, remote, oversize and operational fees.                                                                                                            |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                    |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                   |
| Core content           | The screen must present only information needed to complete “Add surcharge”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Add surcharge                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                            |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.        |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                    |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                     |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.        |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Add surcharge” without undocumented staff assistance.                    |

### Discounts and promotions

Route: /admin/discounts \| Area: Administration \| Primary action: Create discount

| **Specification item** | **Requirement**                                                                                                                                                  |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Manage customer, organisation and campaign discounts.                                                                                                            |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                      |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                     |
| Core content           | The screen must present only information needed to complete “Create discount”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Create discount                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                              |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.          |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                      |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                       |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.          |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Create discount” without undocumented staff assistance.                    |

### Customer management

Route: /admin/customers \| Area: Administration \| Primary action: Create customer

| **Specification item** | **Requirement**                                                                                                                                                  |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Search customers and view account state.                                                                                                                         |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                      |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                     |
| Core content           | The screen must present only information needed to complete “Create customer”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Create customer                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                              |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.          |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                      |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                       |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.          |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Create customer” without undocumented staff assistance.                    |

### Customer detail

Route: /admin/customers/\[id\] \| Area: Administration \| Primary action: Update customer

| **Specification item** | **Requirement**                                                                                                                                                  |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | View identity, shipments, payments, consent and support.                                                                                                         |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                      |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                     |
| Core content           | The screen must present only information needed to complete “Update customer”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Update customer                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                              |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.          |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                      |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                       |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.          |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Update customer” without undocumented staff assistance.                    |

### Business organisations

Route: /admin/organisations \| Area: Administration \| Primary action: Create organisation

| **Specification item** | **Requirement**                                                                                                                                                      |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Manage business accounts and verification.                                                                                                                           |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                          |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                         |
| Core content           | The screen must present only information needed to complete “Create organisation”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Create organisation                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                                  |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.              |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                          |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                           |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.              |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Create organisation” without undocumented staff assistance.                    |

### Organisation detail

Route: /admin/organisations/\[id\] \| Area: Administration \| Primary action: Approve account

| **Specification item** | **Requirement**                                                                                                                                                  |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Manage users, credit, rates and contracts.                                                                                                                       |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                      |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                     |
| Core content           | The screen must present only information needed to complete “Approve account”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Approve account                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                              |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.          |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                      |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                       |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.          |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Approve account” without undocumented staff assistance.                    |

### Pickup management

Route: /admin/pickups \| Area: Administration \| Primary action: Assign pickup

| **Specification item** | **Requirement**                                                                                                                                                |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Schedule, assign, monitor and reschedule pickups.                                                                                                              |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                    |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                   |
| Core content           | The screen must present only information needed to complete “Assign pickup”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Assign pickup                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                            |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.        |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                    |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                     |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.        |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Assign pickup” without undocumented staff assistance.                    |

### Pickup detail

Route: /admin/pickups/\[id\] \| Area: Administration \| Primary action: Update pickup

| **Specification item** | **Requirement**                                                                                                                                                |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | View address, packages, driver and evidence.                                                                                                                   |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                    |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                   |
| Core content           | The screen must present only information needed to complete “Update pickup”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Update pickup                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                            |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.        |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                    |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                     |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.        |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Update pickup” without undocumented staff assistance.                    |

### Delivery assignments

Route: /admin/deliveries \| Area: Administration \| Primary action: Assign delivery

| **Specification item** | **Requirement**                                                                                                                                                  |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Manage last-mile assignments and exceptions.                                                                                                                     |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                      |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                     |
| Core content           | The screen must present only information needed to complete “Assign delivery”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Assign delivery                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                              |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.          |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                      |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                       |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.          |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Assign delivery” without undocumented staff assistance.                    |

### Delivery detail

Route: /admin/deliveries/\[id\] \| Area: Administration \| Primary action: Update delivery

| **Specification item** | **Requirement**                                                                                                                                                  |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | View route, attempts, evidence and recipient result.                                                                                                             |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                      |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                     |
| Core content           | The screen must present only information needed to complete “Update delivery”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Update delivery                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                              |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.          |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                      |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                       |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.          |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Update delivery” without undocumented staff assistance.                    |

### Warehouse management

Route: /admin/warehouses \| Area: Administration \| Primary action: Add warehouse

| **Specification item** | **Requirement**                                                                                                                                                |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Manage active facilities and operating rules.                                                                                                                  |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                    |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                   |
| Core content           | The screen must present only information needed to complete “Add warehouse”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Add warehouse                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                            |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.        |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                    |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                     |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.        |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Add warehouse” without undocumented staff assistance.                    |

### Warehouse detail

Route: /admin/warehouses/\[id\] \| Area: Administration \| Primary action: Edit warehouse

| **Specification item** | **Requirement**                                                                                                                                                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | View inventory, staff, capacity and settings.                                                                                                                   |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                     |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                    |
| Core content           | The screen must present only information needed to complete “Edit warehouse”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Edit warehouse                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                             |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.         |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                     |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                      |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.         |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Edit warehouse” without undocumented staff assistance.                    |

### Warehouse inventory

Route: /admin/inventory \| Area: Administration \| Primary action: Move package

| **Specification item** | **Requirement**                                                                                                                                               |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Find packages by facility, zone, shelf or exception.                                                                                                          |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                   |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                  |
| Core content           | The screen must present only information needed to complete “Move package”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Move package                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                           |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.       |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                   |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                    |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.       |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Move package” without undocumented staff assistance.                    |

### Consolidation queue

Route: /admin/consolidation \| Area: Administration \| Primary action: Create consolidation

| **Specification item** | **Requirement**                                                                                                                                                       |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Group eligible packages and record approvals.                                                                                                                         |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                           |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                          |
| Core content           | The screen must present only information needed to complete “Create consolidation”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Create consolidation                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                                   |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.               |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                           |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                            |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.               |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Create consolidation” without undocumented staff assistance.                    |

### Repacking queue

Route: /admin/repacking \| Area: Administration \| Primary action: Approve repacking

| **Specification item** | **Requirement**                                                                                                                                                    |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Review packaging issues, costs and completion evidence.                                                                                                            |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                        |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                       |
| Core content           | The screen must present only information needed to complete “Approve repacking”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Approve repacking                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                                |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.            |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                        |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                         |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.            |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Approve repacking” without undocumented staff assistance.                    |

### Dispatch and manifests

Route: /admin/dispatch \| Area: Administration \| Primary action: Create manifest

| **Specification item** | **Requirement**                                                                                                                                                  |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Build dispatch batches and close manifests.                                                                                                                      |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                      |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                     |
| Core content           | The screen must present only information needed to complete “Create manifest”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Create manifest                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                              |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.          |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                      |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                       |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.          |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Create manifest” without undocumented staff assistance.                    |

### Customs queue

Route: /admin/customs \| Area: Administration \| Primary action: Open case

| **Specification item** | **Requirement**                                                                                                                                            |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Prioritise cases requiring documents, payment or broker action.                                                                                            |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                               |
| Core content           | The screen must present only information needed to complete “Open case”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Open case                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                        |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.    |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                 |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.    |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Open case” without undocumented staff assistance.                    |

### Customs case detail

Route: /admin/customs/\[id\] \| Area: Administration \| Primary action: Request document

| **Specification item** | **Requirement**                                                                                                                                                   |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Manage declarations, broker messages, deadlines and releases.                                                                                                     |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                       |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                      |
| Core content           | The screen must present only information needed to complete “Request document”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Request document                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                               |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.           |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                       |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                        |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.           |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Request document” without undocumented staff assistance.                    |

### Document review

Route: /admin/document-review \| Area: Administration \| Primary action: Review document

| **Specification item** | **Requirement**                                                                                                                                                  |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Approve, reject or request replacement documents.                                                                                                                |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                      |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                     |
| Core content           | The screen must present only information needed to complete “Review document”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Review document                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                              |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.          |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                      |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                       |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.          |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Review document” without undocumented staff assistance.                    |

### Payment management

Route: /admin/payments \| Area: Administration \| Primary action: Reconcile

| **Specification item** | **Requirement**                                                                                                                                            |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Search payment and reconciliation records.                                                                                                                 |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                               |
| Core content           | The screen must present only information needed to complete “Reconcile”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Reconcile                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                        |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.    |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                 |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.    |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Reconcile” without undocumented staff assistance.                    |

### Payment detail

Route: /admin/payments/\[id\] \| Area: Administration \| Primary action: Take action

| **Specification item** | **Requirement**                                                                                                                                              |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | View payment events, allocation, dispute and refund links.                                                                                                   |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                  |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                 |
| Core content           | The screen must present only information needed to complete “Take action”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Take action                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                          |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.      |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                  |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                   |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.      |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Take action” without undocumented staff assistance.                    |

### Invoice management

Route: /admin/invoices \| Area: Administration \| Primary action: Create invoice

| **Specification item** | **Requirement**                                                                                                                                                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Search invoices, credit notes and overdue balances.                                                                                                             |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                     |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                    |
| Core content           | The screen must present only information needed to complete “Create invoice”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Create invoice                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                             |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.         |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                     |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                      |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.         |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Create invoice” without undocumented staff assistance.                    |

### Invoice detail

Route: /admin/invoices/\[id\] \| Area: Administration \| Primary action: Issue invoice

| **Specification item** | **Requirement**                                                                                                                                                |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Review line items, tax, payment and e-invoice state.                                                                                                           |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                    |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                   |
| Core content           | The screen must present only information needed to complete “Issue invoice”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Issue invoice                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                            |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.        |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                    |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                     |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.        |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Issue invoice” without undocumented staff assistance.                    |

### Refund queue

Route: /admin/refunds \| Area: Administration \| Primary action: Review refund

| **Specification item** | **Requirement**                                                                                                                                                |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Review requested and approved refunds.                                                                                                                         |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                    |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                   |
| Core content           | The screen must present only information needed to complete “Review refund”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Review refund                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                            |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.        |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                    |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                     |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.        |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Review refund” without undocumented staff assistance.                    |

### Refund detail

Route: /admin/refunds/\[id\] \| Area: Administration \| Primary action: Approve refund

| **Specification item** | **Requirement**                                                                                                                                                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Record reason, approvals, amount and provider result.                                                                                                           |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                     |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                    |
| Core content           | The screen must present only information needed to complete “Approve refund”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Approve refund                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                             |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.         |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                     |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                      |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.         |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Approve refund” without undocumented staff assistance.                    |

### Claims queue

Route: /admin/claims \| Area: Administration \| Primary action: Open claim

| **Specification item** | **Requirement**                                                                                                                                             |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Prioritise and assign claims.                                                                                                                               |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                 |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                |
| Core content           | The screen must present only information needed to complete “Open claim”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Open claim                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                         |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.     |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                 |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                  |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.     |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Open claim” without undocumented staff assistance.                    |

### Claim detail

Route: /admin/claims/\[id\] \| Area: Administration \| Primary action: Decide claim

| **Specification item** | **Requirement**                                                                                                                                               |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Review evidence, liability, carrier case and decision.                                                                                                        |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                   |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                  |
| Core content           | The screen must present only information needed to complete “Decide claim”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Decide claim                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                           |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.       |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                   |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                    |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.       |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Decide claim” without undocumented staff assistance.                    |

### Return management

Route: /admin/returns \| Area: Administration \| Primary action: Approve return

| **Specification item** | **Requirement**                                                                                                                                                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Review return requests and return shipments.                                                                                                                    |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                     |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                    |
| Core content           | The screen must present only information needed to complete “Approve return”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Approve return                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                             |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.         |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                     |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                      |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.         |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Approve return” without undocumented staff assistance.                    |

### Return detail

Route: /admin/returns/\[id\] \| Area: Administration \| Primary action: Create return

| **Specification item** | **Requirement**                                                                                                                                                |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Manage charges, label, pickup and return tracking.                                                                                                             |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                    |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                   |
| Core content           | The screen must present only information needed to complete “Create return”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Create return                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                            |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.        |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                    |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                     |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.        |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Create return” without undocumented staff assistance.                    |

### Support tickets

Route: /admin/support \| Area: Administration \| Primary action: Open ticket

| **Specification item** | **Requirement**                                                                                                                                              |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | View escalated and shipment-related support records.                                                                                                         |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                  |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                 |
| Core content           | The screen must present only information needed to complete “Open ticket”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Open ticket                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                          |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.      |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                  |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                   |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.      |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Open ticket” without undocumented staff assistance.                    |

### Support ticket detail

Route: /admin/support/\[id\] \| Area: Administration \| Primary action: Add note

| **Specification item** | **Requirement**                                                                                                                                           |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | View support context and operational actions.                                                                                                             |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                               |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                              |
| Core content           | The screen must present only information needed to complete “Add note”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Add note                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                       |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.   |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.               |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.   |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Add note” without undocumented staff assistance.                    |

### Notification centre

Route: /admin/notifications \| Area: Administration \| Primary action: Retry notification

| **Specification item** | **Requirement**                                                                                                                                                     |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Inspect operational sends, failures and retries.                                                                                                                    |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                         |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                        |
| Core content           | The screen must present only information needed to complete “Retry notification”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Retry notification                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                                 |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.             |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                         |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                          |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.             |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Retry notification” without undocumented staff assistance.                    |

### Message templates

Route: /admin/templates \| Area: Administration \| Primary action: Create template

| **Specification item** | **Requirement**                                                                                                                                                  |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Manage approved email, SMS, WhatsApp and document templates.                                                                                                     |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                      |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                     |
| Core content           | The screen must present only information needed to complete “Create template”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Create template                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                              |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.          |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                      |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                       |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.          |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Create template” without undocumented staff assistance.                    |

### Staff management

Route: /admin/staff \| Area: Administration \| Primary action: Invite staff

| **Specification item** | **Requirement**                                                                                                                                               |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Create, suspend and assign staff.                                                                                                                             |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                   |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                  |
| Core content           | The screen must present only information needed to complete “Invite staff”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Invite staff                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                           |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.       |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                   |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                    |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.       |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Invite staff” without undocumented staff assistance.                    |

### Staff detail

Route: /admin/staff/\[id\] \| Area: Administration \| Primary action: Update access

| **Specification item** | **Requirement**                                                                                                                                                |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Manage role, warehouse, sessions and access review.                                                                                                            |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                    |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                   |
| Core content           | The screen must present only information needed to complete “Update access”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Update access                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                            |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.        |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                    |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                     |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.        |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Update access” without undocumented staff assistance.                    |

### Roles and permissions

Route: /admin/roles \| Area: Administration \| Primary action: Create role

| **Specification item** | **Requirement**                                                                                                                                              |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Create roles and review permission grants.                                                                                                                   |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                  |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                 |
| Core content           | The screen must present only information needed to complete “Create role”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Create role                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                          |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.      |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                  |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                   |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.      |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Create role” without undocumented staff assistance.                    |

### Administration reports

Route: /admin/reports \| Area: Administration \| Primary action: Generate report

| **Specification item** | **Requirement**                                                                                                                                                  |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Run operational, financial, customs, warehouse and support reports.                                                                                              |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                      |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                     |
| Core content           | The screen must present only information needed to complete “Generate report”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Generate report                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                              |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.          |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                      |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                       |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.          |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Generate report” without undocumented staff assistance.                    |

### Audit log

Route: /admin/audit \| Area: Administration \| Primary action: Export permitted log

| **Specification item** | **Requirement**                                                                                                                                                       |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Search append-only high-risk activity.                                                                                                                                |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                           |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                          |
| Core content           | The screen must present only information needed to complete “Export permitted log”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Export permitted log                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                                   |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.               |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                           |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                            |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.               |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Export permitted log” without undocumented staff assistance.                    |

### Content management

Route: /admin/content \| Area: Administration \| Primary action: Create content

| **Specification item** | **Requirement**                                                                                                                                                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Manage public pages, guides, FAQs, alerts and policies.                                                                                                         |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                     |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                    |
| Core content           | The screen must present only information needed to complete “Create content”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Create content                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                             |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.         |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                     |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                      |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.         |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Create content” without undocumented staff assistance.                    |

### System settings and integrations

Route: /admin/settings \| Area: Administration \| Primary action: Open setting

| **Specification item** | **Requirement**                                                                                                                                               |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Manage controlled configuration and provider connections.                                                                                                     |
| Primary audience       | Authorised Nauterio staff according to role and permission.                                                                                                   |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                  |
| Core content           | The screen must present only information needed to complete “Open setting”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Open setting                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                           |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.       |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                   |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                    |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.       |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Open setting” without undocumented staff assistance.                    |

## Warehouse PWA

### Warehouse sign in

Route: /warehouse/signin \| Area: Warehouse PWA \| Primary action: Sign in

| **Specification item** | **Requirement**                                                                                                                                          |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Authenticate the warehouse employee and select facility.                                                                                                 |
| Primary audience       | Authenticated warehouse staff assigned to the selected facility.                                                                                         |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                             |
| Core content           | The screen must present only information needed to complete “Sign in”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Sign in                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                      |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.  |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.              |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.               |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.  |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Sign in” without undocumented staff assistance.                    |

### Warehouse dashboard

Route: /warehouse \| Area: Warehouse PWA \| Primary action: Scan package

| **Specification item** | **Requirement**                                                                                                                                               |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Show receipt, inspection, storage, dispatch and exception workload.                                                                                           |
| Primary audience       | Authenticated warehouse staff assigned to the selected facility.                                                                                              |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                  |
| Core content           | The screen must present only information needed to complete “Scan package”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Scan package                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                           |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.       |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                   |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                    |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.       |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Scan package” without undocumented staff assistance.                    |

### Receive shipment

Route: /warehouse/receive \| Area: Warehouse PWA \| Primary action: Confirm receipt

| **Specification item** | **Requirement**                                                                                                                                                  |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Scan master or package code and confirm physical receipt.                                                                                                        |
| Primary audience       | Authenticated warehouse staff assigned to the selected facility.                                                                                                 |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                     |
| Core content           | The screen must present only information needed to complete “Confirm receipt”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Confirm receipt                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                              |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.          |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                      |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                       |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.          |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Confirm receipt” without undocumented staff assistance.                    |

### Package scanner

Route: /warehouse/scan \| Area: Warehouse PWA \| Primary action: Open package

| **Specification item** | **Requirement**                                                                                                                                               |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Scan or manually enter a package number.                                                                                                                      |
| Primary audience       | Authenticated warehouse staff assigned to the selected facility.                                                                                              |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                  |
| Core content           | The screen must present only information needed to complete “Open package”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Open package                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                           |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.       |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                   |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                    |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.       |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Open package” without undocumented staff assistance.                    |

### Package inspection

Route: /warehouse/inspect \| Area: Warehouse PWA \| Primary action: Complete inspection

| **Specification item** | **Requirement**                                                                                                                                                      |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Record condition, prohibited-item answers and exceptions.                                                                                                            |
| Primary audience       | Authenticated warehouse staff assigned to the selected facility.                                                                                                     |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                         |
| Core content           | The screen must present only information needed to complete “Complete inspection”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Complete inspection                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                                  |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.              |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                          |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                           |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.              |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Complete inspection” without undocumented staff assistance.                    |

### Measure and weigh

Route: /warehouse/measure \| Area: Warehouse PWA \| Primary action: Save measurements

| **Specification item** | **Requirement**                                                                                                                                                    |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Capture actual dimensions and calibrated weight.                                                                                                                   |
| Primary audience       | Authenticated warehouse staff assigned to the selected facility.                                                                                                   |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                       |
| Core content           | The screen must present only information needed to complete “Save measurements”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Save measurements                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                                |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.            |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                        |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                         |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.            |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Save measurements” without undocumented staff assistance.                    |

### Package photographs

Route: /warehouse/photos \| Area: Warehouse PWA \| Primary action: Upload photos

| **Specification item** | **Requirement**                                                                                                                                                |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Capture required exterior, label and damage images.                                                                                                            |
| Primary audience       | Authenticated warehouse staff assigned to the selected facility.                                                                                               |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                   |
| Core content           | The screen must present only information needed to complete “Upload photos”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Upload photos                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                            |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.        |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                    |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                     |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.        |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Upload photos” without undocumented staff assistance.                    |

### Storage assignment

Route: /warehouse/storage \| Area: Warehouse PWA \| Primary action: Assign location

| **Specification item** | **Requirement**                                                                                                                                                  |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Assign facility zone, shelf, bin and handling class.                                                                                                             |
| Primary audience       | Authenticated warehouse staff assigned to the selected facility.                                                                                                 |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                     |
| Core content           | The screen must present only information needed to complete “Assign location”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Assign location                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                              |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.          |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                      |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                       |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.          |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Assign location” without undocumented staff assistance.                    |

### Move package

Route: /warehouse/move \| Area: Warehouse PWA \| Primary action: Confirm move

| **Specification item** | **Requirement**                                                                                                                                               |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Scan from and to locations and record movement.                                                                                                               |
| Primary audience       | Authenticated warehouse staff assigned to the selected facility.                                                                                              |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                  |
| Core content           | The screen must present only information needed to complete “Confirm move”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Confirm move                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                           |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.       |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                   |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                    |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.       |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Confirm move” without undocumented staff assistance.                    |

### Consolidation

Route: /warehouse/consolidate \| Area: Warehouse PWA \| Primary action: Complete consolidation

| **Specification item** | **Requirement**                                                                                                                                                         |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Confirm package set, create consolidated package and measurements.                                                                                                      |
| Primary audience       | Authenticated warehouse staff assigned to the selected facility.                                                                                                        |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                            |
| Core content           | The screen must present only information needed to complete “Complete consolidation”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Complete consolidation                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                                     |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.                 |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                             |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                              |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.                 |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Complete consolidation” without undocumented staff assistance.                    |

### Repacking

Route: /warehouse/repack \| Area: Warehouse PWA \| Primary action: Complete repacking

| **Specification item** | **Requirement**                                                                                                                                                     |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Record old condition, materials, result and charge.                                                                                                                 |
| Primary audience       | Authenticated warehouse staff assigned to the selected facility.                                                                                                    |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                        |
| Core content           | The screen must present only information needed to complete “Complete repacking”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Complete repacking                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                                 |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.             |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                         |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                          |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.             |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Complete repacking” without undocumented staff assistance.                    |

### Dispatch manifest

Route: /warehouse/dispatch \| Area: Warehouse PWA \| Primary action: Close manifest

| **Specification item** | **Requirement**                                                                                                                                                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Scan outbound packages and close the manifest.                                                                                                                  |
| Primary audience       | Authenticated warehouse staff assigned to the selected facility.                                                                                                |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                    |
| Core content           | The screen must present only information needed to complete “Close manifest”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Close manifest                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                             |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.         |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                     |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                      |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.         |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Close manifest” without undocumented staff assistance.                    |

### Warehouse exceptions

Route: /warehouse/exceptions \| Area: Warehouse PWA \| Primary action: Open exception

| **Specification item** | **Requirement**                                                                                                                                                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Resolve unidentified, damaged, restricted or missing packages.                                                                                                  |
| Primary audience       | Authenticated warehouse staff assigned to the selected facility.                                                                                                |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                    |
| Core content           | The screen must present only information needed to complete “Open exception”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Open exception                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                             |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.         |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                     |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                      |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.         |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Open exception” without undocumented staff assistance.                    |

### Offline synchronisation

Route: /warehouse/sync \| Area: Warehouse PWA \| Primary action: Synchronise

| **Specification item** | **Requirement**                                                                                                                                              |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Show pending actions, conflicts and last successful sync.                                                                                                    |
| Primary audience       | Authenticated warehouse staff assigned to the selected facility.                                                                                             |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                 |
| Core content           | The screen must present only information needed to complete “Synchronise”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Synchronise                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                          |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.      |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                  |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                   |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.      |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Synchronise” without undocumented staff assistance.                    |

## Driver PWA

### Driver sign in

Route: /driver/signin \| Area: Driver PWA \| Primary action: Sign in

| **Specification item** | **Requirement**                                                                                                                                          |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Authenticate driver or delivery partner.                                                                                                                 |
| Primary audience       | Authenticated drivers or delivery partners assigned to the job.                                                                                          |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                             |
| Core content           | The screen must present only information needed to complete “Sign in”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Sign in                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                      |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.  |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.              |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.               |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.  |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Sign in” without undocumented staff assistance.                    |

### Driver dashboard

Route: /driver \| Area: Driver PWA \| Primary action: Start route

| **Specification item** | **Requirement**                                                                                                                                              |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Show shift, assignments, urgent notes and sync state.                                                                                                        |
| Primary audience       | Authenticated drivers or delivery partners assigned to the job.                                                                                              |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                 |
| Core content           | The screen must present only information needed to complete “Start route”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Start route                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                          |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.      |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                  |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                   |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.      |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Start route” without undocumented staff assistance.                    |

### Assignment list

Route: /driver/assignments \| Area: Driver PWA \| Primary action: Open assignment

| **Specification item** | **Requirement**                                                                                                                                                  |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | List pickups and deliveries in operational order.                                                                                                                |
| Primary audience       | Authenticated drivers or delivery partners assigned to the job.                                                                                                  |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                     |
| Core content           | The screen must present only information needed to complete “Open assignment”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Open assignment                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                              |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.          |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                      |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                       |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.          |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Open assignment” without undocumented staff assistance.                    |

### Assignment detail

Route: /driver/assignments/\[id\] \| Area: Driver PWA \| Primary action: Start task

| **Specification item** | **Requirement**                                                                                                                                             |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Show permitted contact, address, packages and instructions.                                                                                                 |
| Primary audience       | Authenticated drivers or delivery partners assigned to the job.                                                                                             |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                |
| Core content           | The screen must present only information needed to complete “Start task”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Start task                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                         |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.     |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                 |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                  |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.     |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Start task” without undocumented staff assistance.                    |

### Route and map

Route: /driver/route \| Area: Driver PWA \| Primary action: Navigate

| **Specification item** | **Requirement**                                                                                                                                           |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Show route sequence and navigation launch.                                                                                                                |
| Primary audience       | Authenticated drivers or delivery partners assigned to the job.                                                                                           |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                              |
| Core content           | The screen must present only information needed to complete “Navigate”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Navigate                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                       |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.   |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.               |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.   |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Navigate” without undocumented staff assistance.                    |

### Pickup checklist

Route: /driver/pickup-checklist \| Area: Driver PWA \| Primary action: Confirm pickup

| **Specification item** | **Requirement**                                                                                                                                                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Verify person, package count, condition and declaration.                                                                                                        |
| Primary audience       | Authenticated drivers or delivery partners assigned to the job.                                                                                                 |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                    |
| Core content           | The screen must present only information needed to complete “Confirm pickup”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Confirm pickup                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                             |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.         |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                     |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                      |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.         |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Confirm pickup” without undocumented staff assistance.                    |

### Pickup confirmation

Route: /driver/pickup-confirmation \| Area: Driver PWA \| Primary action: Complete pickup

| **Specification item** | **Requirement**                                                                                                                                                  |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Capture scan, name, signature/photo and timestamp.                                                                                                               |
| Primary audience       | Authenticated drivers or delivery partners assigned to the job.                                                                                                  |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                     |
| Core content           | The screen must present only information needed to complete “Complete pickup”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Complete pickup                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                              |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.          |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                      |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                       |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.          |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Complete pickup” without undocumented staff assistance.                    |

### Delivery checklist

Route: /driver/delivery-checklist \| Area: Driver PWA \| Primary action: Continue

| **Specification item** | **Requirement**                                                                                                                                           |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Verify address, package count and service requirement.                                                                                                    |
| Primary audience       | Authenticated drivers or delivery partners assigned to the job.                                                                                           |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                              |
| Core content           | The screen must present only information needed to complete “Continue”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Continue                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                       |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.   |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.               |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.   |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Continue” without undocumented staff assistance.                    |

### Recipient verification

Route: /driver/recipient-verification \| Area: Driver PWA \| Primary action: Verify recipient

| **Specification item** | **Requirement**                                                                                                                                                   |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Capture approved identity or one-time-code verification.                                                                                                          |
| Primary audience       | Authenticated drivers or delivery partners assigned to the job.                                                                                                   |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                      |
| Core content           | The screen must present only information needed to complete “Verify recipient”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Verify recipient                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                               |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.           |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                       |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                        |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.           |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Verify recipient” without undocumented staff assistance.                    |

### Signature and photograph

Route: /driver/proof \| Area: Driver PWA \| Primary action: Complete delivery

| **Specification item** | **Requirement**                                                                                                                                                    |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Capture proof of delivery according to service rules.                                                                                                              |
| Primary audience       | Authenticated drivers or delivery partners assigned to the job.                                                                                                    |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                       |
| Core content           | The screen must present only information needed to complete “Complete delivery”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Complete delivery                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                                |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.            |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                        |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                         |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.            |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Complete delivery” without undocumented staff assistance.                    |

### Failed delivery attempt

Route: /driver/failed-attempt \| Area: Driver PWA \| Primary action: Submit attempt

| **Specification item** | **Requirement**                                                                                                                                                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Record controlled reason, evidence and next action.                                                                                                             |
| Primary audience       | Authenticated drivers or delivery partners assigned to the job.                                                                                                 |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                    |
| Core content           | The screen must present only information needed to complete “Submit attempt”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Submit attempt                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                             |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.         |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                     |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                      |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.         |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Submit attempt” without undocumented staff assistance.                    |

### Offline synchronisation

Route: /driver/sync \| Area: Driver PWA \| Primary action: Synchronise

| **Specification item** | **Requirement**                                                                                                                                              |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Show pending actions and conflicts.                                                                                                                          |
| Primary audience       | Authenticated drivers or delivery partners assigned to the job.                                                                                              |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                 |
| Core content           | The screen must present only information needed to complete “Synchronise”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Synchronise                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                          |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.      |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                  |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                   |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.      |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Synchronise” without undocumented staff assistance.                    |

### Shift history

Route: /driver/history \| Area: Driver PWA \| Primary action: End shift

| **Specification item** | **Requirement**                                                                                                                                            |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Show completed tasks and end-of-shift checks.                                                                                                              |
| Primary audience       | Authenticated drivers or delivery partners assigned to the job.                                                                                            |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                               |
| Core content           | The screen must present only information needed to complete “End shift”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | End shift                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                        |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.    |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                 |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.    |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “End shift” without undocumented staff assistance.                    |

## Status and developer

### Public status page

Route: /status \| Area: Status and developer \| Primary action: Subscribe

| **Specification item** | **Requirement**                                                                                                                                            |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Show incidents, uptime history and planned maintenance.                                                                                                    |
| Primary audience       | Public status visitors or approved technical partners.                                                                                                     |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                               |
| Core content           | The screen must present only information needed to complete “Subscribe”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Subscribe                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                        |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.    |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                 |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.    |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Subscribe” without undocumented staff assistance.                    |

### Developer portal

Route: /developers \| Area: Status and developer \| Primary action: Request access

| **Specification item** | **Requirement**                                                                                                                                                 |
|------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Explain API access, environments and onboarding.                                                                                                                |
| Primary audience       | Public status visitors or approved technical partners.                                                                                                          |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                    |
| Core content           | The screen must present only information needed to complete “Request access”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Request access                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                             |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.         |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                     |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                      |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.         |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Request access” without undocumented staff assistance.                    |

### API reference

Route: /developers/api \| Area: Status and developer \| Primary action: Try sandbox

| **Specification item** | **Requirement**                                                                                                                                              |
|------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Publish versioned OpenAPI documentation.                                                                                                                     |
| Primary audience       | Public status visitors or approved technical partners.                                                                                                       |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                 |
| Core content           | The screen must present only information needed to complete “Try sandbox”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Try sandbox                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                          |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.      |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                  |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                   |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.      |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Try sandbox” without undocumented staff assistance.                    |

### API changelog

Route: /developers/changelog \| Area: Status and developer \| Primary action: Subscribe

| **Specification item** | **Requirement**                                                                                                                                            |
|------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Publish additions, fixes and deprecations.                                                                                                                 |
| Primary audience       | Public status visitors or approved technical partners.                                                                                                     |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                               |
| Core content           | The screen must present only information needed to complete “Subscribe”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Subscribe                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                        |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.    |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                 |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.    |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Subscribe” without undocumented staff assistance.                    |

### Sandbox access

Route: /developers/sandbox \| Area: Status and developer \| Primary action: Create sandbox key

| **Specification item** | **Requirement**                                                                                                                                                     |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Business goal          | Create or manage non-production integration credentials.                                                                                                            |
| Primary audience       | Public status visitors or approved technical partners.                                                                                                              |
| Required header        | Area-specific header, current context, language where applicable, help access and account/security controls.                                                        |
| Core content           | The screen must present only information needed to complete “Create sandbox key”, with a clear title, concise explanation, structured data and contextual guidance. |
| Primary action         | Create sandbox key                                                                                                                                                  |
| Secondary actions      | Back/cancel where safe, save draft when data entry is involved, contact support, and view related record or policy.                                                 |
| States                 | Loading, first-use/empty, populated, validation error, provider unavailable, permission denied, session expired, completed and archived where relevant.             |
| Data and privacy       | Mask personal information by default; show only fields justified by the user’s role and current task. Record sensitive views when required.                         |
| Accessibility          | Keyboard operable, labelled controls, visible focus, error summary, status not communicated by colour alone, and responsive reading order.                          |
| Analytics              | Record page/screen view, primary-action start, completion, error category, abandonment and support escalation without capturing sensitive field values.             |
| Acceptance rule        | An authorised user can understand the page purpose in under ten seconds and complete “Create sandbox key” without undocumented staff assistance.                    |
