#!/usr/bin/env python3
"""Build high quality width-exact photo variants; always retain native originals in srcsets."""
import json
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
WIDTHS = (480, 960, 1440, 1920, 2560)
QUALITY = 85
media = json.loads((ROOT / 'lib/media.json').read_text())
sources = sorted({im['src'] for project in media.values() for im in project['images']})

def build(src):
    path = ROOT / 'public' / src.lstrip('/')
    with Image.open(path) as original:
        picture = ImageOps.exif_transpose(original).convert('RGB')
        width, height = picture.size
        available = []
        for target in WIDTHS:
            if target >= width:
                continue
            resized = picture.resize((target, round(height * target / width)), Image.Resampling.LANCZOS)
            resized.save(path.with_name(f'{path.stem}-{target}.avif'), quality=QUALITY, speed=7)
            available.append(target)
        return src, available, {'width': width, 'height': height}

with ThreadPoolExecutor(max_workers=3) as pool:
    rows = list(pool.map(build, sources))
(ROOT / 'lib/imageVariants.json').write_text(json.dumps({src:w for src,w,_ in rows}, indent=2, sort_keys=True)+'\n')
(ROOT / 'lib/imageDimensions.json').write_text(json.dumps({src:d for src,_,d in rows}, indent=2, sort_keys=True)+'\n')
print(f'{len(rows)} originals; {sum(len(w) for _,w,_ in rows)} high-quality, width-exact variants')
