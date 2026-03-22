# Google Static Maps Integration Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace hardcoded, approximate Google Maps iframe embed URLs in the ceremony page with server-side rendered static map images, keeping the API key fully server-side.

**Architecture:** A Nuxt server GET route (`/api/map-image`) accepts an address query param, validates it against a whitelist of the 6 known ceremony addresses, fetches a static map image from the Google Static Maps API, caches the binary in memory, and returns it as `image/png`. The ceremony page modal replaces its `<iframe>` with an `<img>` pointing at this route, plus an "Open in Google Maps" external link.

**Tech Stack:** Nuxt 4, Nitro (H3), TypeScript, Google Static Maps API, native `fetch`

**Spec:** `docs/superpowers/specs/2026-03-22-google-static-maps-design.md`

---

## Chunk 1: Server route and frontend

### Task 1: Add API key to .env

**Files:**
- Modify: `.env`
- Modify: `shared/lib/env.ts` (tighten validation)

- [ ] **Step 1: Add the key to `.env`**

  Add this line to your `.env` file (replace with your actual key from Google Cloud Console):

  ```
  GOOGLE_MAPS_API_KEY=AIzaSy...
  ```

- [ ] **Step 2: Tighten the Zod schema**

  In `shared/lib/env.ts`, the key is already declared as `z.string()`. Change it to reject empty strings:

  ```ts
  GOOGLE_MAPS_API_KEY: z.string().min(1),
  ```

- [ ] **Step 3: Verify the dev server starts without errors**

  ```bash
  pnpm dev
  ```

  Expected: server starts, no "Missing required values in .env" error in the terminal.

---

### Task 2: Create the server route

**Files:**
- Create: `server/api/map-image.get.ts`

- [ ] **Step 1: Create the file with the whitelist and cache**

  ```ts
  import env from "#shared/lib/env";

  const ALLOWED_ADDRESSES = new Set(
    [
      "424 Rue St-Sulpice, Montréal QC H2Y 2V5",
      "Vieux-Port, Montréal, Canada",
      "Cotonou, Bénin",
      "Rue 407, Cotonou, Bénin",
      "Boulevard de la Marina, Cotonou, Bénin",
    ].map(s => s.trim().toLowerCase()),
  );

  const imageCache = new Map<string, Buffer>();

  export default defineEventHandler(async (event) => {
    const { address } = getQuery(event);

    if (typeof address !== "string" || !address.trim()) {
      throw createError({ statusCode: 400, message: "Missing address" });
    }

    const normalized = address.trim().toLowerCase();

    if (!ALLOWED_ADDRESSES.has(normalized)) {
      throw createError({ statusCode: 400, message: "Address not allowed" });
    }

    if (!env) {
      throw createError({ statusCode: 500, message: "Server misconfiguration" });
    }

    const cached = imageCache.get(normalized);
    if (cached) {
      setResponseHeader(event, "Content-Type", "image/png");
      setResponseHeader(event, "Cache-Control", "public, max-age=86400");
      return cached;
    }

    const url = new URL("https://maps.googleapis.com/maps/api/staticmap");
    // Use address.trim() (not normalized) to preserve correct casing for Google geocoding;
    // normalized is only used for cache/whitelist lookup.
    url.searchParams.set("center", address.trim());
    url.searchParams.set("markers", `color:red|${address.trim()}`);
    url.searchParams.set("zoom", "15");
    url.searchParams.set("size", "800x450");
    url.searchParams.set("scale", "2");
    url.searchParams.set("maptype", "roadmap");
    url.searchParams.set("format", "png");
    url.searchParams.set("key", env.GOOGLE_MAPS_API_KEY);

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw createError({ statusCode: 500, message: "Failed to fetch map from Google" });
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.startsWith("image/")) {
      throw createError({ statusCode: 500, message: "Unexpected response from Google Maps API" });
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    imageCache.set(normalized, buffer);

    setResponseHeader(event, "Content-Type", "image/png");
    setResponseHeader(event, "Cache-Control", "public, max-age=86400");
    return buffer;
  });
  ```

- [ ] **Step 2: Verify the route works manually**

  With `pnpm dev` running, open in the browser:

  ```
  http://localhost:3000/api/map-image?address=424%20Rue%20St-Sulpice%2C%20Montr%C3%A9al%20QC%20H2Y%202V5
  ```

  Expected: a static map image appears in the browser (zoomed in on the Basilique Notre-Dame area in Montréal).

- [ ] **Step 3: Verify whitelist rejection**

  Open:

  ```
  http://localhost:3000/api/map-image?address=1600+Pennsylvania+Ave
  ```

  Expected: `400` error response.

- [ ] **Step 4: Verify caching (check server terminal)**

  Open the same address URL from Step 2 a second time. Expected: no new outbound request to `maps.googleapis.com` visible in the Nuxt server terminal — the response comes from the in-memory cache.

---

### Task 3: Update the ceremony page

**Files:**
- Modify: `app/pages/ceremonie.vue`

- [ ] **Step 1: Remove `mapUrl` from the type and data**

  In the `<script setup>` block:

  1. Remove `mapUrl: string;` from the `CeremonyEvent` type
  2. Remove all `mapUrl: "..."` lines from `ceremonyData` (6 lines total — 3 in `montreal`, 3 in `cotonou`)

- [ ] **Step 2: Add `mapError` ref and reset it in `openMap`**

  Add this ref alongside the existing ones:

  ```ts
  const mapError = ref(false);
  ```

  Update `openMap` to reset the error before opening:

  ```ts
  function openMap(event: CeremonyEvent) {
    mapError.value = false;
    selectedEvent.value = event;
    isModalOpen.value = true;
  }
  ```

- [ ] **Step 3: Replace the iframe with the static image and link**

  Find this block in the template:

  ```html
  <div class="relative w-full h-[60vh]">
    <iframe
      v-if="selectedEvent"
      :src="selectedEvent.mapUrl"
      width="100%"
      height="100%"
      style="border: 0"
      allowfullscreen
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
    />
  </div>
  ```

  Replace it with:

  ```html
  <div class="relative w-full h-[60vh]">
    <img
      v-if="selectedEvent && !mapError"
      :src="`/api/map-image?address=${encodeURIComponent(selectedEvent.location)}`"
      class="w-full h-full object-cover"
      alt="Carte"
      @error="mapError = true"
    />
    <div
      v-else-if="mapError"
      class="w-full h-full flex items-center justify-center font-body text-sm text-muted-foreground"
    >
      Impossible de charger la carte.
    </div>
    <a
      v-if="selectedEvent"
      :href="`https://maps.google.com/?q=${encodeURIComponent(selectedEvent.location)}`"
      target="_blank"
      rel="noopener noreferrer"
      class="absolute bottom-4 right-4 px-4 py-2 rounded-full bg-ivory-dark text-marine text-sm font-body font-semibold shadow hover:bg-sable/30 transition-colors"
    >
      Ouvrir dans Google Maps →
    </a>
  </div>
  ```

- [ ] **Step 4: Verify the full flow in the browser**

  With `pnpm dev` running:

  1. Navigate to `/ceremonie`
  2. Click "View Map" on each of the 6 event cards
  3. Verify: static map image loads in the modal showing the correct area
  4. Verify: "Ouvrir dans Google Maps →" link appears and opens the right location in a new tab
  5. Click "View Map" on an event you already opened — verify no new Google API call in the server terminal (cache hit)
  6. Verify: the error state — temporarily break the route (e.g., add an early `throw createError({ statusCode: 500 })`) and confirm the modal shows "Impossible de charger la carte." instead of a broken image icon. Revert the break after testing.
