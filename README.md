# Franky Plumbers website

A static marketing site for Franky Plumbers. It's plain HTML, CSS and JS, with no build step and no dependencies.

```
index.html      Home: photo hero + quote form, services, about, process, emergency band, gallery, reviews, areas, FAQ
services.html   Services: photo page header + detailed sections
contact.html    Contact: photo page header + quote form + map
assets/css/styles.css
assets/js/main.js   sticky header, mobile nav, scroll reveals, counters, form -> WhatsApp hand-off
assets/img/         optimised WebP photos (Unsplash licence) + favicon
```

## Preview locally

```bash
cd client-sites/franky-plumbers && python3 -m http.server 8080
```

## Before going live, replace the placeholders

| What | Where |
|---|---|
| Phone `+263 77 000 0000` / `263770000000` | all three HTML files (`tel:` + `wa.me` links) and `WHATSAPP_NUMBER` in `assets/js/main.js` |
| Email `info@frankyplumbers.co.zw`, domain `frankyplumbers.co.zw` | HTML files (canonical, JSON-LD, footer) |
| Stats (15+ years, 4800+ jobs, 4.9 rating, 200+ reviews, 60-min response) | `index.html` hero trust row, stats strip, reviews pill |
| **Testimonials**: these are sample text | `index.html` `#reviews`. Use real, attributable reviews only |
| Gallery captions/suburbs | `index.html` "Recent work". Ideally swap in Franky's own job photos |
| Social links (`href="#"`) | footer in all pages |
| Service area list, payment methods, FAQ answers | `index.html` |

The header/footer markup is the same on every page. If you edit it, update all three files.

## Forms

There's no backend yet. The quote forms build a pre-filled WhatsApp message and open `wa.me`. To capture leads server-side, change the submit handler in `main.js` to POST to an API endpoint, and keep WhatsApp as the fallback.
