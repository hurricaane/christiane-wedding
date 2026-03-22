import env from "#shared/lib/env";
import { Buffer } from "node:buffer";

const ALLOWED_ADDRESSES = new Set(
  [
    "424 Rue St-Sulpice, Montréal QC H2Y 2V5",
    "Vieux-Port, Montréal, Canada",
    "Cotonou, Bénin",
    "9C8F+9F2, Rue 407, Cotonou, Benin",
    "89XX+78C, Boulevard de la Marina, Cotonou, Benin",
  ].map(s => s.trim().toLowerCase()),
);

// Per-process cache — lost on restart. CDN/browser caching via Cache-Control handles persistence.
const imageCache = new Map<string, { buffer: Buffer<ArrayBuffer>; contentType: string }>();

export default defineEventHandler(async (event) => {
  const { address } = getQuery(event);

  if (typeof address !== "string" || !address.trim()) {
    throw createError({ statusCode: 400, message: "Missing address" });
  }

  const trimmedAddress = address.trim();
  const normalized = trimmedAddress.toLowerCase();

  if (!ALLOWED_ADDRESSES.has(normalized)) {
    throw createError({ statusCode: 400, message: "Address not allowed" });
  }

  if (!env) {
    throw createError({ statusCode: 500, message: "Server misconfiguration" });
  }

  const cached = imageCache.get(normalized);
  if (cached) {
    setResponseHeader(event, "Content-Type", cached.contentType);
    setResponseHeader(event, "Cache-Control", "public, max-age=86400");
    return cached.buffer;
  }

  const url = new URL("https://maps.googleapis.com/maps/api/staticmap");
  // trimmedAddress preserves original casing for Google geocoding; normalized is used only for cache/whitelist
  url.searchParams.set("center", trimmedAddress);
  url.searchParams.set("markers", `color:red|${trimmedAddress}`);
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
  imageCache.set(normalized, { buffer, contentType });

  setResponseHeader(event, "Content-Type", contentType);
  setResponseHeader(event, "Cache-Control", "public, max-age=86400");
  return buffer;
});
