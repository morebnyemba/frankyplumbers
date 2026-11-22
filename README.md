# Franky Plumbers website

The Franky Plumbers marketing site: Next.js 15 (App Router) + React 19 + framer-motion. Every route prerenders statically, so it deploys to Vercel with no configuration.

## Run locally

```bash
cd client-sites/franky-plumbers
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (all routes static)
```

## Deploy to Vercel

1. In Vercel, **Add New → Project** and import `morebnyemba/slykertech`.
2. Set **Root Directory** to `client-sites/franky-plumbers`. Vercel auto-detects the Next.js framework preset.
3. Optional: set the env var `NEXT_PUBLIC_SITE_URL` (e.g. `https://frankyplumbers.co.zw`). It's used for canonical URLs, the sitemap and JSON-LD.
4. Deploy, then add the custom domain under **Settings → Domains**.

This app is fully standalone, with its own `package.json`, `tsconfig.json` and `postcss.config.mjs`. The root Slyker Tech app's `tsconfig` and ESLint ignore `client-sites/`.

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
