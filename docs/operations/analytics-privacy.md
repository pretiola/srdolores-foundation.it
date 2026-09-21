# Analytics privacy controls — 20 September 2026

The owner requested retaining Google signals and advertising with separate visitor opt-in.

## Deployed website behavior

- Basic Consent Mode: no Google tag request until an explicit choice permits analytics.
- Three equally styled choices: decline all; analytics only; analytics and advertising.
- Analytics-only denies ad_storage, ad_user_data and ad_personalization and disables signals.
- Advertising opt-in grants these three consent types and enables signals/personalization.
- Preference record (version, timestamp, analytics and advertising choice) kept in local storage for 180 days. Expired/malformed/unavailable records never authorize tracking.
- Footer settings support withdrawal and changed choices; Google library unloaded by reload and accessible first-party analytics/advertising cookies removed. Changes propagate across tabs on the same origin.
- No User-ID or customer identifiers supplied. Enhanced conversions disabled in tag configuration. No visitor accounts or data-entry forms exist.
- No tracking when JavaScript is unavailable. All site content remains available.

## Account-side verification still required

The screenshot does not show these settings and website code cannot certify them:

- Verify the Google tag's **Allow user-provided data capabilities** / automatic detection setting. Turn off automatic detection on this informational site: public foundation emails/phone numbers must not be treated as visitor-provided identifiers. Property-level acknowledgement alone does not establish collection consent.
- Confirm event/user retention duration and update the public policy with that verified duration; cookie lifetime is separate.
- Check linked advertising accounts, connected tags, audience exports and account data-sharing settings. Never build sensitive-interest audiences from Mass intentions or other sensitive personal information.
- Confirm applicable Google data-processing/transfer terms and controller contact details, and maintain the organization's retention and privacy-request procedures.
- Browser-local consent records are implemented; determine whether organizational audit requirements need separate durable records. Do not upload visitor identifiers merely to record consent.

Sources:
- https://www.google.com/about/company/user-consent-policy/
- https://developers.google.com/tag-platform/security/guides/consent
- https://developers.google.com/tag-platform/security/guides/privacy
- https://support.google.com/analytics/answer/2700409
- https://support.google.com/analytics/answer/14077171
- https://support.google.com/analytics/answer/12002752

## Verification

Run the server, then `TEST_URL=http://localhost:8080 node tests/browser/privacy.cjs` with Playwright installed. Optional PLAYWRIGHT_MODULE and CHROMIUM_PATH select an existing runtime. The test stubs the Google script to avoid creating test traffic and validates consent commands, network gating, persistence, withdrawal, downgrade, cookie clearing, mobile layout and no-JavaScript behavior. A separate real-tag smoke check verified analytics-only requests include G101 and npa=1.
