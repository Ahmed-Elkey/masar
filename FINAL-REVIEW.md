# Final reference review — 17 October 2026

Reference: https://investments-map.prod.resimo.io/prestige-one/dubai/?lang=en&theme=light

The implementation keeps Egyptian projects, services, landmarks, geography and documents. The reference's Dubai project branding, photographs and private VR tours are content specific to that developer; local controls expose the Egyptian content that is actually available.

## Browser checks

| Area | Checked behavior |
| --- | --- |
| Settings | Open/close, outside press, Escape and focus return, dark/light switching, Arabic/English, preserved project/destination URLs |
| Sharing | Expand/collapse, actual WhatsApp icon, valid share targets, copy-link success; no third-party messages sent |
| Fullscreen | Enter and exit, with selected project and landmark preserved |
| Map tools | All six toggles, repeated presses, blue category markers, zoom in/out and show all |
| Services | Education 20, health 2, shopping 14 and transport 12 curated points; camera reveals known points when needed |
| Projects | All 23 cards are present in the project browser; tested opening the last card after scrolling, closing/reopening the browser and selecting from the map |
| Mobile sheet | Dragging changes height; handle click collapses/expands; keyboard controls are supported; place card and info control move with the sheet |
| Comparisons | Project plus place, real road geometry, theme-aware route and midpoint badge, repeated selection, animated dotted card connector |
| Details | Page scroll over the background, fixed Back/tools, nested gallery return and Escape without losing project selection |
| Photographs | Vertical gallery swipe, horizontal hero swipe, thumbnail selection, arrow controls, double-click zoom, panning and keyboard alternatives |
| Documents | Published brochure versus independent guide label, thumbnails, first/last pages, navigation, zoom and PDF links; mobile download remains visible |
| Layout | Desktop, native narrow panel and 390 × 844 mobile; Arabic and English; light and dark; temporary viewport override reset |

## Corrections from this pass

- Added the reference's four cloud assets and slow 100-second movement, with reduced-motion support and no input interception.
- Served Inter and Noto Sans Arabic locally with source metadata and OFL licenses; builds no longer require Google Fonts access.
- Added photo gestures, zoom/pan and resizable mobile project sheets.
- Preserved modal focus while changing gallery sections; nested Back/Escape correctly restores the map's interaction state.
- Made small-screen brochure downloads remain visible, corrected directional arrows for Arabic and replaced the WhatsApp text placeholder with an icon.
- Closed transient menus on outside presses and kept the map info control above the mobile project sheet.
- Inspected all 72 original gallery images. Removed a photograph explicitly watermarked IL BOSCO City / New Cairo from the New Capital gallery, and replaced the Éclat listing-logo placeholder with three images from the developer's current official page.
- Corrected Éclat's Arabic spelling and description/address from its official brochure. Integrated its original 50-page PDF and refreshed its independent bilingual guide.

## Validation and content scope

The curated manifest now has 23 galleries with 73 images, 23 bilingual guides, eight published brochures, 534 document preview pages and 24 sourced logo assets. Six landmark photo credits, 12 local font assets/licenses and four cloud assets are validated. TypeScript, the production build and routing/animation checks are run after implementation changes.

Routing tests check two different Egyptian road routes, endpoint proximity, invalid-ID rejection, distance-based animation progress and duplicate coordinates. Browser checks use representative projects with single/multiple images and original/independent documents; file checks cover the entire manifest.

The service dataset is curated rather than exhaustive, approximate project positions retain their disclosure, and driving times exclude live traffic. Map/rail/routing providers remain network dependencies. Official PDF brochures exist for eight projects; other projects expose clearly labeled independent guides. Project-specific logo and VR content is shown only where available.

## Final verification — 18 October 2026

Media/source validation, TypeScript and the production build passed. After restarting the local development server, both Egyptian route requests and the geometry/animation assertions passed again. The mobile sheet's collapse/re-expand behavior was verified before the browser session ended. A final fresh browser observation/screenshot could not be completed because the browser URL security policy denied acquiring the existing tab; no browser workaround was attempted. Earlier browser observations above remain the visual verification record.

## Browser verification completed — 18 October 2026

The remaining fresh browser pass is now complete. Inventory showed that the old tab was an internal `data:` connection-error page, while the restarted HTTP server returned 200. A normal HTTP tab opened successfully without changing browser security settings. Verified the loaded Egyptian imagery, project and photo-backed landmark cards, driving route, distance/time badge and animated dotted connector. The console contained no warning/error entries in this fresh tab.

Scrolled Details over its background (255.5px scroll with 976px content in a 720px viewport). At 390×844, collapsed the project sheet to 180px and expanded it to 506.4px; the landmark card followed with a 10px gap in both states and there was no horizontal overflow. Reloaded the mobile page and toggled dark/light while preserving both selected IDs. Reset the viewport and confirmed all map imagery loaded at the native desktop size. Saved `preview-egypt-reviewed.png` and `preview-egypt-mobile-reviewed.png`. No additional implementation defects were found in this final pass.

## Service images, project identities and hover cards — 18 October 2026

- Added a local attributed image background for every service point: education 20, health 2, shopping 14, transport 12. Twelve use sourced campus/hospital/mall/airport photographs; the other 36 use location-specific aerial imagery with an explicit aerial-view label. All 48 images were decoded and inspected as a contact sheet; individual image/source mappings are in `lib/poiMedia.json`.
- Expanded visual identity coverage to all 23 projects: 11 project marks and 12 developer-logo-plus-project-name identities. Extracted City Gate, OIA, Blanca and Éclat marks faithfully from their published brochure pages; added official Jade Park, Ivoire, Fouka Bay, Il Bosco and Vinci marks. Rejected the Scenario render as a logo and a GUC ceremony photograph as a campus facade. Source/crop metadata is retained, including original brochure page numbers.
- Inspected reference hover behavior without selecting a project: fixed 333×192 image card, top status, bottom name/area, fade and marker highlighting. Implemented the same composition for projects, landmarks and services with Arabic mirroring. Actual mouse-over showed Jade Park's preview while keeping the OIA/Citadel URL unchanged. Found and fixed Escape dismissing the selected place along with the preview; verified Escape now dismisses only the preview and preserves both IDs.
- Browser checks opened a hospital photo, university photo, mall photo, airport photo and metro aerial card; each image loaded. Verified keyboard preview and dismissal, image credit readability, long project names, 390×844 layout without horizontal overflow and English/Arabic light/dark states. Temporary viewport overrides are reset after review.
- Asset validation now requires photo coverage/provenance for every POI and an identity for every project, in addition to the existing whole-manifest checks.

The final production build and extended asset validation passed. A fresh local page had no new console warnings/errors and no unloaded project-identity/place images. A final actual pointer preview of Jade Park with OIA + Cairo Festival City Mall selected preserved the complete URL when dismissed with Escape. Saved `preview-egypt-services-hover.png` and `preview-egypt-service-mobile.png`; the viewport override was reset and the local result tab retained.

## Nile Estates website — 19 October 2026

Implemented the approved multi-page website using ERA Residence as the visual reference: wine/cream/blue palette, locally served display/script typography, original botanical seal, film hero, introductory curtain, arched sections, text/image reveals, parallax, destination switching, horizontal desktop collection, mobile swipe collection, lifestyle selection and page transitions. The reference's proprietary fonts and source code are not bundled; Bodoni Moda and Pinyon Script are open-font alternatives. The reference's single-development content and proprietary property imagery are replaced with the existing Egyptian project dataset. This is a reconstruction and adaptation, not a pixel-identical import.

Added the collection, all 23 project pages, About and enquiry pages. Moved the original map to `/map`; legacy query-based map links redirect while retaining parameters. Restyled its controls/cards/loading identity and connected map Details to the new project pages. Project enquiries preselect the project and destination and prepare a mailto message to the user-supplied address. The form previews the message; it does not pretend that an enquiry was sent or provide a backend inbox.

Verification completed:
- Production build and TypeScript passed; existing comprehensive media/provenance validation passed.
- 31 representative and project page requests returned 200. Legacy map links returned the expected 307 redirect and an unknown project returned 404.
- Existing road-route checks passed for two different Egyptian destinations, endpoints, distances/durations and invalid inputs; route animation geometry checks passed.
- Browser checks covered story selection, menu navigation, destination + name filtering, project opening, gallery arrow keys and Escape/focus restoration, selected-project map opening, map return navigation, Arabic RTL, 390px width and a prepared enquiry without sending it.
- Corrected collection heading overflow and overlapping map controls, and checked desktop horizontal movement. A fresh production browser tab reported no warning/error console entries.

Local production preview: `NEXT_BUILD_DIR=.next-verify npm run start -- --hostname 127.0.0.1 --port 3001`. The previous server on port 3000 predates this website and was left untouched. The temporary development server was stopped. Review screenshot: `tmp/nile-estates-home.jpg` (ignored).

### Refresh aperture refinement — 19 October 2026

Re-inspected ERA's refresh animation as a sequence of browser frames. Replaced the session-only cover with a 3.35s SVG aperture over the actual video: a wine screen and clipped-corner outline, an arched opening rising from below, two fine contours, then expansion beyond the viewport. The title enters letter by letter and the script word reveals in sequence. The scene is continuous through the aperture; there is no separate preview photograph or upward curtain. Refreshing now replays the sequence every time. Body scroll locks during the entrance and restores afterwards; reduced-motion skips it.

Captured and reviewed desktop and 390px animation frames, verified a second reload starts the aperture again, and confirmed the overlay is removed, the heading stays accessible and body scroll is restored at completion. Homepage main-container entrance transforms are disabled so the fixed aperture stays relative to the viewport.

### Day/night control layout — 19 October 2026

Moved the appearance controls from the motto row into their own row below the script wordmark, increased label size/contrast and touch height, and added an active underline. Prevented the animated ESTATES letters from wrapping, capped the title size by viewport height, and separated narrow-screen motto text from the controls. Checked the 662px browser pane and 390px mobile layout and exercised both day/night states. The production build passed. Current local preview uses `NEXT_BUILD_DIR=.next-day-night-final npm run start -- --hostname 127.0.0.1 --port 3001`.

### Scroll-linked blue introduction
- Pinned the opening film while a blue circular panel rises and expands with scrolling, then joins the blue story section. Reverse scrolling reverses the transition.
- Removed pale transition gaps, extended destination imagery to the viewport edges, and moved parallax onto the oversized image inside its frame.
- Verified desktop and 390px mobile rise, continuous blue join, visible day/night controls, and no horizontal overflow. Production build/type checks passed. Reduced-motion visitors skip pinning and the disc.

### Blue section editorial layout
- Compared ERA in browser: narrow central image beneath an oversized heading, pagination before description, small uppercase caption, then full-width image with an overlaid statement.
- Rebuilt the corresponding Nile section with local project imagery, three animated stories, smaller spaced lettering on the rising disc and an editorial image silhouette.
- Verified next-story interaction, 390px layout and zero horizontal overflow; production build passed. The image silhouette adapts our existing photo rather than reproducing ERA’s building cutout asset.

### Automatic blue stories
- Added a six-second visible-section timer and continuously filling timeline; title, image and description animate together, with subtle camera scaling on each image.
- Manual arrows/segments restart the timer; pause/resume is available. Time freezes outside the section or in a hidden tab; reduced-motion visitors retain manual navigation.
- Production build/type checking passed. Browser verification observed Mivida → Fouka Bay → Il Bosco without clicking, with progress advancing and no console errors.

### Story exit and entry choreography
- Retain outgoing content during a 650ms exit before replacing it; stagger individual English letters (whole Arabic words to preserve shaping), then reveal the next image with a bottom-to-top mask and inner image movement. Description exits and enters with the sequence.
- Preload all three responsive story photographs so decoding does not cause a sudden late appearance. Prevent overlapping transitions and defer the next timer until entry completes.
- Verified outgoing content remains during exit, following story settles, all preload images complete, and manual next/pause/resume work in production. Build and type checks passed; no browser console errors.

### Lower homepage sequence
- Studied ERA lower sections in browser: concept, overlapping destination typography and portrait photograph, line-map illustration, draggable destination scene, blue property carousel, amenities image/options, curved cream lifestyle section, editorial image sequence, expanding architecture photo, information grid, full-screen finale and footer.
- Rebuilt their corresponding Nile sequence in LowerHome.tsx with local project data, working destination filters, map/project links, pointer and keyboard panorama controls, project carousel with staged exit/entry and optional autoplay, amenities selection, photo pagination, word reveals, circular link accents, sticky image expansion and finale scale. Retained the branded site footer/navigation.
- Existing project photos replace ERA imagery. Corner foliage is an original vector adaptation; the panorama pans a local photograph and is not a 3D render.
- Verified destination change and corresponding image/link, project next and automatic advance, amenities selection, next photograph, image expansion progress, Arabic 390px layout and no horizontal overflow. All observed images loaded without errors. Production build/type checks and git diff whitespace check passed.

### Restored reference horizontal location sequence
- Inspected ERA loc-scroll-area_track: concept, destination portrait/typography and line-map panels translate horizontally while their screen is pinned. Replaced the vertical stacking of their Nile equivalents with the same scroll-driven structure.
- Added HorizontalSequence with measured track travel, sticky screen, reversible scroll progress and resize/reduced-motion handling. Desktop panel widths follow the reference proportions; mobile has responsive horizontal panels.
- Browser verified pinned movement (-626px then further across), reverse movement, mobile 390px and zero page horizontal overflow. Production build and whitespace checks passed.

### Blue-story smoothness review
- Keep all three responsive image elements mounted and decoded; switch visibility inside the animated mask instead of remounting the picture at every transition.
- Extended outgoing choreography to 850ms so staggered letters finish before content replacement. Reserved title height, released idle letter compositor hints, switched progress updates directly to transform and stopped the timer frame loop when paused/outside the section.
- Pause the hero video when its actual hero section is offscreen, preserving the manual playback preference. Observing the overscanned video itself initially kept it playing at the boundary; corrected observation to the hero with a 1% visibility threshold.
- Production build/type checks passed; browser confirmed all three pictures loaded and automatic transitions progressing. This review does not constitute an FPS benchmark on the user’s Chrome hardware.

### Reference contact page
- Inspected ERA /contact: blue field, oversized title, three information columns, illustrated map with marker/circular CTA, scenic ending and shared footer. Applied corresponding layout to /contact with the supplied email, Egyptian destination atlas and local Fouka Bay imagery. No invented office address, phone or social profiles.
- Kept the existing enquiry preparation/mailto/download workflow inside a disclosure, opened by enquiry CTAs and initially open for project-specific enquiries.
- Fixed local reveal observation by observing unclipped parent containers so masked content can animate in reliably.
- Production build/types and whitespace checks passed. Browser tested opening the form and generating a Mivida enquiry preview without sending an email; Arabic/mobile reviewed.

### Project-wide image clarity
See IMAGE-QUALITY-REVIEW.md. Fixed responsive candidate selection and portrait width descriptors globally; retained native originals, regenerated high-quality variants, upgraded 14 project and 45 place photographs, and validated all page routes.

## Mivida full-width clarity and project contact address
- Two homepage photographs now use official Emaar Mivida assets at native 1800/2000px, with reduced panorama enlargement.
- Personal email removed from both contact components. Central proposed project address: info@nileestates.com. No mailbox ownership or activation is claimed. While `PROJECT_EMAIL_ENABLED` is false the address is not shown anywhere on the site: the contact page, the contact layout and the guide FAQ say plainly that nothing typed is uploaded and the brief is a file you keep. Sending stays disabled, enquiry preparation/download remains available.
- Verified 75 originals and 148 responsive candidates; production build and TypeScript passed. Browser checked both updated homepage images and the contact page. Screenshot: tmp/mivida-clarity-final.png.

## Expanded About Us guide
Added a bilingual four-step walkthrough, all eight project destinations with live counts and filtered collection links, section navigation, and ten expandable FAQs covering directory purpose, developer ownership, purchasing scope, prices, map services, journey estimates, documents, imagery, enquiry preparation and languages. Content describes existing features. Production build/type checks passed. Browser verified Arabic and English content, FAQ expansion, and 390px layout without horizontal overflow. Screenshot: tmp/about-expanded-final.png. Local production uses .next-about-expanded-final on port 3001.

## Complete interface language selection
Localized the circular Nile Estates seal and animated homepage wordmark, all 18 developer names in collection/detail/map cards, developer search options, language switch labels, enquiry destination exports, document notes and the language-aware 404 page. Arabic project wordmarks use localized text instead of English logo artwork. Arabic hero words animate intact for connected shaping; adjusted title size to clear the day/night controls. Road label expressions follow the selected language (omit untranslated road labels rather than fall back to another language). Original credited third-party imagery/documents and source attribution remain intact.
Validation: production build/types passed. Scanned rendered text on homepage, about, contact, collection and all 23 project pages in both languages: zero opposite-language text matches. Browser checked Arabic homepage, seal and Mivida map card. Screenshot tmp/arabic-brand-final.png. Production .next-language-delivery on port 3001.

## About photo scroll portal
Replaced the static arched About image with AboutPortal: sticky viewport stage, scroll-linked arch-to-full-frame opening, 3.5% image approach, then normal content flow. Updates use one requested animation frame and a CSS progress variable; scroll listener is passive. Reduced motion renders a normal static full-width image. Shared Arabic/English component with responsive travel. Production build/type checks passed. Browser observed progress 0.059 with 47% corners, then 1 with 0% corners, and verified subsequent introduction scrolls into view. Screenshot tmp/about-portal-expanded.png. Production .next-about-portal on port3001.

## Product decision tools — 20 October 2026
Implemented a connected research journey with no mandatory login:
- Persistent browser shortlist, three-project comparison, explicit shared-list import, clipboard sharing, JSON import/export and print layout. Save/compare actions available in collection, project detail and map project card; new planner navigation. Developer/status filters persist in URLs; corrected Arabic developer option values.
- Planner daily journeys: curated landmarks/services or manual satellite map pin/coordinates, six geodesic nearest candidates, explicit external-routing consent, driving estimates sorted by time, duration filters, cancellation and per-project errors. Custom positions are neither saved nor shared. No device geolocation requested.
- Hypothetical budget arithmetic (no invented listing prices or financing assumptions).
- Per-project source transparency, edition versus actual review date, source/image links, accuracy notes and correction-file preparation. Correction downloads explicitly report submitted=false.
- Catalogue draft workspace with import/export, shared validator, repository-owner check/apply CLI, and validated published overrides. No public write API. Documentation in PRODUCT-GUIDE.md.
- Contact brief download now links selected project source; listing sources are labelled as sources, not falsely as direct developer contacts. No active unowned email or fake submission.
Validation: production build/types passed; npm run test:product passed shortlist sanitization/cap, quota failure session fallback, recovery, malformed updates/URLs/dates/IDs, API size/coordinate validation, bilingual feature routes and live OSRM response. Browser verified save/reload, comparison cap, shared import, choice export/reimport, update export accepted by CLI --check, correction submitted=false, budget arithmetic, map click coordinates, six live driving results and a 30-minute filter. At 390px, document width=390px, table viewport343px containing641px table; no page overflow. Arabic planner console error log empty. Existing75 images/148 variants validated; git diff --check clean.
Screenshot: tmp/product-planner-final.png. Production server uses .next-product-delivery, port3001. External operational services (cloud sync, live inventory, email/report inbox) are not presented as activated features.

## Vercel service integration — 20 October 2026
Added Supabase SSR magic-link accounts and owner-isolated shortlist load/merge/save with optimistic versions; protected SQL migration tested against local PostgreSQL WASM. Added server-side enquiry/correction storage, Turnstile hostname verification, same-origin checks, persistent hashed-IP/global quotas, fixed private recipient, Resend idempotency, and honest accepted/stored responses. No real email sent. Real owner inbox stays in ignored local server config only; no personal email in app/components/lib/public.
Added protected price/project imports, allowlisted source validation, checked/expiry timestamps, current-offer UI, catalogue context across pages/map, server metadata/routing coordinates, and atomic normalized feed sync endpoint. No live vendor feed is connected. Existing project IDs only; media remains curated. Setup contract and activation blockers documented in VERCEL-SETUP.md and .env.example; no cron enabled before a feed exists.
Upgraded Next to16.4.2, React19.3.1, MapLibre6.15.0, Node24; migrated async request props, SSR cookies/proxy, ESM map imports and ref typing. Production build and TypeScript pass. Local SQL tests pass owner isolation, unauthorized reads/writes, optimistic conflicts, quotas, feed rollback and expired-offer RLS. Mock mail tests pass validation, fixed recipient/reply-to/idempotency/provider failures. HTTP checks pass disconnected states, unknown-price rejection, same-origin enforcement, protected feed and confined callback redirect. Product tests pass including live public OSRM estimate. Production dependency audit reports0 known vulnerabilities. Browser verified Arabic account disconnected state and functional MapLibre map. Screenshot tmp/account-services-review.png. Final production build .next runs locally on3001.
External activation remains unverified and unavailable without owner Supabase/Resend/Turnstile setup plus permitted source API access; local tests do not prove real email delivery or a working upstream feed.

## Shared arrows and dropdowns — 20 October 2026
Unified all site selects (planner, collection filters, contact, sources/corrections and maintenance): consistent logical padding, centered inset chevron, keyboard focus treatment, matching native customizable picker with checked/hover states, bounded scroll and native keyboard/form behavior. Browsers without base-select retain native pickers and the same closed-field arrow spacing. Replaced typographic pager chevrons with fixed-size SVGs in home stories, lower-home and project galleries/lightbox; normalized pager hit areas, gallery LTR order and disclosure indicators. Mobile collection now shows every filter in a two-column layout instead of hiding status.
Validation: production build and TypeScript passed. Browser checked Arabic planner popup, successful search-scope selection, English collection picker, and Arabic collection at390px (document width390; no overflow). Screenshots tmp/dropdown-ar-desktop.png and tmp/dropdown-ar-mobile.png. Production preview3001.

## Gmail without a custom domain — 20 October 2026
Added Nodemailer Gmail SMTP option (MAIL_PROVIDER=gmail; GMAIL_USER/GMAIL_APP_PASSWORD), fixed TLS host/port465, authenticated sender, fixed private recipient, visitor reply-to, bounded connection timeouts, disabled file/URL content access and SMTP debug logging. Resend remains explicitly selectable. Service readiness no longer requires Resend credentials for Gmail. Added 100 notification attempts/day budget alongside existing hourly quotas. Migration002 atomically claims one SMTP attempt per message to prevent concurrent/ambiguous retries from duplicating email; uncertain notifications remain stored for manual owner review. Updated response copy and privacy provider names. Gmail/Supabase/Vercel owner setup documented in GMAIL-SETUP.md and VERCEL-SETUP.md.
Validation: test:services passed SQL claim-once semantics plus existing RLS/version/quota/feed tests; Gmail transport mocked to verify TLS, sender, inbox, reply-to, whitespace-normalized app password, rejection/failure cleanup and invalid settings. Build/TypeScript passed; npm install audited0 known vulnerabilities. No real Gmail login, external email, Supabase configuration or Vercel deployment performed; owner secrets and production delivery test remain necessary.

## Local Gmail authentication — 21 October 2026
At the owner's explicit request, configured Gmail provider/user/app password in ignored .env.local (owner-only permissions), and generated the private rate-limit salt. SMTP verify against smtp.gmail.com:465 succeeded with TLS and authentication. No email was sent. This confirms local SMTP authentication only, not production delivery. Supabase connection/service credentials and Turnstile site/secret keys are still absent; the public enquiry endpoint remains correctly unavailable pending those services. No secret values are recorded in this report.

## Supabase live setup — 21 October 2026
User approved schema permissions, local key binding and Gmail SMTP configuration. Applied both SQL migrations together in a transaction to the new Nile Estates project; dashboard reported Success. Initial automatic review rejected execution because the AX editor exposed only the tail. Replaced the query from reviewed local sources and showed BEGIN/schema at the top; review allowed execution after verification. No policy bypass or indirect execution used.
Stored existing publishable/server keys and project URL in ignored .env.local only. Live SDK checks succeeded for public current-offer reads and server inbox access; public inbox reads were denied. Configured custom Gmail SMTP (465, Nile Estates sender, stored password concealed), local Site URL and two exact ar/en callback URLs. No email sent and no authenticated end-to-end sign-in proven yet.
Rebuilt production successfully. Live local checks: account service configured, anonymous shortlist401, catalogue and prices connected=true, enquiries still disabled pending Turnstile. Server secret absent from .next/static browser JS/JSON. No vendor offers imported. Production preview on3001. Screenshots tmp/supabase-schema-applied.png and tmp/supabase-auth-configured.png. Opened Cloudflare signup in a new Chrome tab; account creation/CAPTCHA/terms handed to owner. Vercel production configuration and final domain URLs still pending deployment.

## Real Turnstile and enquiry delivery test — 21 October 2026
Created owner-approved Managed Turnstile widget Nile Estates - Local, restricted to127.0.0.1, with pre-clearance off. Stored site/secret keys only in ignored local environment. Production widget/hostname is intentionally separate and still pending Vercel URL.
Built and ran with real Supabase/Gmail/Turnstile. Prepared one clearly labelled Arabic test enquiry in Chrome contact form. Human verification was completed by the user; no automated CAPTCHA action or verification bypass used. Sent exactly one owner-approved enquiry. UI confirmed saved/accepted. Live DB row7210cb5e-78f8-4e7a-bb60-caccefde0d6e reports accepted with provider ID and notification claim. This proves application-to-Turnstile-to-storage-to-SMTP acceptance; final Gmail Inbox/Spam receipt has not been inspected. No additional login/test email sent.
Corrected legacy contact copy that said nothing could be sent, and adjusted widget sizing for narrow screens (compact below420px, flexible otherwise). Screenshot tmp/enquiry-live-accepted.png. Owner's secrets remain excluded from Git; Vercel environment transfer, production host allowlist and production callback URLs remain pending deployment. Vendor price feed and authenticated account-sync end-to-end test remain unverified.

## نشر الإنتاج — 2026-10-21

الرابط: https://nile-estates.vercel.app — Vercel deployment `dpl_Hsf6fftr7frYJ3Smyf6vn1SX7VPJ` بحالة READY. بناء Vercel نجح، وفحص HTTP العام نجح للرئيسية باللغتين، عنّا، المشاريع وتفاصيل ميفيدا، التواصل، الخريطة، الحساب، المخطط، البروشور وصفحته المصورة والفيديو. `/api/services` يؤكد تهيئة الحسابات والاستفسارات والحماية؛ `/api/account/shortlist` يعيد 401 للزائر غير المسجل. قاعدة الأسعار متصلة وتعيد صفر عروض حاليًا، لعدم وجود مصدر متصل. لا يمثل فحص الإعدادات إثباتًا لاكتمال دورة تسجيل الدخول أو إرسال استفسار من الإنتاج؛ اختبار وصول الاستفسار السابق كان محليًا وأكده المالك.

قالب إشعار المالك الجديد راجعت معاينته العربية، واختبارات القالب والتنظيف والنص البديل نجحت مع `test:services`؛ فحص TypeScript والبناء المحلي نجحا. لم تُرسل رسالة تجريبية إضافية من الإنتاج أثناء المعاينة.

### اختبار الدورة الفعلية على الإنتاج — 21 أكتوبر 2026

- طُلب رابط الدخول من صفحة الحساب على `nile-estates.vercel.app`، ووصل تأكيد البريد إلى Gmail. فتح المستخدم الرابط واكتملت جلسة الدخول في الموقع؛ ظهرت أدوات الحساب.
- نجح دمج الاختيارات المحلية مع الحساب. سجل Vercel طلبَي GET وPUT لمسار `/api/account/shortlist` بحالة 200. نجح تحميل الاختيارات من الحساب في تبويب ثانٍ كذلك. هذا اختبار حساب واحد وتبويبين، وليس اختبار عزل حسابين مستقلين.
- أُرسل استفسار تقني معلّم صراحة بأنه تجربة وليس طلب شراء من نموذج الإنتاج، بعد نجاح Turnstile. رقم الطلب `541f32f5-3f4b-4369-8370-d73a1ba9c9a8`، وحالته في Supabase `accepted`، مع حجز إخطار ومعرف من مزود البريد.
- فُتح نفس الاستفسار في Gmail، وتطابق رقم المتابعة والمحتوى ورابط ميفيدا على الإنتاج. قالب HTML الجديد ظاهر داخل Gmail. لا تعتمد هذه النتيجة على قبول SMTP وحده: شوهدت الرسالة الفعلية في الصندوق.

### هوية رسائل تأكيد الحساب والدخول — 21 أكتوبر 2026

طُبّقت قوالب HTML وعناوين مخصصة لرسالتَي Confirm sign up وMagic link or OTP في Supabase. القوالب محفوظة في `supabase/templates/` مع مولّد `scripts/build-auth-emails.mjs`، وتعرض اللغة بحسب RedirectTo المعتمد. استُبقي متغير ConfirmationURL الأصلي، مع اتجاه ومحاذاة صريحين داخل الجداول والخلايا للتوافق مع Gmail. راجعت معاينة تأكيد الحساب العربية. طُلب رابط دخول عربي جديد من الإنتاج، ووصل فعليًا بعنوان «رابط الدخول لحسابك — نايل إستيتس» وبالهوية الجديدة، وراجعت ظهوره داخل Gmail. فتح زر الدخول أعاد إلى صفحة الحساب وأكمل الجلسة بنجاح. التعديل إعداد لقوالب Supabase ولا يحتاج إعادة نشر تطبيق Vercel.

### إزالة تصحيح المعلومات — 21 أكتوبر 2026

أُزيل نموذج التصحيحات وتنزيل ملفه وإرساله، وكل تسمياته وروابطه في التذييل وصفحة المصادر وتفاصيل المشروع، بالعربية والإنجليزية. صفحة `/data` تحتفظ بالمصادر والخصوصية. استقبال الرسائل يقبل `enquiry` فقط ويمنع نوع `correction` القديم؛ لا حذف لأي رسائل تاريخية. بقيت تفاصيل المشاريع والمطورين والمواقع والمصادر. نجحت فحوص TypeScript وبناء الإنتاج واختبارات الخدمات، بما فيها رفض طلب التصحيح القديم. فحص HTTP المحلي أكد غياب الميزة باللغتين وبقاء صفحة ميفيدا. أُعيد تشغيل النسخة المحلية على المنفذ 3001.

### صفحة تحديثات المشاريع — 21 أكتوبر 2026

نُشرت `/updates` مع الفلاتر (نوع التحديث، المشروع، آخر 7/30 يومًا)، التوقيت الصريح للقاهرة، السعر السابق والجديد ونوع الوحدة، روابط المشروع والمصدر، وتمييز العرض التاريخي عن الحالي. أُضيفت روابطها للقائمة والتذييل وتفاصيل المشروع وخريطة الموقع. API عام للقراءة فقط مع فحص المدخلات وتصفح على دفعات من 50 حدثًا.

طُبّق الترحيل 003 على Supabase بنجاح: سجل محمي من كتابة الزوار، ومحفزات تسجل الإضافة والتغيير والسحب ضمن معاملة البيانات الأصلية. لا seed ولا أسعار تجريبية بالإنتاج ولا تاريخ سابق مصطنع. نجحت اختبارات PGlite للإضافة وتغيّر السعر والقيمة السابقة والحالية، منع تكرار أحداث فحص الصلاحية فقط، التراجع الذري، وصلاحيات القراءة والكتابة. نجح TypeScript والبناء واختبارات الخدمات. فحص الإنتاج يعيد 200 للصفحة باللغتين وللفلاتر، و400 للمؤشر غير الصحيح؛ السجل الحالي فارغ ومتصل بقاعدة البيانات.

ربط Untera غير مفعّل: فحص نقاط المصادر والبحث عن مصر انتهى بمهلة اتصال، وكذلك تعذر الوصول للبوابة عبر متصفح الاختبار. الصفحة العامة للمصادر تذكر بيانات عقارماب مصر جُمعت منذ ثلاثة أشهر. لا مفتاح API جديد ولا cron ولا أسعار خارجية مستوردة. جرى رفض محاولة فحص كانت ستسمح نظريًا بإرسال مفتاح بيئي من المراجعة التلقائية؛ استُبدلت بفحص عام لا يقرأ أي مفاتيح أو يرسلها، ونُفّذ بأمان. هذا ليس ربطًا مكتملًا للمصدر الخارجي.

النشر: `dpl_7dvfhoCuZyVabybmWTgN1y6ak9sY` بحالة READY. النسخة المحلية المبنية شُغلت على المنفذ 3001. اختبار عرض 390px على الإنتاج أكد عدم وجود تجاوز أفقي.

نشر ضبط المسافات النهائي: `dpl_6XFc7JBtDRUHN3bHwKEDgeRJCvyr` بحالة READY. أُعيد فتح صفحة الإنتاج العربية وحفظ معاينتها في `tmp/updates-page-ar-preview.png`. تم اختبار تبديل اللغة، وفلاتر الأسعار وميفيدا وآخر 7 أيام، وحالة السجل الفارغ الحقيقية؛ لا أحداث تجريبية أضيفت للإنتاج.
