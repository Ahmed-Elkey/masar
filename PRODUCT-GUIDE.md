# Masar: decision tools

## Visitor journey
- `/projects`: search and filter by destination, developer and status. Filters survive reloads and language changes via URL parameters. Save or compare from project cards.
- `/projects/[slug]`: save/compare, project source links, coordinate accuracy, source review date (unknown unless recorded), source edition and correction entry point.
- `/planner`: saved projects, up to three side-by-side comparisons, JSON export/import, printable planner and share link. Shared choices require explicit import and do not silently overwrite a visitor's saved projects. Import merges saved projects and replaces only comparison slots; unknown IDs are removed. No accounts required.
- Daily journeys: select a curated public place, or enter coordinates in Egypt. Six candidates are chosen by straight-line distance. Explicit consent and Calculate are required before coordinates reach OSRM. Results sort those candidates by estimated driving time, allow duration filtering, and expose individual route failures. Estimates exclude traffic; do not represent a global fastest-project search. Custom locations are not stored/shared.
- Budget sketch: equal instalment arithmetic using visitor inputs, no interest/fees or invented price data.
- `/contact`: local brief preparation/download and a direct project website link when selected. No fictitious mail delivery or sales team.
- `/data`: project/media/document sources, data limits, privacy and correction-file preparation. Reports are explicitly downloads, not submitted messages.

## Data maintenance
`/studio` is a public **draft editor**, not an administrative write API. It prepares catalogue update JSON. It cannot mutate the published repository or access credentials. No authentication is necessary because all published data is already public and export is local.

1. Check the current source, coordinates, status and actual verification date. Leave verification date empty if it was not checked.
2. Select a project, edit fields and Add to review draft. Export before closing (drafts are session-only).
3. The repository owner runs:
   ```sh
   node scripts/apply-catalogue-update.mjs /absolute/path/nile-estates-catalogue-update.json --check
   node scripts/apply-catalogue-update.mjs /absolute/path/nile-estates-catalogue-update.json --apply
   ```
4. Review the Git diff in `lib/catalogueUpdates.json`, run the production build and normal release process. The published catalogue uses validated overrides; revert the file to roll back.
5. To add a new project, add a bilingual `Project` record to `lib/data.ts` and native images with provenance to `lib/media.json`, then run `python3 scripts/make-responsive-images.py` and build. Do not fabricate developer verification or current stock/prices.

## Persistence and privacy
Local storage key: `nile-estates-shortlist-v1`. Stored data: project IDs only. Unavailable browser storage shows a warning and keeps a session fallback; export remains possible. Clearing browser data loses local choices. JSON and sharing links allow manual transfer. Anyone with a link can see those projects; it contains neither contact data nor custom coordinates.

Commute requests use POST and `Cache-Control: no-store`, public project IDs, bounded Egyptian coordinates, maximum six destinations and four concurrent batches per server instance. Two upstream calls run at a time with timeouts. Do not add raw request logging. Public OSRM is best-effort, not an SLA. For a high-traffic release configure a production routing provider and distributed rate limiting.

## External capabilities not misrepresented
This version has no cloud account sync, live inventory, operational inbox or public admin publishing. Those require owner-supplied services, credentials, ownership and operating decisions. No personal email, fabricated active project address or unowned mailbox is used for delivery. Original media/documents retain their source language and attribution.

## Verification
Run `node scripts/check-product-tools.mjs` for shortlist sanitization, catalogue update validation and route API rejection/success checks against a running local server (defaults to port 3001). Then `NEXT_BUILD_DIR=.next-product-final npm run build`. Browser verification covers save/reload, capped comparison, explicit shared import, filters, per-project source links and responsive planner layout.

### Selecting a personal place
Choose “Choose a place on the map / coordinates” in the daily-journey tool. The lazy-loaded satellite picker allows manual pan/zoom and click-to-pin, with coordinates also editable. No device geolocation permission is requested. Driving calculation remains separate and requires the routing consent checkbox. Map tile attribution stays visible.

## Production integration — 20 October 2026

Optional Supabase accounts support explicit cloud load/merge/save with version conflict protection. Guest storage stays available. Online enquiries and corrections can be stored server-side and notified through Resend after Turnstile verification when configured. Mail acceptance does not prove delivery. Sourced offers and approved records can be imported through protected APIs or a normalized feed. No vendor feed or service credentials are active yet. Local files remain available. See VERCEL-SETUP.md for activation requirements, access limits and deployment checks.

Gmail SMTP is now supported as the no-custom-domain email option, with TLS, a fixed authenticated sender/inbox, an additional 100-attempt daily notification budget and atomic one-time claims. Apply migration002 as well as001. Resend remains selectable. Supabase Auth SMTP is configured separately; Vercel email variables do not configure Supabase. No actual SMTP login or delivery has been verified.
