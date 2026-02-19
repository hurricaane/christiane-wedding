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
  app: {
    head: {
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
  // Module Configuration
  eslint: {
    config: {
      standalone: false,
    },
  },
});
