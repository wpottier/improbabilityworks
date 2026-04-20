# Improbability Works — landing

Bilingual (EN / FR) landing page for the indie studio **Improbability Works** and its flagship cooperative FPS **Velvet Door**. Built with Astro in static mode, Tailwind CSS, and self-hosted fonts. Zero tracking, zero framework JS in the hot path.

## Stack

- [Astro](https://astro.build) 5.x — static output, native i18n routing
- [Tailwind CSS](https://tailwindcss.com) 3.x via `@astrojs/tailwind`
- `@astrojs/sitemap` — sitemap with `hreflang` alternates
- `astro-robots-txt` — minimal `robots.txt`
- `@fontsource-variable/fraunces` + `@fontsource-variable/manrope` + `@fontsource/cinzel` + `@fontsource/jetbrains-mono` — fonts self-hosted, no CDN

### Typography rationale

Chosen for a *cosmic + Art Deco* signature without falling into over-used indie clichés:

- **Fraunces (variable, SOFT axis)** anchors the studio side — literary, mystical, and comfortable at display sizes where Cormorant feels bridal and DM Serif feels heavy.
- **Cinzel** carries *Velvet Door* — inscriptional majuscule that reads as "engraved in brass" for speakeasy headers.
- **Manrope (variable)** handles body copy in both languages — geometric sans with enough personality to sit next to Fraunces, with clean French-diacritic rendering.
- **JetBrains Mono** is reserved for eyebrows, timestamps, and roadmap labels.

## Getting started

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in ./dist
npm run preview  # serve dist locally
```

## Project layout

```
.
├── astro.config.mjs
├── tailwind.config.mjs
├── public/
│   ├── improbabilityworks_logo.png  ← brand logo (provided)
│   ├── favicon.svg
│   ├── og/                          ← 1200×630 social cards (EN / FR)
│   ├── screens/                     ← 6 stylized Velvet Door placeholders
│   └── team/founder-avatar.svg
├── src/
│   ├── layouts/{BaseLayout,LegalLayout}.astro
│   ├── components/
│   │   ├── Nav.astro + Footer.astro + LanguageSwitcher.astro
│   │   └── Hero, Manifesto, GameSection, Roadmap, Team, Newsletter
│   ├── i18n/{en,fr}.json + utils.ts
│   ├── styles/global.css
│   └── pages/
│       ├── index.astro                       ← root → /en/ or /fr/ redirect
│       ├── en/{index,legal,eula,privacy}.astro
│       └── fr/{index,mentions-legales,cluf,confidentialite}.astro
└── .env.example
```

## i18n

- Default locale: **English**, served at `/en/`
- Alternate locale: **French**, served at `/fr/`
- `/` redirects client-side via `navigator.language` (meta-refresh fallback → EN)
- `src/i18n/utils.ts` exposes `t()`, a `SLUG_MAP` so the language switcher preserves the current page across locales (e.g. `/privacy/` ↔ `/fr/confidentialite/`), and `hreflangAlternates()` for `<link rel="alternate">` injection.
- All copy lives in `src/i18n/en.json` and `src/i18n/fr.json`. **Zero hard-coded user-visible strings in components.**

## Accessibility

- WCAG AA contrast on all text (golds tested on `--ink-deep` and `--velvet-noir`).
- Skip-to-content link, landmarks, visible focus rings.
- All animations gated behind `motion-safe:` utilities or `prefers-reduced-motion` overrides in `global.css`.
- Labeled form + GDPR consent checkbox on the newsletter.
- Descriptive `alt` on every image, `aria-hidden` on decorative SVGs.

## Performance

- `output: 'static'` → pure HTML/CSS deployable as-is on Netlify / Vercel / Cloudflare Pages.
- Zero client JS except a tiny `IntersectionObserver` for `.reveal` animations (inlined in `BaseLayout`, < 1 KB).
- Hero particles + portal are CSS-only.
- Fonts `font-display: swap` via `@fontsource`. Manrope latin-normal weight preloaded.
- Images use explicit dimensions; no CLS expected.

## ⚠ Before going live — human TODOs

Search the repo for `TODO` and `TODO LEGAL` to find every placeholder. Summary:

### Business / legal

- [ ] Confirm legal form (micro-entreprise / EURL / SASU) + SIREN + address in `src/pages/en/legal.astro` and `src/pages/fr/mentions-legales.astro`.
- [ ] Fill in publication director, VAT number (if applicable).
- [ ] Confirm final hosting provider (Netlify / Vercel / Cloudflare Pages) + provider legal entity & address, in the legal notice pages.
- [ ] Confirm newsletter provider (Buttondown / Resend / ConvertKit) — update `src/pages/**/privacy.astro` + `src/pages/**/confidentialite.astro`.
- [ ] Confirm whether a DPO is designated.
- [ ] **Have all three legal documents (legal notice, EULA, privacy) reviewed by a lawyer before publication.** The draft banners at the top of each page make this explicit.

### Brand / contact

- [ ] Replace `hello@improbabilityworks.studio` and `hello@improbabilityworks.studio` if different addresses are final.
- [ ] Replace the founder public handle (currently displayed as `Will` — search for `FOUNDER_HANDLE` comment in `src/components/Team.astro`).
- [ ] Replace `/team/founder-avatar.svg` with the final avatar (keep 1:1 ratio, 260×260+).
- [ ] Replace 6 placeholders under `public/screens/` with real Velvet Door screenshots (1920×1080 recommended).

### URLs & integrations

- [ ] Replace `STEAM_APP_ID` placeholder in `src/components/GameSection.astro`, `src/components/Footer.astro`, and JSON-LD blocks in `src/pages/{en,fr}/index.astro` with the real Velvet Door Steam app id.
- [ ] Replace every `href="#"` Discord / Bluesky / Mastodon / GitHub placeholder in `Hero`, `Roadmap`, `Team`, and `Footer` with final URLs. Add them also to the JSON-LD `sameAs` arrays in both `index.astro` files.
- [ ] Replace `#press-kit` with the final press-kit page or ZIP URL.
- [ ] Update `astro.config.mjs` `SITE` constant if the production domain is not `https://improbabilityworks.studio`.

### Newsletter wiring

- [ ] Choose a provider and either:
  - point the `<form action="…">` in `src/components/Newsletter.astro` directly at the provider's public endpoint, **or**
  - switch Astro to a hybrid/server adapter and add an API route that calls the provider using `NEWSLETTER_PROVIDER_*` env vars from `.env`.

### Analytics (optional)

- [ ] If enabling analytics, pick a privacy-friendly cookieless provider (Plausible / Umami). Add the `<script>` to `BaseLayout.astro` and update `src/pages/**/privacy.astro` + `src/pages/**/confidentialite.astro` *before* the tracker goes live.

### Store logos

- [ ] Replace the inline SVG Steam and Discord glyphs in `Hero.astro` / `GameSection.astro` with the official marks from Valve and Discord's press kits *if* you want pixel-for-pixel brand compliance. The current inline SVGs are generic approximations and intentionally simple.

## Deploy

The `dist/` output is plain static files; drop it on any of:

- **Netlify** — connect the repo, build command `npm run build`, publish directory `dist`.
- **Vercel** — same, framework preset "Astro".
- **Cloudflare Pages** — same, build command `npm run build`, output directory `dist`.

No server / edge functions are required unless you wire a server-side newsletter API route.

## License

© 2026 Improbability Works. All rights reserved. Code in this repository is proprietary; fonts are self-hosted under their respective OFL / MIT licenses (see `node_modules/@fontsource*`).
