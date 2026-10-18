# Reference interaction audit — 17 October 2026

Reference: https://investments-map.prod.resimo.io/prestige-one/dubai/?lang=en&theme=light

Inspected directly in the browser at 1280 × 720 and compared with the narrow 662 × 764 application view.

## Corrected interpretations

The reference's six desktop toolbar icons are **Landmarks, Education, Health, Shopping, Roads, Metro**. The heart icon is not a favorites filter. Projects remain visible independently of those layers. Service layers use compact blue icons and name labels rather than opening a side list or flying to a service when clicked.

Desktop zoom controls are horizontal above All projects. When the project browser opens, zoom moves to the trailing screen edge and becomes vertical. On a narrow screen the zoom controls are vertical on the leading edge and the toolbar is under the ellipsis. Desktop projects occupy a centered carousel; narrow-screen projects form a vertical list.

The reference amenities arrow scrolls a horizontal preview, rather than collapsing the amenities section. Details opens a full-screen presentation. Gallery opens a full-screen viewer with an expandable thumbnail sidebar, and Back returns to the previous presentation or map. Theme selection closes settings. Share toggles a side column of share targets. Info toggles a compact data-source link.

## Validation performed

- Clicked the reference layer controls, including repeated presses, and inspected the road/metro overlays after loading.
- Clicked reference project, amenities arrow, Details, gallery category, Back, theme, Share (twice), menu and Info.
- Tested the local six layer toggles; service marker selection and repeated selection; gallery navigation, gallery group collapse, nested Back/Escape behavior; theme and sharing expansion/collapse.
- Compared desktop cards, carousel, details presentation and gallery with the reference. Compared the narrow toolbar and scrolling project browser in the native side panel.
- Validated local image files for every project. TypeScript and production build checks are run separately from the development output.

No third-party messages were sent. Egyptian imagery, provider data and the Nile Estates brand are localization differences; this is not a claim of pixel-identical artwork.

## Additional landmark and document audit

A reference landmark click selects a white circle, reveals its name above the icon, opens a glass description panel, and adds a landmark URL parameter. Clicking it again closes the panel. The Egyptian implementation follows this interaction with six local landmark illustrations and bilingual descriptions.

Roads now use styled vector road lines and labels, with raster fallback. Egyptian service categories retain independent blue toggles; when no matching verified point is currently visible, the camera reveals nearby known places.

The document viewer includes actual PDF page thumbnails, page navigation, zoom, direct PDF opening and download. Seven published brochures are local; the other sixteen primary documents are explicitly labeled independent project guides, with Arabic and English pages. All 23 projects also have supplemental guides. Local verification covers 486 document-page previews and 24 sourced logo assets. Native Arabic OIA brochure navigation, zoom and Escape were checked in the narrow panel, along with desktop landmark repeat selection and vector roads. Console checks showed no application warnings or errors during that pass.

## Project + place comparison — follow-up

Inspected the reference with `project=D_P14&landmark=landmark_6` in dark mode. The project stays open above a photo-backed landmark card. Both the landmark badge and the card show driving duration/distance; the map draws the road route. Clicking Details, then scrolling over the image outside the information sheet, moves the full information page while the background and Back/gallery tools remain fixed.

The Egyptian version now preserves project and destination together, uses six real local landmark photos, and draws OSRM driving geometry with matching distance/time badges. Selection changes replace the route; repeated place selection clears it without clearing the project. Local tests cover English/dark, Arabic/light, narrow-screen stacking, landmark repeat presses, an education destination and Details wheel scrolling outside the information sheet. Routing estimates exclude live traffic.

## Route styling and animated card connection

Re-inspected `project=D_P14&landmark=landmark_2` in light mode. The route is white with a centered white travel badge; dark mode uses a dark line and badge. The card connector uses 4px dots, an 8px gap and a repeating 1.5s linear translation by 12px. Its appearance fades in over 1.5s.

The local route now reveals geometry by cumulative road distance over 900ms, rather than by the number of coordinates. The travel label sits at the geographic halfway point and follows map movement. The card connector measures the actual card/pin positions, adjusts its dot count for the gap, mirrors with Arabic and reverses on the narrow stacked layout. Both effects honor reduced motion. The route animation checks cover uneven coordinate spacing and duplicate points.

## Final interaction pass

See `FINAL-REVIEW.md` for the detailed coverage and remaining content distinctions. This pass added photo swiping/zoom/panning, a draggable mobile sheet, local font hosting, reference cloud motion, modal focus fixes, outside menu dismissal, directional Arabic arrows and unobscured mobile info/download controls. The media review removed two inappropriate listing assets and added the current official Éclat imagery and 50-page brochure. Primary published brochure count is now eight; preview count is 534.
