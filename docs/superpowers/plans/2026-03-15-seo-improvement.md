# SEO Improvement Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Configure Nuxt SEO module for polished social sharing previews (WhatsApp, iMessage, Facebook) with per-page titles and a global OG image.

**Architecture:** All global defaults live in `nuxt.config.ts` via the `site` and `seo.meta` blocks. Each page adds only its specific title and description via `useSeoMeta()`. The Nuxt SEO module derives `og:title`, `og:description`, `og:url`, `og:site_name`, and `og:locale` automatically from these values + `site` config — no manual duplication.

**Tech Stack:** Nuxt 4, `@nuxtjs/seo` v3.4.0 (includes `nuxt-site-config`, `nuxt-robots`, `nuxt-seo-utils`, `InferSeoMetaPlugin`), `useSeoMeta()` and `useHead()` composables (auto-imported by Nuxt).

**Spec:** `docs/superpowers/specs/2026-03-15-seo-design.md`

---

## File Map

| File                            | Action | Responsibility                                                      |
| ------------------------------- | ------ | ------------------------------------------------------------------- |
| `nuxt.config.ts`                | Modify | Site identity, crawler blocking, global OG defaults, title template |
| `app/pages/index.vue`           | Modify | Home page title (+ titleTemplate null override)                     |
| `app/pages/notre-histoire.vue`  | Modify | "Notre Histoire" page title + description                           |
| `app/pages/ceremonie.vue`       | Modify | "La Cérémonie" page title + description                             |
| `app/pages/faq.vue`             | Modify | "FAQ" page title + description                                      |
| `app/pages/rsvp.vue`            | Modify | "RSVP" page title + description                                     |
| `public/images/metadata-og.jpg` | Create | Landscape OG image (1200×630px) — manual step by developer          |

---

## Chunk 1: Global configuration

### Task 1: Prepare the landscape OG image

**Files:**

- Create: `public/images/metadata-og.jpg`

This is a manual step (image editing). The existing `public/images/metadata-image.jpg` is portrait (1136×1712). Social platforms expect landscape (1200×630).

- [ ] **Step 1.1: Crop the image**

Open `public/images/metadata-image.jpg` in any image editor (Figma, Photoshop, GIMP, macOS Preview, or an online tool like squoosh.app).

Export a landscape crop at exactly **1200×630px** and save it as:

```
public/images/metadata-og.jpg
```

Choose a crop that shows the couple's faces clearly — this will be the first thing guests see when the link is shared.

- [ ] **Step 1.2: Verify the file exists and dimensions are correct**

```bash
identify public/images/metadata-og.jpg
```

Expected output: `public/images/metadata-og.jpg JPEG 1200x630 ...`

If `identify` is not available:

```bash
file public/images/metadata-og.jpg
```

---

### Task 2: Configure `nuxt.config.ts`

**Files:**

- Modify: `nuxt.config.ts`

The current file has no `site`, `seo`, or `robots` configuration. We add three things:

1. `site` block — identity + crawler blocking via `indexable: false`
2. `seo.meta` block — global OG defaults
3. `titleTemplate` inside `app.head`

The project uses **double-quotes** for all string literals (enforced by ESLint). All new strings must follow this convention.

- [ ] **Step 2.1: Add site identity and crawler blocking**

In `nuxt.config.ts`, add the `site` block inside `defineNuxtConfig({...})`:

```ts
site: {
  url: "https://christiane-wedding.vercel.app",
  name: "Christiane & Stéphane",
  indexable: false,  // generates robots.txt Disallow:/ AND injects noindex meta on every page
},
```

`indexable: false` is the idiomatic Nuxt SEO way to block all crawlers. It does two things at once: sets `User-agent: * / Disallow: /` in `robots.txt`, and adds `<meta name="robots" content="noindex, nofollow">` on every page for crawlers that ignore `robots.txt`.

- [ ] **Step 2.2: Add global SEO meta defaults**

Still in `nuxt.config.ts`, add the `seo` block:

```ts
seo: {
  meta: {
    description: "Célébrez avec nous notre union à Montréal le 20 juin 2026 et à Cotonou le 19 décembre 2026.",
    ogImage: "/images/metadata-og.jpg",
    ogType: "website",    // set explicitly to guarantee the value regardless of module defaults
    twitterCard: "summary_large_image",
    ogLocale: "fr_FR",
  },
},
```

**Why relative path for `ogImage`?** `nuxt-seo-utils` ships a server-side plugin that absolutizes `og:image` using `site.url` automatically. When the domain changes from `christiane-wedding.vercel.app`, only `site.url` needs updating — not every `ogImage` reference.

**What the module handles automatically** (do NOT add these manually — they'll be duplicated):

- `og:site_name` ← derived from `site.name`
- `og:url` ← derived from current route + `site.url`
- `og:title` ← inferred from `<title>` by `InferSeoMetaPlugin`
- `og:description` ← inferred from `<meta name="description">` by `InferSeoMetaPlugin`
- `og:locale` ← derived from site config locale (but we set `ogLocale: "fr_FR"` explicitly to guarantee French)

- [ ] **Step 2.3: Add the title template**

Inside the existing `app.head` block in `nuxt.config.ts`, add `titleTemplate`:

```ts
app: {
  head: {
    titleTemplate: "%s | Christiane & Stéphane",
    htmlAttrs: {
      class: "h-full",
    },
    bodyAttrs: {
      class: "antialiased overflow-x-hidden",
    },
  },
},
```

`%s` is replaced by the page's title. Pages without a `useSeoMeta({ title })` call will show just `| Christiane & Stéphane`.

- [ ] **Step 2.4: Verify the full `nuxt.config.ts` looks correct**

The complete file should now look like:

```ts
// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

import "./shared/lib/env";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["./app/assets/css/main.css"],
  vite: {
    plugins: [
      // @ts-expect-error Don't understand the error
      tailwindcss(),
    ],
  },
  site: {
    url: "https://christiane-wedding.vercel.app",
    name: "Christiane & Stéphane",
    indexable: false,
  },
  seo: {
    meta: {
      description: "Célébrez avec nous notre union à Montréal le 20 juin 2026 et à Cotonou le 19 décembre 2026.",
      ogImage: "/images/metadata-og.jpg",
      ogType: "website",
      twitterCard: "summary_large_image",
      ogLocale: "fr_FR",
    },
  },
  app: {
    head: {
      titleTemplate: "%s | Christiane & Stéphane",
      htmlAttrs: {
        class: "h-full",
      },
      bodyAttrs: {
        class: "antialiased overflow-x-hidden",
      },
    },
  },
  modules: [
    "@nuxt/eslint",
    "@nuxt/ui",
    "motion-v/nuxt",
    "@nuxt/image",
    "@nuxtjs/seo",
  ],
  eslint: {
    config: {
      standalone: false,
    },
  },
});
```

- [ ] **Step 2.5: Start the dev server and verify no errors**

```bash
pnpm dev
```

Expected: dev server starts with no module errors. The terminal may show `nuxt-robots` and `nuxt-site-config` initialization messages — that's normal.

- [ ] **Step 2.6: Verify robots.txt is generated correctly**

With dev server running, open:

```
http://localhost:3000/robots.txt
```

Expected output:

```
User-agent: *
Disallow: /
```

- [ ] **Step 2.7: Verify noindex meta tag is injected**

Open `http://localhost:3000` in the browser. Open DevTools → Elements → search for `robots` in the `<head>`.

Expected:

```html
<meta name="robots" content="noindex, nofollow" />
```

---

## Chunk 2: Per-page meta tags

### Task 3: Home page (`app/pages/index.vue`)

**Files:**

- Modify: `app/pages/index.vue`

The home page needs special handling: the global `titleTemplate` adds `| Christiane & Stéphane` suffix, but the home page title IS `Christiane & Stéphane` — the suffix would make it `Christiane & Stéphane | Christiane & Stéphane`. We override the template to `null` on this page only.

- [ ] **Step 3.1: Add `useHead` and `useSeoMeta` to `index.vue`**

At the top of the `<script setup lang="ts">` block in `app/pages/index.vue`, add:

```ts
useHead({ titleTemplate: null });
useSeoMeta({
  title: "Christiane & Stéphane",
});
```

The `description` is omitted — the global fallback from `seo.meta` already covers it.

**Why `titleTemplate: null`?** `null` is the documented API value for disabling the title template on a specific page. The type signature is `string | null | ((title?: string) => string | null)`. Do NOT use `""` (empty string) — that is not in the type signature and behavior may change across Unhead versions.

- [ ] **Step 3.2: Verify the browser tab title**

Open `http://localhost:3000`. The browser tab should read:

```
Christiane & Stéphane
```

Not `Christiane & Stéphane | Christiane & Stéphane`.

---

### Task 4: Notre Histoire page (`app/pages/notre-histoire.vue`)

**Files:**

- Modify: `app/pages/notre-histoire.vue`

- [ ] **Step 4.1: Add `useSeoMeta` to `notre-histoire.vue`**

At the top of the `<script setup lang="ts">` block:

```ts
useSeoMeta({
  title: "Notre Histoire",
  description: "De Montréal aux Cinque Terre — l'histoire d'amour de Christiane et Stéphane, depuis 2019.",
});
```

- [ ] **Step 4.2: Verify the browser tab title**

Open `http://localhost:3000/notre-histoire`. The browser tab should read:

```
Notre Histoire | Christiane & Stéphane
```

---

### Task 5: Cérémonie page (`app/pages/ceremonie.vue`)

**Files:**

- Modify: `app/pages/ceremonie.vue`

- [ ] **Step 5.1: Add `useSeoMeta` to `ceremonie.vue`**

At the top of the `<script setup lang="ts">` block:

```ts
useSeoMeta({
  title: "La Cérémonie",
  description: "Tous les détails de nos cérémonies à Montréal et Cotonou : lieux, horaires et programme.",
});
```

- [ ] **Step 5.2: Verify the browser tab title**

Open `http://localhost:3000/ceremonie`. The browser tab should read:

```
La Cérémonie | Christiane & Stéphane
```

---

### Task 6: FAQ page (`app/pages/faq.vue`)

**Files:**

- Modify: `app/pages/faq.vue`

- [ ] **Step 6.1: Add `useSeoMeta` to `faq.vue`**

At the top of the `<script setup lang="ts">` block:

```ts
useSeoMeta({
  title: "FAQ",
  description: "Vos questions sur le mariage, le thème, le RSVP et les cadeaux — tout ce qu'il faut savoir.",
});
```

- [ ] **Step 6.2: Verify the browser tab title**

Open `http://localhost:3000/faq`. The browser tab should read:

```
FAQ | Christiane & Stéphane
```

---

### Task 7: RSVP page (`app/pages/rsvp.vue`)

**Files:**

- Modify: `app/pages/rsvp.vue`

- [ ] **Step 7.1: Add `useSeoMeta` to `rsvp.vue`**

At the top of the `<script setup lang="ts">` block:

```ts
useSeoMeta({
  title: "RSVP",
  description: "Confirmez votre présence à notre mariage avant le 15 août 2026.",
});
```

- [ ] **Step 7.2: Verify the browser tab title**

Open `http://localhost:3000/rsvp`. The browser tab should read:

```
RSVP | Christiane & Stéphane
```

---

## Chunk 3: Verification

### Task 8: Verify all meta tags with DevTools

- [ ] **Step 8.1: Check meta tags on each page**

For each page (`/`, `/notre-histoire`, `/ceremonie`, `/faq`, `/rsvp`):

1. Open the page in the browser
2. Open DevTools → Elements → inspect `<head>`
3. Confirm these tags are present (example for `/notre-histoire`):

```html
<!-- Title (changes per page) -->
<title>Notre Histoire | Christiane & Stéphane</title>

<!-- Description -->
<meta name="description" content="De Montréal aux Cinque Terre..." />

<!-- Robots (every page) -->
<meta name="robots" content="noindex, nofollow" />

<!-- Open Graph (inferred from above) -->
<meta property="og:title" content="Notre Histoire | Christiane & Stéphane" />
<meta property="og:description" content="De Montréal aux Cinque Terre..." />
<meta property="og:url" content="https://christiane-wedding.vercel.app/notre-histoire" />
<meta property="og:image" content="https://christiane-wedding.vercel.app/images/metadata-og.jpg" />
<meta property="og:type" content="website" />
<meta property="og:locale" content="fr_FR" />
<meta property="og:site_name" content="Christiane &amp; Stéphane" />

<!-- Twitter card -->
<meta name="twitter:card" content="summary_large_image" />
```

> **Note:** When running locally (`localhost:3000`), `og:url` will show `http://localhost:3000/...` and `og:image` may show a localhost URL — this is expected. On the deployed Vercel site it will use `site.url`.

---

### Task 9: Verify social sharing preview on deployed site

Deploy the changes to Vercel (push to the branch connected to Vercel, or use `vercel deploy`).

- [ ] **Step 9.1: Test with the Facebook Sharing Debugger**

Go to: `https://developers.facebook.com/tools/debug/`

Enter: `https://christiane-wedding.vercel.app/`

Click "Debug". Expected results:

- Title: `Christiane & Stéphane`
- Description: `Célébrez avec nous notre union...`
- Image: the landscape 1200×630 photo
- No warnings about missing tags

If you see a cached old preview, click "Scrape Again".

- [ ] **Step 9.2: Test with a real WhatsApp message (optional)**

Send the URL `https://christiane-wedding.vercel.app/` in a WhatsApp message to yourself. Within a few seconds, a link preview card should appear showing the couple photo and the site title.

- [ ] **Step 9.3: Verify the robots.txt on production**

Open: `https://christiane-wedding.vercel.app/robots.txt`

Expected:

```
User-agent: *
Disallow: /
```

---

### Task 10: Update `site.url` when domain is finalized (future)

When the final domain is set (e.g. `https://christiane-et-stephane.com`), this is the **only file** that needs updating:

```ts
// nuxt.config.ts
site: {
  url: "https://christiane-et-stephane.com",  // ← update this line only
  name: "Christiane & Stéphane",
  indexable: false,
},
```

The relative `ogImage` path (`/images/metadata-og.jpg`) will be automatically absolutized to the new domain — no other files need changing.
