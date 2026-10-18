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
