# Franky Plumbers website

The Franky Plumbers marketing site: Next.js 15 (App Router) + React 19 + framer-motion. Every route prerenders statically, so it deploys to Vercel with no configuration.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (all routes static)
```

## Deploy to Vercel

1. In Vercel, **Add New → Project** and import `morebnyemba/frankyplumbers`. Vercel auto-detects the Next.js framework preset; no extra settings needed.
2. Optional: set the env var `NEXT_PUBLIC_SITE_URL` (e.g. `https://frankyplumbers.co.zw`). It's used for canonical URLs, the sitemap and JSON-LD.
3. Deploy, then add the custom domain under **Settings → Domains**.

## Structure

```
app/
  layout.tsx          fonts (next/font), metadata, JSON-LD, header/footer chrome
  page.tsx            Home
  services/page.tsx   Services
  contact/page.tsx    Contact
  sitemap.ts, robots.ts, not-found.tsx, icon.svg
  globals.css         all styles + CSS loop animations
components/
  Hero.tsx            hero: photo zoom-in + scroll parallax, cursor spotlight, word-mask headline, spring quote card, animated waves
  Header.tsx          hide-on-scroll header, shared-layout nav hover/active, animated mobile drawer
  sections.tsx        Stats, Services, About, Process, Emergency band, Gallery, Reviews, Areas, FAQ, Final CTA, PageHeader
  ServiceDetail.tsx   alternating service rows (services page)
  motion.tsx          motion primitives: Reveal, Stagger, CountUp, Tilt, Magnetic, Parallax
  chrome.tsx          scroll-progress bar, floating WhatsApp + mobile call bar
  QuoteForm.tsx       lead form → WhatsApp hand-off
lib/site.ts           ALL business details + content (single source of truth)
public/img/           optimised WebP photos (Unsplash licence)
```

## Motion

- `MotionConfig reducedMotion="user"` plus a CSS `prefers-reduced-motion` block: users who ask the OS for reduced motion get a static site.
- Only `transform`, `opacity` and `clip-path` are animated, so the GPU handles it without layout thrash.
- The hero content's scroll fade/lift only runs at ≥981px, so the mobile quote form never fades out.
- Pointer effects (tilt, magnetic buttons, spotlight) only respond to a mouse, never to touch.

## Job photos

Franky's real job photos live in `public/img/work/` (26 photos) plus a video tour in `public/video/`. They're used on the service cards, in About, in the service rows, on the home "Recent work" grid and on `/gallery`, which has category filters and a lightbox (keyboard arrows, swipe, Esc).

To add or replace photos:

1. Put the original JPEGs in a folder (outside the repo).
2. Edit the `PHOTOS` list in `scripts/process-photos.py` (slug, filename, category, title, alt text).
3. Run `python3 -I scripts/process-photos.py /path/to/originals`. This regenerates the WebPs and `lib/work.generated.ts` (sizes + blur placeholders). EXIF metadata, including GPS, is stripped.
4. Optional: set a crop focal point in `focus` in `lib/work.ts` if a portrait shot loses its subject in a card.

**Resolution:** the current set came via WhatsApp, which compresses images to about 720×1280. That's fine for cards and galleries but too soft for the full-width hero, which still uses a stock photo. Ask Franky to send originals as *documents* in WhatsApp (this avoids compression), or via Google Drive. Then a real photo can go in the hero too.

## Before going live, replace the placeholders

Everything is in **`lib/site.ts`**:

| What | Key |
|---|---|
| Phone / WhatsApp / email | `site.phone*`, `site.whatsapp`, `site.email` |
| Social links | `site.socials` |
| Stats (15+ yrs, 4,800 jobs, 4.9★, 60 min) | `stats` (also the hero trust row in `Hero.tsx` and the rating pill in `sections.tsx`) |
| **Testimonials: sample text** | `reviews`. Use real, attributable reviews only |
| Gallery captions | `gallery`. Ideally swap in Franky's own job photos |
| Areas, FAQ, payment methods | `areas`, `faqs` |

## Forms

The forms have no backend: they compose a WhatsApp message and open `wa.me`. To capture leads, add an `app/api/quote/route.ts` handler (email, CRM or DB) and POST to it from `QuoteForm.tsx`, keeping WhatsApp as the fallback.
