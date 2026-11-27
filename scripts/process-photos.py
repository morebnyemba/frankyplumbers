"""
Process Franky's job photos into web-ready assets.

Usage:  python3 -I scripts/process-photos.py <dir-with-original-jpegs>

- Fixes EXIF orientation, then strips ALL metadata (no GPS/device data ships).
- Light autocontrast + unsharp mask (WhatsApp exports are soft and a bit flat).
- Never upscales. Writes public/img/work/<slug>.webp and lib/work.generated.ts
  (dimensions + tiny base64 blur placeholders for next/image).
"""
import base64, io, json, os, sys
from PIL import Image, ImageFilter, ImageOps

SRC = sys.argv[1]
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "img", "work")
os.makedirs(OUT, exist_ok=True)

P = "WhatsApp Image 2026-11-19 at "
# slug, source file, category, title, alt
PHOTOS = [
    ("team-shower-install", P + "19.31.12 (2).jpeg", "team", "Fitting a glass shower enclosure", "Two Franky Plumbing Services technicians in branded uniforms fitting a glass shower enclosure"),
    ("shower-smoked-glass", P + "19.31.07 (1).jpeg", "showers", "Smoked-glass shower enclosure", "Black-framed smoked-glass shower enclosure in a marble-tiled bathroom"),
    ("shower-double-door", P + "19.31.15.jpeg", "showers", "Frosted double-door shower", "Black-framed shower with frosted-band double glass doors"),
    ("bath-rain-shower", P + "19.31.10 (1).jpeg", "bathrooms", "Bath with rain shower", "Built-in bath with chrome rain shower and mosaic tile border"),
    ("freestanding-bath", P + "19.31.10.jpeg", "bathrooms", "Freestanding bath", "White freestanding bath with wall-mounted mixer against marble tiles"),
    ("team-drainage-trench", P + "19.31.01 (1).jpeg", "pipework", "Laying foundation drainage", "Technician in a Franky Plumbing Services uniform laying drainage pipes against a brick wall"),
    ("solar-geyser", P + "19.31.02 (2).jpeg", "water", "Solar geyser installation", "Solar water heater installed on a tiled roof under a blue sky"),
    ("rain-shower-column", P + "19.31.11 (1).jpeg", "showers", "Rain shower column", "Chrome rain shower column with handset on a tiled wall"),
    ("shower-corner-frame", P + "19.31.15 (1).jpeg", "showers", "Black-frame corner shower", "Black-frame glass corner shower in a newly tiled bathroom"),
    ("team-shower-head", P + "19.31.04 (1).jpeg", "team", "Mounting a rain shower head", "Two technicians mounting a square rain shower head"),
    ("drainage-inspection", P + "19.31.02 (1).jpeg", "pipework", "Drainage with inspection eye", "New uPVC drainage run with inspection cover beside a brick wall"),
    ("bathroom-suite", P + "19.31.12.jpeg", "bathrooms", "Basin and WC suite", "Pedestal basin and close-coupled toilet in a tiled bathroom"),
    ("rain-shower-bath", P + "19.31.13 (2).jpeg", "showers", "Rain shower over bath", "Black square rain shower with thermostatic mixer above a bath"),
    ("floating-vanity", P + "19.31.09 (2).jpeg", "bathrooms", "Floating vanity unit", "Wall-hung vanity unit with basin and soap dispenser in a marble-tiled bathroom"),
    ("toilet-levelled", P + "19.31.06 (3).jpeg", "bathrooms", "WC set dead level", "Modern toilet with a spirit level on the cistern"),
    ("drainage-trench", P + "19.31.14 (1).jpeg", "pipework", "New-build drainage runs", "Open trench with new drainage and water supply pipes along a house"),
    ("team-basin", P + "19.31.14.jpeg", "team", "Fitting a pedestal basin", "Technicians connecting a pedestal basin"),
    ("borehole-pump", P + "19.31.15 (2).jpeg", "water", "Borehole pump & pressure line", "Booster pump and blue pressure pipe at a borehole tank stand"),
    ("team-glass-door", P + "19.31.12 (1).jpeg", "team", "Hanging a shower door", "Technician hanging a glass shower door"),
    ("soil-stacks", P + "19.30.59.jpeg", "pipework", "External soil stacks", "External soil and vent stacks with gullies on a new house"),
    ("basin-mixer", P + "19.31.10 (2).jpeg", "bathrooms", "Basin mixer tap", "Chrome mixer tap on a compact corner basin"),
    ("shower-mosaic", P + "19.31.04.jpeg", "showers", "Glass shower, mosaic floor", "Curved glass shower enclosure with pebble mosaic floor"),
    ("team-bathroom", P + "19.31.08 (1).jpeg", "team", "Bathroom fit-out", "Technician in a branded uniform working in a marble-tiled bathroom"),
    ("kitchen-sink", P + "19.31.03 (1).jpeg", "team", "Kitchen sink installation", "Technician plumbing in a stainless steel kitchen sink"),
    ("copper-first-fix", P + "19.31.18 (1).jpeg", "pipework", "Copper first-fix", "Copper water pipes chased into a plastered wall during first-fix"),
    ("site-first-fix", P + "19.31.19.jpeg", "team", "First-fix on a new build", "Technician in a hard hat and hi-vis vest on a new-build site"),
]

def enhance(im):
    im = ImageOps.autocontrast(im, cutoff=0.4, preserve_tone=True)
    return im.filter(ImageFilter.UnsharpMask(radius=1.1, percent=55, threshold=3))

def blur_data_url(im):
    t = im.copy(); t.thumbnail((16, 16))
    b = io.BytesIO(); t.save(b, "WEBP", quality=40)
    return "data:image/webp;base64," + base64.b64encode(b.getvalue()).decode()

records = []
for slug, name, cat, title, alt in PHOTOS:
    im = ImageOps.exif_transpose(Image.open(os.path.join(SRC, name))).convert("RGB")
    im = enhance(im)
    path = os.path.join(OUT, slug + ".webp")
    im.save(path, "WEBP", quality=78, method=6)  # no exif= -> metadata stripped
    records.append(dict(slug=slug, src=f"/img/work/{slug}.webp", width=im.width, height=im.height,
                        category=cat, title=title, alt=alt, blur=blur_data_url(im)))
    print(f"{slug:24} {im.width}x{im.height} {os.path.getsize(path)//1024}KB")

ts = "// AUTO-GENERATED by scripts/process-photos.py. Do not edit by hand.\n"
ts += "import type { WorkPhoto } from \"./work\";\n\n"
ts += "export const workPhotos: WorkPhoto[] = " + json.dumps(records, indent=2) + ";\n"
open(os.path.join(ROOT, "lib", "work.generated.ts"), "w").write(ts)
print(len(records), "photos")
