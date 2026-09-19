# Local review, deployment and recovery

## Current workflow

Use the local Rust/Actix application, not the retired static preview, for UAT. Local source is on `review/feedback-burndown`. Keep commits local until the user approves a specific release action. The prior Sites preview is not maintained and should not be treated as the current implementation.

## Start and verify locally

Prerequisites: Rust toolchain, Node, and OpenSSL development libraries/pkg-config on Linux. From the repository root:

```sh
npm ci
npm run check:qr
npm run build:css
npm run build:images
cargo test --locked
cargo run --locked
```

The default address is http://localhost:8080/. `PORT` selects another port. Templates load at startup: restart the local Rust process after editing templates. Static CSS/JS changes need a browser refresh. Built image variants are ignored by Git and must be regenerated in a new checkout.

The local EURC endpoint needs `ETHERSCAN_API_KEY` for live data; without it the page correctly says the total is unavailable. `MCP_ENDPOINT` optionally selects the liturgical service. Do not copy credentials into source, notes, terminal output or the repository. No X tracking variables are needed.

## Preserve review state

Record a clean commit before release. Keep meaningful fixes in separate commits; include generated CSS with its source and generated text QR files with payment changes. Prefer a new corrective/revert commit over rewriting already shared history. Never discard uncommitted user work as a recovery shortcut.

## Production release — pending explicit sign-off

The existing GitHub workflow builds/tests and then deploys to Fly.io on a push to `main`. A push to main is therefore a deployment action, not just a source backup. Before release, confirm the exact commit, destination, configuration and rollback revision with the user. An approved source push must not be silently interpreted as permission to trigger an unreviewed production deploy.

The Docker build compiles Rust, builds CSS/images with Node, and copies templates/static assets into the runtime image. A full Docker build has not yet been tested in this local environment; Docker/Podman is not installed. Complete that verification before claiming deployment readiness.

## Recovery procedure to validate before release

1. Identify the last known good reviewed source revision and the currently deployed Fly release.
2. Preserve current local work and inspect the failing behavior and logs without exposing secrets.
3. Choose either a reviewed source revert or the established Fly rollback mechanism after confirming available release history and the exact CLI behavior at release time.
4. Obtain authorization for the production recovery action. Execute only the selected action and verify the homepage, donation instructions, static images, health/page routes and external-service fallback behavior.
5. Record what was deployed/reverted and the verified result.

This is a continuity outline, not a claim that production rollback has been exercised. No production secrets, machine state or deployment settings were changed during local review.
