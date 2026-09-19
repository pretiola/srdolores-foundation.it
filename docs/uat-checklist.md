# Local UAT — first review batch

Review the actual Rust application at http://localhost:8080/. No pushes or deployments are authorized by this checklist.

## Review steps

1. Homepage: the primary appeal should clearly describe the target of 60 families and 300 piglets. Education and other community work should remain easy to find.
2. Get Involved: expand each payment tile with mouse/touch and keyboard. Check the European bank, EURC/Ethereum and PayPal labels and instructions.
3. Budget: verify the presentation of 300 piglets, 60 feed bags, veterinary supplies and totals of UGX 50,000,000 / approximately EUR 13,366. The estimate note must be clear, without implying finalized current prices.
4. Contact: confirm that Fr. Emmanuel Kasibante appears under Contact information and that the contact details are correct.
5. QR codes: check the bank's custom and EUR 40 choices. Open the compact text links in Lynx. The full bank view is 45 columns by 24 rows; Ethereum is 37 columns by 20 rows. The old ASCII URLs now serve these same compact views. A phone scan may be used to inspect the recipient, but do not submit a donation as part of UAT.
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

Fr. Emmanuel still needs to confirm costs, feed quantities, current delivery counts, heritage facts and reporting responsibilities. The narrative, field workflow and financial template are drafts. No real financial record has been reconciled and no December assets have been received. The initial Updates destination and consolidated project overview are now ready for the second local review batch.

Record each finding as: page; device/browser; action; expected result; observed result; priority. Sign-off should identify the reviewed local commit and whether it authorizes only the content/design or also a specific push/deployment. A push to main currently triggers Fly.io deployment automatically.

## Second local review batch

The user approved the sliding photos, contact information and compact Lynx QR display.

Now review `/project.html` and `/updates.html`, available under What we do and from the homepage. Check that the overview explains the target and operating model clearly, the Updates empty state is understandable, and the contact/budget links lead to the right destinations. Existing detail-page URLs are retained.

Both pages passed checks at 320, 375, 768 and 1280 pixels, automated accessibility checks, keyboard submenu access, JavaScript-disabled rendering and Lynx reads. Their routes are covered by the existing page and sitemap integration tests. Historical claims, new outcome figures, financial reconciliation and December media still await supporting facts.

## Navigation and project history review — 19 September 2026

- Review Project updates: historical website work, July ledger milestone, reporting preparations, and December visit explicitly planned.
- Open What we do: Beneficiaries, Challenges, Goals, Project overview (piglet), Updates (newspaper).
- Follow footer previous/next links from Home through Who we are, Beneficiaries, Challenges, Goals, Project overview, Updates, Holy Mass, Get Involved.
- Calendar and legal pages offer a route into Project overview, without replacing calendar month controls.
- Verified: 10 Rust integration tests; project/updates at 320, 375, 768, 1280px; automated WCAG checks, keyboard submenu, JavaScript-disabled content; Lynx text output.
- Awaiting user UAT. No push or deployment authorized.

## Piglet visual and counters — 19 September 2026

- Project overview: 60 / 5 / 300 count up once when visible; no JavaScript and reduced motion retain final totals. Screen readers receive stable totals.
- Generated illustration inspired by the supplied photograph, with responsive WebP/JPEG assets and descriptive alternative text.
- HTML facts explain climate care, conditional growth examples and breeding potential. Breed remains unconfirmed; no claims of measured resilience or guaranteed herd multiplication.
- Sources linked directly on the page: FAO pig housing, reproduction and tropical adaptation; ILRI Uganda heat-stress research.
- Review the illustration and explanatory copy locally before release.
