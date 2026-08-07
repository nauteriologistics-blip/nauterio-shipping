# 13. Warehouse PWA

The warehouse application must favour scanning, large touch controls and explicit confirmation. It operates as a PWA so an approved Android device can install it without waiting for native app-store releases.

50. Sign in with MFA and choose/confirm the facility.

51. Scan shipment or package. Manual entry is the fallback, not the default.

52. Confirm expected package count and physical custody.

53. Inspect exterior condition and answer controlled-goods questions.

54. Capture actual weight and dimensions; record equipment/manual source.

55. Take required photos: all sides where needed, label, packaging concern and damage.

56. Assign storage location or exception queue.

57. Move, consolidate, repack or dispatch only through scan-confirmed workflows.

58. Offline actions show as unsynchronised until the server accepts them.

59. Every correction records employee, before/after value, time and reason.

## 13.1 Warehouse hardware baseline

| **Equipment**   | **Minimum requirement**                                                                                                                   |
|-----------------|-------------------------------------------------------------------------------------------------------------------------------------------|
| Handheld        | Android 12+, integrated 2D barcode scanner, camera, Wi-Fi, optional mobile data, long-life battery, IP65 or better and device management. |
| Thermal printer | 4 x 6 inch labels, ZPL, network and USB, 203 or 300 dpi.                                                                                  |
| Scale           | Commercially suitable and calibrated for the accepted package weight range.                                                               |
| Workstation     | 8 GB RAM minimum, modern browser, stable network and controlled user account.                                                             |
| Connectivity    | Reliable warehouse Wi-Fi, backup mobile connection and UPS power for critical network/printer equipment.                                  |
