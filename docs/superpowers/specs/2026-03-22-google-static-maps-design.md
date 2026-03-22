# Google Static Maps Integration for Ceremony Page

**Date:** 2026-03-22
**Status:** Approved

---

## Overview

Replace the current hardcoded, approximate Google Maps embed iframe URLs in the ceremony page with server-side rendered static map images via the Google Static Maps API. The API key never leaves the server. Results are cached in memory to avoid redundant API calls.

---

## Architecture

### Flow

1. User clicks "View Map" on an event card → modal opens
2. Modal renders `<img src="/api/map-image?address=...">` instead of an `<iframe>`
3. The Nuxt server route `/api/map-image` checks an in-memory cache keyed by address string (normalized: trimmed + lowercased)
4. **Cache miss:** fetches the image from Google Static Maps API, validates the response, stores the binary buffer in the cache, returns it as `image/png`
5. **Cache hit:** returns the stored buffer directly — no Google API call
6. Modal shows an "Open in Google Maps →" link using `https://maps.google.com/?q=ADDRESS` (no API key required)

The `GOOGLE_MAPS_API_KEY` is server-side only. The client never sees it — only the `/api/map-image` URL appears in the DOM.

### File Changes

```
shared/lib/
  env.ts                          # Add GOOGLE_MAPS_API_KEY to Zod schema

server/api/
  map-image.get.ts                # New: serves cached static map images

app/pages/
  ceremonie.vue                   # Replace iframe modal with <img> + link
```

---

## Environment

**`shared/lib/env.ts`:** add `GOOGLE_MAPS_API_KEY: z.string().min(1)` to the existing Zod schema.

**`.env`:** add `GOOGLE_MAPS_API_KEY=<your_key>`.

The key must have the **Static Maps API** enabled in Google Cloud Console. Restrict the key using either an **IP address restriction** (lock to the server's egress IP) or an **API restriction** (limit to Static Maps API only). Do not use HTTP referrer restriction — this key is used server-to-server and browsers do not send a `Referer` header for these calls. Also set a monthly quota cap in Google Cloud Console to limit blast radius if the key is ever compromised.

---

## Server Route: `server/api/map-image.get.ts`

**Query param:** `address` (URL-encoded string, required)

### Address whitelist

The route only accepts addresses matching the 6 known ceremony locations. Declare a `Set<string>` of allowed addresses at module level (using the exact strings from `ceremonyData`). Any request whose trimmed address is not in the set → `400`. This prevents the server from being used as a proxy to query arbitrary Google Maps locations and protects API quota.

### Cache

Module-level `Map<string, Buffer>`. Cache key: `address.trim().toLowerCase()`. Lazy-loaded — populated on first request per address. Lives for the lifetime of the server process. No persistence needed for 6 fixed addresses.

### Handler steps

1. Read `address` from query params via `getQuery`
2. Trim the value; if empty or not in the whitelist → `throw createError({ statusCode: 400 })`
3. Guard: `if (!env) throw createError({ statusCode: 500, message: 'Server misconfiguration' })` — matches the pattern used in `server/api/rsvp.post.ts`
4. Check cache; if hit → return cached buffer
5. Fetch from Google Static Maps API:

```
https://maps.googleapis.com/maps/api/staticmap
  ?center=ADDRESS
  &markers=color:red|ADDRESS
  &zoom=15
  &size=800x450
  &scale=2
  &maptype=roadmap
  &key=GOOGLE_MAPS_API_KEY
```

6. If the response status is not 200 → `throw createError({ statusCode: 500 })`
7. Check `response.headers.get('content-type')` starts with `image/` — Google returns `application/json` with an error body for certain failure modes (invalid key, quota exceeded) even on HTTP 200. If not an image type → `throw createError({ statusCode: 500 })`
8. Read response as `Buffer`, store in cache under the normalized key
9. Set response headers: `Content-Type: image/png` and `Cache-Control: public, max-age=86400` (1 day — allows browsers to cache across sessions)
10. Return the buffer

**Error handling summary:**
- Missing or empty `address` → `400`
- Address not in whitelist → `400`
- `env` undefined → `500`
- Google API non-200 → `500`
- Google API returns non-image content type → `500`

---

## Frontend Changes: `app/pages/ceremonie.vue`

### Type change

Remove `mapUrl` from `CeremonyEvent`:

```ts
type CeremonyEvent = {
  id: string;
  time: string;
  title: string;
  venue: string;
  location: string;
  icon: string;
  imageUrl: string;
  // mapUrl removed
};
```

### Data change

Remove all `mapUrl` values from `ceremonyData` (6 events total).

### Modal content change

Replace the `<iframe>` block with:

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
    class="w-full h-full flex items-center justify-center text-muted-foreground font-body text-sm"
  >
    Impossible de charger la carte.
  </div>
  <a
    v-if="selectedEvent"
    :href="`https://maps.google.com/?q=${encodeURIComponent(selectedEvent.location)}`"
    target="_blank"
    rel="noopener noreferrer"
    class="absolute bottom-4 right-4 ..."
  >
    Ouvrir dans Google Maps →
  </a>
</div>
```

Add `const mapError = ref(false)` to the script. Reset `mapError.value = false` when `openMap` is called (before the modal opens with a new event).

The "Open in Google Maps" link is styled as a small pill button consistent with the site's warm palette (cream background, marine text), matching the existing design system.

`EventCard` requires no changes — it only emits `open-map` with the event object.

---

## Success Criteria

- Static map image loads correctly in the modal for all 6 ceremony locations
- `GOOGLE_MAPS_API_KEY` does not appear anywhere in the client bundle, DOM, or network responses
- Second request for the same address is served from cache (no Google API call)
- Requests for addresses not in the whitelist are rejected with a 400
- "Open in Google Maps →" link opens the correct location in a new tab
- If the map image fails to load, the modal shows a French error message instead of a broken image
- No `mapUrl` field remains in the ceremony data or `CeremonyEvent` type
