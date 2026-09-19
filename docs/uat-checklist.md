# Local UAT — first review batch

Review the actual Rust application at http://localhost:8080/. No pushes or deployments are authorized by this checklist.

## Review steps

1. Homepage: the primary appeal should clearly describe the target of 60 families and 300 piglets. Education and other community work should remain easy to find.
2. Get Involved: expand each payment tile with mouse/touch and keyboard. Check the European bank, EURC/Ethereum and PayPal labels and instructions.
3. Budget: verify the presentation of 300 piglets, 60 feed bags, veterinary supplies and totals of UGX 50,000,000 / approximately EUR 13,366. The estimate note must be clear, without implying finalized current prices.
4. Contact: confirm that Fr. Emmanuel Kasibante appears under Contact information and that the contact details are correct.
5. QR codes: check the bank's custom and EUR 40 choices. Open the compact text and ASCII links in Lynx. Compact bank codes need 57 columns; compact Ethereum needs 45. ASCII versions need 114 and 90 columns respectively. A phone scan may be used to inspect the recipient, but do not submit a donation as part of UAT.
6. Photo album: reload a desktop page with pictures. Photos should ease into random angles rather than snap. Scroll to confirm the gentle rotation still responds. Reduced-motion mode and narrow layouts should keep pictures stationary.
7. Navigation/gallery: use Tab/Enter to open project navigation, activate an image, close it with Escape and confirm focus returns to its link. Check the pages with JavaScript disabled.
8. Calendar: confirm readable dates and sensible wrapping on a narrow screen. Data may be unavailable when the upstream service fails; it should not be described as proof that the calendar is empty.
9. Tracking: X conversion beacons and their server endpoint are removed. Ordinary social links remain. Google Analytics is still present in the foundation source.

## Agent verification completed

- 10 Rust integration tests passed, including no-JavaScript payment instructions, text QR URLs/content types and X endpoint removal.
- Existing browser review passed across 10 pages at 4 widths, with no browser errors in the tested path.
- Automated accessibility checks for Get Involved reported no violations in the tested state.
- Browser QR codes and all six text QR variants were decoded to their expected recipient/payloads.
- Actual Lynx output shows the contact name, payment instructions and compact QR diagrams.
- Motion sampling confirmed a transition from 0 to the intended angle, intermediate frames, preserved scroll response and stationary reduced-motion/narrow-screen behavior.

## Limits and remaining work

This is an initial UAT batch, not final approval of the entire September–December program. Full Firefox/WebKit testing and a Docker image build remain outstanding. The local environment currently has no Docker/Podman executable. No Etherscan key is configured locally, so the honest unavailable-total state is shown.

Fr. Emmanuel still needs to confirm costs, feed quantities, current delivery counts, heritage facts and reporting responsibilities. The narrative, field workflow and financial template are drafts. No real financial record has been reconciled and no December assets have been received. The Updates destination and consolidated project overview remain future implementation batches.

Record each finding as: page; device/browser; action; expected result; observed result; priority. Sign-off should identify the reviewed local commit and whether it authorizes only the content/design or also a specific push/deployment. A push to main currently triggers Fly.io deployment automatically.
