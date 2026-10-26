# Nile Estates

A bilingual residential discovery website with an ERA Residence-inspired editorial design and an integrated Egyptian investment map.

## Website routes

- `/`: film-led homepage, circular introduction, destination selector, animated project carousel and lifestyle imagery.
- `/projects`: all 23 projects with search, area/developer/status filters and grid/list views.
- `/projects/[slug]`: individual project presentation, full-screen photo gallery, amenities, documents, map and enquiry links.
- `/map`: the existing interactive map, with matching brand, controls, cards and a return to the website. Legacy `/?project=...` links redirect here while retaining all parameters.
- `/about`: independent directory context and source disclosures.
- `/contact`: an enquiry preview that opens the visitor’s email app addressed to `ahmed.mahmoud.elkey@gmail.com`. It does not send automatically or collect submissions on a backend.

The public website uses `app/estate.css`, the map’s brand overrides are in `app/estate-map.css`, and shared components are in `components/estate/`. Brand artwork is original SVG. Bodoni Moda and Pinyon Script are locally served OFL alternatives to the reference’s proprietary fonts; their licenses and source URLs are in `public/fonts/estate-*`. The implementation recreates the reference’s visual language rather than importing its source, commercial fonts or project media.

Animation includes the refresh-triggered arch aperture opening, rotating seal, film controls, text/image reveals, scroll-driven image expansion, draggable destination panorama, animated project carousel, hover transitions and a page-change curtain. Reduced-motion preferences disable decorative movement and retain manual carousel controls. Arabic preserves RTL and readable typography.

## Run and check

```sh
npm install
npm run dev -- --hostname 127.0.0.1
npm run lint
node scripts/validate-media.mjs
npm run build
npm run start
```

Open http://127.0.0.1:3000 for the website or `/map` for the map. `lang=en|ar`, `theme=light|dark`, `project=<id>`, `landmark=<id>` and `poi=<id>` preserve language, theme and the selected project and destination when reloading or sharing. Arabic mirrors the interface and camera offset. `/video-preview` is an unlisted page: reachable by direct URL, disallowed in `robots.txt` and marked `noindex`.

For a production check while the development server is running, use `NEXT_BUILD_DIR=.next-verify npm run build`. This avoids changing the development server's generated files.

Before deploying, copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SITE_URL` to the real origin. Metadata, Open Graph, `robots.txt` and `sitemap.xml` all build absolute URLs from it and otherwise emit `http://localhost:3000`.

## Interactions

| Control | Behavior | Press again |
| --- | --- | --- |
| Menu | Opens glass settings panel | Closes settings and sharing |
| Theme / language | Updates appearance / direction and URL, closes menu | Choosing the opposite option restores the previous setting |
| Share | Reveals WhatsApp, email and copy-link controls | Hides sharing controls |
| Fullscreen | Uses the browser fullscreen API | Exits fullscreen; unsupported browsers show a message |
| Landmarks | Shows circular Cairo landmark icons; click one for a name and glass description panel | Removes the layer; clicking the selected landmark closes its panel |
| Education / Health / Shopping | Shows blue service markers; clicking a marker reveals its name | Removes the layer; clicking a selected marker clears its selection |
| Roads | Adds styled OpenFreeMap road lines and labels over dimmed satellite imagery, with Esri raster fallback | Removes overlay and restores satellite brightness |
| Transport | Adds OpenRailwayMap tracks and transport markers | Removes overlay and markers |
| Show all | Clears selection and fits all Egyptian project locations in a top-down view | Refits the same bounds |
| All projects | Opens one horizontal carousel on desktop, a scrolling column below 900px | Closes the browser |
| Project | Flies to the site, displays distance rings and a detail card | Keeps the selected project; Close clears the selection |
| Amenities arrow | Moves the horizontal amenities strip | Wraps back at the end |
| Details | Opens a full-screen project presentation | Back restores the map/card |
| Gallery | Opens a thumbnail sidebar and image viewer | Back restores the previous view |
| Photos group | Expands/collapses gallery thumbnails | Reverses expansion |
| Site view | Displays site satellite imagery | Returns to photos |
| Info | Shows basemap source | Hides source |

Escape closes one visible level at a time. Gallery arrow keys navigate photos or document pages. Modal focus is contained inside the dialog, with the underlying map inert. Reduced-motion preferences are honored for project flights and CSS animations.

## Content and imagery

- `lib/data.ts`: 23 Egyptian projects, bilingual descriptions, amenities and location data.
- `lib/poi.ts`: education, shopping, transport and health locations. The two healthcare locations were read from the hospitals' official embedded maps.
- `lib/media.json`: local photos, developer/project logos, PDF documents, all-page previews and their provenance.
- `public/projects/`: project images downloaded from each project's own listing page, with byte-identical duplicates removed.
- `scripts/make-responsive-images.py`: writes AVIF widths per source into `lib/imageVariants.json`; `components/ProjectImage.tsx` serves them as `srcset`, so the generated `-<width>.avif` files are committed alongside the webp masters.
- `scripts/fetch-project-media.py` then `scripts/download-project-media.py`: optional manual media refresh. Source pages are data, never executable code.
- `node scripts/validate-media.mjs`: verifies galleries, PDF signatures, all-page JPEG previews, logos and provenance.
- `public/brochures/`: eight published Egyptian brochures, plus clearly labeled independent bilingual guides for all 23 developments; projects without a published brochure show their guide instead.
- `scripts/brochure-candidates.json`: original PDF sources. `scripts/create-project-guides.py` and `scripts/render-brochures.py` build guides and document previews. The guide script needs ReportLab, Pillow, arabic-reshaper and python-bidi; the page renderer needs `pdftoppm` from poppler. Neither binary is installed on this machine, so both scripts are documented refresh paths rather than part of `npm run build`.
- `/logos/`: sourced developer identities for 22 projects and original project marks for Scene 7 and ZED. Other project names retain text wordmarks.
- `scripts/og-card.html`: the 1200×630 social card. Copy it into `public/`, open it from the dev server in a browser at device pixel ratio 2, capture the top 1200×630 pixels and save them as `public/og.jpg`, which `app/layout.tsx` references. It is kept outside `public/` so it is never served as a route.

Project photos were obtained from DoEstate, Ahlan Homes, RealEstate.eg and the developer’s official site for Éclat. A listing placeholder and a photograph explicitly labeled IL BOSCO City / New Cairo were removed during review. Confirm image reuse rights before public release. Map imagery remains network-dependent and includes provider attribution. Project photos themselves are served locally.

## Remaining content dependencies

The site brand remains **Nile Estates**, defined once in `BRAND` inside `lib/i18n.ts`: metadata, the map wordmark, the loading screen, the video preview and both guide notes read from it. Published brochures are distinguished from independently prepared project guides; guides explicitly identify their publisher and sources. Fouka Bay’s published document covers The House Hotel & Residence Royale phase, while the 205 document covers the broader Arkan Palm development. No VR/video tour is invented.

Roads use OpenFreeMap vector tiles with custom colors and labels, plus Esri fallback. Rail infrastructure uses OpenRailwayMap. All overlays use Egyptian geography. If an enabled service category has no points in the current viewport, the camera reveals the nearest verified places; the service dataset is curated rather than exhaustive. Railway tiles show infrastructure, not a guarantee that a route is in passenger service. Some pre-existing coordinates are approximate; `areaApprox` is retained where supplied.

See `REFERENCE-AUDIT.md` for the reference observations and validation scope.

## Place comparison and driving routes

Projects and places can be selected together. `landmark=<id>` or `poi=<id>` preserves the destination alongside `project=<id>`. Selecting the same place again removes its card, route and badge while keeping the project and camera. Turning another service layer on preserves the comparison; turning the selected place's layer off clears it.

`/api/route` accepts only known project/place IDs and requests an OSRM driving route. The map draws the returned road geometry; the card and marker share its distance and estimated duration. This is not live traffic. Results are cached; rapid selection changes cancel obsolete client requests. Provider failure shows an unavailable state without inventing a distance or travel time. An internet connection to the routing provider is required.

The six landmark backgrounds are real local photographs. `lib/landmarkMedia.json` records the image source, creator and license; photo credit links appear on their cards. The mall photograph comes from Al-Futtaim's published Festival Avenue brochure. Details has one page scroller across the entire viewport, with non-interactive fixed artwork and fixed Back/gallery controls. Subtle panel, badge, gallery and route animations respect reduced motion.

With the development server running, `node scripts/check-routing.mjs` checks two road routes, their endpoints, destination changes and rejection of invalid IDs.

The route stroke and midpoint badge follow the selected theme (white in light mode, charcoal in dark mode). Drawing progresses by distance along the road. A separate card connector shows 4px dots with an 8px gap, moving on a 1.5s loop between the project and place panels; its position responds to card sizes, language and viewport changes.


The final interaction review added vertical photo swiping, horizontal hero swiping, double-click/pinch zoom and image panning, with keyboard alternatives. Moving between gallery groups preserves focus; nested Back/Escape restores the correct presentation. Small-screen brochure downloads stay visible. Menus dismiss on outside presses.

Inter and Noto Sans Arabic are served from `public/fonts/`, with OFL licenses and source metadata alongside them. Decorative cloud assets and their 100-second motion follow the reference; sources are recorded in `public/map/sources.json`. They do not intercept map input and stop under reduced motion.

`/video-preview` plays `public/videos/egypt-property-film.mp4`, a silent 24.5s 1080p cut documented in `public/videos/film-edit.json`. `scripts/build-hero-film.py` rebuilds it from the Mivida source clip, which is deliberately kept outside the repository because its reuse rights are unverified; download URLs for both source clips are in `public/videos/sources.json`. The ORA clip is available but unused — its logo and marketing captions are burned into almost every frame. `components/ExpandSearch.tsx` adds the expanding rail search, filtering project markers by name and area without moving the camera.

Éclat uses the developer’s current images and 50-page official brochure. Its independent bilingual guide remains available as a supplemental document.

### Service-card imagery and mouse previews

All 48 education, health, shopping and transport points now have local image backgrounds in `lib/poiMedia.json`: 12 documented campus/hospital/mall/airport photographs and 36 actual-location aerial images from Esri World Imagery. Aerial views are explicitly labeled. Source pages, authors and license information stay with each entry and appear on the selected card. `scripts/fetch-poi-media.py` refreshes aerial imagery from an exported POIS JSON file while preserving verified facade-photo overrides.

Project identities cover all 23 projects: 11 actual project marks, including four faithful extracts from the existing published brochures; the remaining 12 combine the sourced developer logo with the project's own name. Developer marks are not represented as independent project logos. Transparent monochrome marks receive contrast treatment on dark/light/selected backgrounds. New assets retain their original source URLs in `lib/media.json`.

Mouse-over previews mirror the reference's fixed 333×192 photo card with status, name and area, mirrored for Arabic. They cover project markers, landmarks and all service categories; hover does not change selection, URL, camera or route. Moving away, map movement, clicking, changing layers or Escape dismisses the preview. Keyboard focus has the same preview, and touch focus does not create a sticky hover card.


## Decision tools
Saved projects, comparison, sharing, daily journeys, source transparency and catalogue maintenance are documented in [PRODUCT-GUIDE.md](./PRODUCT-GUIDE.md). Run `npm run test:product` against a running local server.

## Production services on Vercel

See [VERCEL-SETUP.md](VERCEL-SETUP.md) and [.env.example](.env.example) for Supabase Auth/SQL, Resend, Turnstile and approved feed setup. Actual activation needs owner service accounts and permitted data access. `npm run test:services` validates SQL isolation, optimistic writes and atomic feed imports using local PostgreSQL WASM.

No custom domain needed for the Gmail SMTP option: see [GMAIL-SETUP.md](GMAIL-SETUP.md). The server uses a private Gmail app password and a one-time database delivery claim; setup is required before sending becomes available.
