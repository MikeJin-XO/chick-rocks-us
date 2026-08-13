#!/usr/bin/env python3
"""Generate transparent food cut-outs for the catering page using rembg.

Uses the rembg Python API directly (avoids the gradio-dependent CLI).
Post-processes: crop to the opaque bounding box (+ small padding) so each
PNG is tightly framed and easy to position as a floating element.
"""
import io
import os
import sys
from PIL import Image
from rembg import remove, new_session

SRC_DIR = "public"
OUT_DIR = "public/menu-images/cutouts"

# [source path (relative to public/), output basename, keep-largest-component]
# High-quality hero/marketing photos preferred; menu-images kept only for the
# small peeking decor accents that still read fine at thumbnail size.
JOBS = [
    ("hero-4.png", "chicken-pile", True),                       # fried chicken pile (HQ)
    ("Honey Hot Chicken Sandwich.png", "sandwich", True),       # dramatic sandwich (HQ)
    ("catering-item-2.jpeg", "wings", True),                    # saucy wings (HQ)
    ("catering-item-1.jpeg", "spaghetti", True),                # chicken parm spaghetti (HQ)
    ("catering-item-3.jpeg", "frappe", True),                   # caramel frappe (HQ)
    ("catering-item-4.jpeg", "shake", True),                    # strawberry shake (HQ)
    ("catering-item-5.jpeg", "sundae", True),                   # caramel sundae (HQ)
    ("menu-images/snack-mac_cheese.jpg", "mac-cheese", False),
    ("menu-images/snack-mashed_potato.jpg", "mashed-potato", False),
    ("menu-images/snack-seasoned_fries.jpg", "fries-box", False),
    ("menu-images/snack-biscuit_6pc.jpg", "biscuits", False),
    ("menu-images/beverages-brazilian_lemonade.jpg", "lemonade", False),
]

def keep_largest_component(img):
    """Drop disconnected stray specks (e.g. flying crumbs) — keep only the
    largest opaque blob. Uses a coarse downscaled mask for speed."""
    import numpy as np
    from collections import deque

    alpha = np.array(img.split()[-1])
    H, W = alpha.shape
    scale = max(1, max(H, W) // 400)  # work on ~400px mask
    small = alpha[::scale, ::scale] > 40
    sh, sw = small.shape
    seen = np.zeros_like(small, dtype=bool)
    best = None
    best_size = 0
    for sy in range(sh):
        for sx in range(sw):
            if small[sy, sx] and not seen[sy, sx]:
                q = deque([(sy, sx)])
                seen[sy, sx] = True
                comp = []
                while q:
                    y, x = q.popleft()
                    comp.append((y, x))
                    for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                        ny, nx = y + dy, x + dx
                        if 0 <= ny < sh and 0 <= nx < sw and small[ny, nx] and not seen[ny, nx]:
                            seen[ny, nx] = True
                            q.append((ny, nx))
                if len(comp) > best_size:
                    best_size = len(comp)
                    best = comp
    if not best:
        return img
    # build full-res keep mask from the winning component (bounding box + fill)
    keep_small = np.zeros_like(small, dtype=bool)
    for y, x in best:
        keep_small[y, x] = True
    keep_full = np.kron(keep_small, np.ones((scale, scale), dtype=bool))[:H, :W]
    # dilate a touch so we don't clip edges lost to downscaling
    from PIL import ImageFilter
    mask = Image.fromarray((keep_full * 255).astype("uint8")).filter(ImageFilter.MaxFilter(2 * scale + 1))
    new_alpha = np.minimum(alpha, np.array(mask))
    r, g, b, _ = img.split()
    return Image.merge("RGBA", (r, g, b, Image.fromarray(new_alpha)))


only = sys.argv[1] if len(sys.argv) > 1 else None
os.makedirs(OUT_DIR, exist_ok=True)
session = new_session("u2net")

for src, out, largest in JOBS:
    if only and out != only:
        continue
    src_path = os.path.join(SRC_DIR, src)
    with open(src_path, "rb") as fh:
        data = fh.read()
    # alpha matting gives much cleaner edges on soft / fuzzy fried-chicken edges
    result = remove(
        data,
        session=session,
        alpha_matting=True,
        alpha_matting_foreground_threshold=240,
        alpha_matting_background_threshold=15,
        alpha_matting_erode_size=10,
    )
    img = Image.open(io.BytesIO(result)).convert("RGBA")
    if largest:
        img = keep_largest_component(img)
    bbox = img.getbbox()
    if bbox:
        pad = 10
        l, t, r, b = bbox
        l = max(0, l - pad); t = max(0, t - pad)
        r = min(img.width, r + pad); b = min(img.height, b + pad)
        img = img.crop((l, t, r, b))
    out_path = os.path.join(OUT_DIR, out + ".png")
    img.save(out_path)
    print(f"{src} -> {out_path}  ({img.width}x{img.height})")
