# Feedback burn-down plan

## Working agreement

- Work in the actual Rust/Actix/Tera repository and review at http://localhost:8080/.
- Keep the 60-family goal explicit. Five piglets per family means a target of 300 piglets; do not present targets as achieved outcomes.
- Preserve usable HTML in Lynx, with JavaScript disabled, with styles unavailable, and when external services fail. Modern browser features enhance that foundation.
- Make small, coherent local commits after the relevant checks pass. Include required compiled CSS in the same commit as its source changes.
- No GitHub pushes, Sites publishing, Fly.io deployments, remote configuration changes, or messages to third parties before explicit sign-off. Existing GitHub automation deploys on a push to main, so pushing and production release require deliberate separation.
- Keep an item open when it depends on unverified facts or unavailable evidence. Record the missing input instead of inventing it.

Source: the September–December 2026 briefing supplied by the user, the repository review, and the user's subsequent directions on 60 families, payment tiles, X tracking, and local review.

## Current state

The first local UAT batch is committed. See `uat-checklist.md` for review steps and verification limits. The application remains local; no pushes or deployments have occurred since the local-only instruction.

| Commit | Completed work |
|---|---|
| `9fcd5e8` | Removed X beacons, conversion endpoint and deployment variables; tested the staged commit separately |
| `0d2680a` | Corrected budget and 60-family focus; donation tiles and browser/accessibility repairs; tested the staged commit separately |
| `617c990` | Contact name and compact/ASCII text QR files, shared payloads, freshness check and regression coverage |
| `82f7357` | Smooth initial photo rotation with scroll response and reduced-motion handling |
| `8d43bd5` | Facts register, narrative questions, publishing templates, financial schema and December readiness drafts |

The earlier display/donation edits shared templates and compiled CSS, so they were retained as one coherent tested commit rather than split into broken intermediate states. Draft documents do not resolve factual dependencies. The consolidated project overview and initial Updates destination are implemented locally. Full browser coverage, Docker validation and approved factual content remain open.

## Latest UAT and implementation record

The user approved the sliding photo behavior, contact information and compact Lynx QR display. This approval does not authorize a push or deployment.

Local commit `5ddc41b` adds the project overview and initial Updates destination, links them from the existing navigation/homepage, and keeps all old page URLs. Updates explicitly has no field reports rather than invented entries. Checks: ten Rust integration tests; both pages at four widths; automated accessibility checks; keyboard navigation; JavaScript-disabled content; actual Lynx output; visual inspection.

## Ordered batches

### 1. Establish the review baseline

- [x] Preserve the existing changes on a local review branch and record their baseline.
- [ ] Split existing work into the following coherent commits, keeping each intermediate state usable; combine inseparable changes rather than creating broken commits.
- [ ] Record the checks and remaining issues for each batch below.

Suggested commit: `docs: record feedback burn-down and local review process`.

### 2. Remove X tracking

- [x] Review and commit removal of the browser beacon, interaction event, server endpoint and deployment variables.
- [x] Preserve ordinary social links.
- [ ] Verify no X tracking request occurs on load, scroll or click, and that the old endpoint no longer accepts conversion events.
- [x] Record that Google Analytics remains; any broader analytics decision is separate from the user's explicit X-removal request.

Suggested commit: `privacy: remove X conversion tracking`.

### 3. Correct the budget and establish a facts register

- [x] Commit the arithmetic corrections and clear per-family versus project totals.
- [x] Keep the existing 60 feed bags as the calculation basis, explicitly pending confirmation of the intended quantity.
- [ ] Verify UGX and EUR column sums separately. The current estimates imply UGX 50,000,000 and approximately EUR 13,366; do not imply one verified current exchange rate.
- [x] Create a dated facts register with source, owner, status and last verification date for every numerical or historical public claim.
- [x] Flag unit prices, feed quantities, veterinary costs, training/supervision costs, education coverage, target status and actual delivery counts for Fr. Emmanuel's confirmation.
- [ ] Distinguish planned activities, ongoing work and documented outcomes consistently.

Suggested commits: `fix: correct the 60-family planning budget`; `docs: track sources and unresolved project claims`.

### 4. Complete the Get Involved journey

- [x] Put the current 60-family need and contribution impact before payment details.
- [x] Review the IBAN/European flag, EURC/Ethereum and PayPal tiles on desktop and mobile.
- [x] Preserve all recipient details and clear token/network labels in plain HTML.
- [ ] Verify native disclosure behavior, keyboard focus, touch targets, narrow-screen wrapping and text labels without icons.
- [ ] Decode both bank QR modes and the crypto QR; check clipboard success and failure behavior.
- [ ] Show unavailable totals honestly, preserve the public ledger link without JavaScript, and avoid reporting a capped or failed transaction response as a complete total.
- [x] Keep PayPal's current email-based instructions accurate; do not invent a checkout destination.
- [ ] Add an accurate explanation of how progress is reported once that reporting process is agreed; do not publish an unsupported promise.

Suggested commit: `feat: progressively enhance donation choices`.

### 5. Finish the cross-browser and accessibility repairs

- [x] Commit keyboard-operable navigation, skip links and visible focus states.
- [ ] Keep gallery images and links accessible without the carousel library; verify image-dialog focus and Escape behavior.
- [x] Respect reduced motion and prevent image effects from causing clipping or sideways scrolling.
- [x] Finish calendar readability and truthful unavailable-data handling.
- [ ] Audit headings, table semantics, alt text, contrast, zoom/reflow, link names and missing assets across every page, not just Get Involved.
- [ ] Test Chromium, Firefox and WebKit where available, plus actual Lynx, CSS-disabled and JavaScript-disabled rendering. Record coverage limits explicitly.

Suggested commits: `fix: preserve navigation and gallery access across browsers`; `fix: improve calendar and page readability`.

### 6. Clarify the homepage and project explanation

- [ ] Review the current 60-family homepage emphasis and primary action.
- [x] Draft a coherent project overview covering Binzi, the families, practical challenges, the operating model, family responsibilities and intended outcomes.
- [ ] Retain useful detailed information and preserve existing URLs; use redirects if an approved navigation change needs new URLs.
- [ ] Keep education, agriculture, water and housing visible without obscuring the primary 60-family objective.
- [ ] Replace unsupported certainty with sourced, accurate wording; distinguish aspiration from evidence.

Suggested commit: `content: clarify the 60-family project and visitor journey`.

### 7. Resolve the Foundation and heritage narrative

- [ ] Prepare the two-page canonical narrative as a draft with unresolved claims marked.
- [ ] Assemble a chronology and focused questions on Sister Dolores, Fr. Emmanuel, Binzi and the Foundation's origins.
- [ ] Separate documented history, first-person recollection and interpretation.
- [ ] Clarify Pretiola's technical/advisory role and the locally led operation.
- [ ] Revise Who We Are only using verified material; do not imply Sister Dolores worked in Binzi without evidence.

Suggested commits: `docs: prepare narrative and heritage verification`; `content: update the approved Foundation story`.

Dependency: Fr. Emmanuel's corrections, account of the personal connection and any supporting historical material. Drafting can proceed; factual approval cannot be assumed.

### 8. Prepare evidence and updates publishing

- [x] Design a simple server-rendered Updates/Evidence destination, without adding a new platform unless needed.
- [x] Prepare reusable field-update, case-study, milestone and financial-note templates.
- [ ] Include dates, status, sources and meaningful captions; retain consent and sensitive participant records privately rather than in public pages or the public Git repository.
- [ ] Link contributions to expenditure and outcomes without treating the incoming EURC ledger as proof of local spending or impact.
- [ ] Publish only real updates. Keep demonstrations clearly marked in local drafts and out of production.

Suggested commits: `feat: add accessible evidence and update templates`; `content: add verified project updates`.

Dependency: approved facts and real evidence for populated public entries.

### 9. Prepare financial reconciliation

- [ ] Draft a lightweight template for contribution date/channel/currency, fees, transfer or bank receipt, local expenditure, evidence reference and outcome/status.
- [ ] Explain the distinction between incoming funds, funds available locally, expenditure and results.
- [x] Prepare a redacted public-summary format.
- [ ] Reconcile one real contribution end to end once authorized records are supplied. Keep private financial records outside the public repository.

Suggested commit: `docs: define contribution-to-outcome reporting`.

Dependency: transaction and expenditure records, plus confirmation of the actual process.

### 10. Prepare December field capture and intake

- [ ] Produce a minimum capture checklist: Fr. Emmanuel interview, one consenting adult/household case study, operational evidence, community/pastoral context and useful horizontal/vertical coverage.
- [x] Prepare interview prompts and the unresolved factual questions the trip should answer.
- [ ] Create blank metadata and consent-record templates covering date, location, activity, creator, identification permission, reuse restrictions and appropriate child/guardian requirements.
- [x] Define naming, original-file preservation, backup and intake-folder conventions.
- [ ] Document intake → metadata → selection → editorial → factual approval → publication → archive, with proposed responsibilities awaiting confirmation.
- [x] Prepare the one-page phone-friendly field checklist and November readiness scorecard.

Suggested commit: `docs: prepare December capture and publishing workflow`.

Dependency: itinerary, observable activities, participants, local liaison, equipment and assigned owners. No invitations or outreach will be sent without authorization.

### 11. Confirm technical and release readiness

- [ ] Review relevant dependency/security findings, external-service timeouts, error handling and payment-total accuracy; prioritize concrete issues over unrelated infrastructure changes.
- [ ] Verify the actual Docker build and generated assets, in addition to local Rust execution.
- [x] Document deployment, rollback and recovery with no credentials in source.
- [ ] Run the final regression suite and browser matrix against the actual local application.
- [ ] Produce a review summary with commit list, completed backlog items, unresolved facts, screenshots where useful and known limitations.
- [ ] Obtain explicit user sign-off on the local changes and the intended release action before any push or deployment. Pushing main currently triggers deployment automatically.

Suggested commits: `chore: document deployment and recovery`; `test: verify the reviewed site across supported environments`.

### 12. After December assets arrive

- [ ] Ingest and back up originals with their metadata and consent records.
- [ ] Verify and prepare the flagship field update, homepage/current priority refresh, Fr. Emmanuel story, first case study and heritage update.
- [ ] Reconcile related financial evidence and prepare a 60–90 day editorial calendar.
- [ ] Release each approved story through the same local-review and explicit-release-sign-off process.
- [ ] Revisit contributor/apprenticeship ideas only after the evidence package and publishing workflow are ready.

Dependency: actual field material and factual/participant approvals. This is a deferred workstream, not work to fabricate or mark complete now.

## Definition of done for each batch

1. Scope and acceptance criteria are clear.
2. Changes are visible in the real local application, or are clearly identified draft operational documents.
3. Relevant verification passes; any limitation is recorded.
4. A coherent local commit exists and the checklist records its hash.
5. No remote push or deployment occurs.
