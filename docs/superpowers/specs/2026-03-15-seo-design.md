# SEO Improvement — Design Spec

**Date:** 2026-03-15
**Project:** Christiane & Stéphane Wedding Site (Nuxt 4)
**Goal:** Improve social sharing appearance (WhatsApp, iMessage, Facebook previews). Not targeting Google indexing.

---

## Context

The site already has `@nuxtjs/seo` v3.4.0 installed (the full bundle: sitemap, robots, OG image, Schema.org, link checker, utils). However, nothing is configured beyond the bare installation — no `site.url`, no per-page meta tags, no OG tags, no crawler blocking.

**Production URL:** `https://christiane-wedding.vercel.app/` (domain TBD — update `site.url` when finalized)
**Language:** French
**Pages:** `/`, `/notre-histoire`, `/ceremonie`, `/faq`, `/rsvp`

---

## Approach

**Approach A — Global defaults in `nuxt.config.ts` + per-page `useSeoMeta()`**

- Shared config (site URL, name, OG image, robots) lives entirely in `nuxt.config.ts` via the `site` and `seo.meta` blocks
- Each page only calls `useSeoMeta()` with its specific title and description
- The Nuxt SEO module derives `og:title`, `og:description`, `og:url`, `og:site_name`, `og:locale`, and `og:type` automatically — no manual duplication

---

## Section 1 — Global configuration (`nuxt.config.ts`)

### Site identity

```ts
site: {
  url: 'https://christiane-wedding.vercel.app',
  name: 'Christiane & Stéphane',
}
```

### Crawler blocking

Block all bots — the site is private (invite-only, social sharing only).
`site.indexable: false` is the idiomatic Nuxt SEO switch: it generates `User-agent: * / Disallow: /` in `robots.txt` AND injects `<meta name="robots" content="noindex, nofollow">` on every page, protecting against crawlers that ignore `robots.txt`:

```ts
site: {
  url: 'https://christiane-wedding.vercel.app',
  name: 'Christiane & Stéphane',
  indexable: false,
}
```

### Title template

```ts
app: {
  head: {
    titleTemplate: '%s | Christiane & Stéphane',
    // ... existing htmlAttrs, bodyAttrs
  }
}
```

The home page overrides this to remove the suffix by calling `useHead({ titleTemplate: null })` in `index.vue` — `null` is the documented API value for disabling the title template on a specific page (type signature: `string | null | ((title?: string) => string | null)`).

### Global SEO meta defaults

Instead of a `useSeoMeta()` call in `app.vue`, the `seo.meta` block in `nuxt.config.ts` is the idiomatic place for site-wide defaults per the official Nuxt SEO docs:

```ts
seo: {
  meta: {
    description: 'Célébrez avec nous notre union à Montréal le 20 juin 2026 et à Cotonou le 19 décembre 2026.',
    ogImage: '/images/metadata-og.jpg',  // relative path — nuxt-seo-utils absolutizes it server-side using site.url
    ogType: 'website',                   // not auto-derived; required by Facebook OG spec
    twitterCard: 'summary_large_image',
    ogLocale: 'fr_FR',
  },
},
```

**Note:** `og:site_name`, `og:url`, and `og:locale` are automatically set by `nuxt-seo-utils` from `site.name`, the current route, and site config respectively. `og:title` and `og:description` are inferred by `InferSeoMetaPlugin` from the `<title>` and `<meta name="description">` tags set per-page — no manual duplication needed. `og:type` is **not** auto-derived and must be set explicitly.

**Note:** `ogImage` is passed as a relative path. `nuxt-seo-utils` ships a server-side plugin (`absoluteImageUrls`) that resolves it to `https://christiane-wedding.vercel.app/images/metadata-og.jpg` using `site.url`. If `site.url` changes (e.g. when the domain is finalized), only the `site.url` value needs updating — the image path stays the same.

---

## Section 2 — OG image

**Action required before implementation:** The existing `metadata-image.jpg` is 1136×1712px (portrait, ~2:3 ratio). Social platforms (WhatsApp, Facebook, iMessage) expect a landscape image at 1200×630px (~1.91:1). A portrait image will be letterboxed or cropped differently per platform, and Facebook may fall back to no image.

**Prepare a landscape-cropped version at 1200×630px and save it as `/public/images/metadata-og.jpg`.** This is the file referenced in `seo.meta.ogImage` above.

If a landscape crop is not immediately available, the portrait image can be used temporarily under the old filename — but the quality of Facebook/WhatsApp previews will be degraded.

---

## Section 3 — Per-page `useSeoMeta()` calls

Each page's `<script setup>` gets a `useSeoMeta()` call with title and description.

- `og:title` is automatically inferred from the `<title>` tag by `InferSeoMetaPlugin`
- `og:description` is automatically inferred from `<meta name="description">`
- `og:url` is set separately by `nuxt-seo-utils` `applyDefaults()` using the current route's canonical URL resolved against `site.url` — it is NOT derived from the `useSeoMeta()` call itself

| Page              | Title                   | Description                                                                                 |
| ----------------- | ----------------------- | ------------------------------------------------------------------------------------------- |
| `/`               | `Christiane & Stéphane` | Célébrez avec nous notre union à Montréal le 20 juin 2026 et à Cotonou le 19 décembre 2026. |
| `/notre-histoire` | `Notre Histoire`        | De Montréal aux Cinque Terre — l'histoire d'amour de Christiane et Stéphane, depuis 2019.   |
| `/ceremonie`      | `La Cérémonie`          | Tous les détails de nos cérémonies à Montréal et Cotonou : lieux, horaires et programme.    |
| `/faq`            | `FAQ`                   | Vos questions sur le mariage, le thème, le RSVP et les cadeaux — tout ce qu'il faut savoir. |
| `/rsvp`           | `RSVP`                  | Confirmez votre présence à notre mariage avant le 15 août 2026.                             |

Example for `/notre-histoire`:

```vue
<script setup lang="ts">
useSeoMeta({
  title: "Notre Histoire",
  description: "De Montréal aux Cinque Terre — l'histoire d'amour de Christiane et Stéphane, depuis 2019.",
});
</script>
```

Example for `/` (home page — title template removed, description already set globally):

```vue
<script setup lang="ts">
useHead({ titleTemplate: null });
useSeoMeta({
  title: "Christiane & Stéphane",
});
</script>
```

---

## Files to change

| File                           | Change                                                                                                        |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| `nuxt.config.ts`               | Add `site` (with `indexable: false`), `seo.meta` (global OG defaults), update `app.head` with `titleTemplate` |
| `app/pages/index.vue`          | Add `useHead({ titleTemplate: null })` + `useSeoMeta({ title })`                                              |
| `app/pages/notre-histoire.vue` | Add `useSeoMeta({ title, description })`                                                                      |
| `app/pages/ceremonie.vue`      | Add `useSeoMeta({ title, description })`                                                                      |
| `app/pages/faq.vue`            | Add `useSeoMeta({ title, description })`                                                                      |
| `app/pages/rsvp.vue`           | Add `useSeoMeta({ title, description })`                                                                      |

**Pre-implementation action:** Prepare `/public/images/metadata-og.jpg` at 1200×630px (landscape crop of the couple photo).

---

## Out of scope

- Schema.org structured data (overkill for social sharing)
- Google Search Console setup
- Dynamic per-page OG images
- Analytics
- Sitemap submission
