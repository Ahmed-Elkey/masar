# Image clarity review

- Reviewed contact sheets of all 73 project photographs, plus dimensions and source availability for landmark/service photography.
- Upgraded 14 project images from card conversions to their larger native originals from the same source. The other 59 project originals were retained.
- Upgraded 43 service images from their original source, including aerial exports at the same coordinates/extent with 1600 x 900 pixels; replaced two undersized university photos with official campus photos (AUC 2000 x 1333; BUE 800 x 800), with provenance updated. Six landmark photographs retained.
- Fixed a global responsive-image issue: an AVIF-only candidate list could cap a 900px original at 480px. Native originals now remain eligible for every image.
- Fixed portrait descriptors: variants are resized by width instead of maximum dimension. Generated 141 candidates at quality 85 and retained all original source dimensions in imageDimensions.json. No image was upscaled.
- ProjectImage measures the displayed frame and cover crop, so tall crops and wide backgrounds do not request thumbnail-sized resources. Shared by home, collection, all 23 project pages, galleries, about and contact; map previews retain native fallback.

## Verification

- All 73 original dimensions and 141 variant widths/aspect ratios validated.
- AVIF comparison to the resized native source: minimum PSNR 35.9 dB, average 40.3 dB. This measures encoding fidelity, not sharpness of the original photograph.
- Production build/type check and git diff whitespace checks passed. All 28 page routes returned HTTP 200.
- Browser confirmed native Mivida image resources in full-size hero/gallery and City Gate portrait hero; no image blur filter applied to gallery photographs.

Source resolution still sets the maximum available detail; retaining a native original does not create additional details beyond its source.

## Full-width Mivida follow-up
Replaced the two soft homepage scenes with different, verified Mivida photographs/renders from Emaar Misr's community gallery. Retained the existing project photographs and appended the official assets at indices 4 (2000×1458 landscape) and 5 (1800×1013 Blue Views pool). Source URLs are recorded in media.json. Panorama overscan reduced from 150% to 115% desktop, 190% to 140% mobile, preserving its drag travel. These are native higher resolution assets, not enlarged low resolution copies; retina sharpness remains bounded by the source resolution.
