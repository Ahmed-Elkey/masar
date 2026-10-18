#!/usr/bin/env python3
"""Generate AVIF width variants for project photos and record them in lib/imageVariants.json."""
import json
import os
import subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WIDTHS = (480, 960, 1440)
QUALITY = "55"

media = json.load(open(os.path.join(ROOT, "lib/media.json")))
sources = sorted({image["src"] for project in media.values() for image in project["images"]})

variants: dict[str, list[int]] = {}
for src in sources:
    path = os.path.join(ROOT, "public", src.lstrip("/"))
    if not os.path.exists(path):
        print("missing", src)
        continue
    width = int(
        subprocess.run(["sips", "-g", "pixelWidth", path], capture_output=True, text=True)
        .stdout.strip()
        .split()[-1]
    )
    base, _ = os.path.splitext(path)
    widths = []
    for target in WIDTHS:
        if width < target:
            continue
        dest = f"{base}-{target}.avif"
        if not os.path.exists(dest):
            result = subprocess.run(
                ["sips", "-Z", str(target), "-s", "format", "avif", "-s", "formatOptions", QUALITY, path, "--out", dest],
                capture_output=True,
                text=True,
            )
            if result.returncode:
                print("failed", src, target, result.stderr.strip())
                continue
        widths.append(target)
    variants[src] = widths

json.dump(variants, open(os.path.join(ROOT, "lib/imageVariants.json"), "w"), indent=0, sort_keys=True)
print(f"{len(variants)} images, {sum(len(w) for w in variants.values())} variants")
