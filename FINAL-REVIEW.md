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
- Personal email removed from both contact components. Central proposed project address: info@nileestates.com. No mailbox ownership or activation is claimed; sending stays disabled, enquiry preparation/download remains available.
- Verified 75 originals and 148 responsive candidates; production build and TypeScript passed. Browser checked both updated homepage images and the contact page. Screenshot: tmp/mivida-clarity-final.png.
