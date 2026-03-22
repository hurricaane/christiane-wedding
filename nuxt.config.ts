// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";

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
  nitro: {
    rollupConfig: {
      plugins: [
        vue(),
      ],
    },
  },
  app: {
    head: {
      titleTemplate: "%s | Christiane & Stéphane",
      link: [
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      ],
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
  site: {
    url: "https://christiane-et-stephane.luminaconsulting.fr",
    name: "Christiane & Stéphane",
    indexable: false,
  },
  seo: {
    meta: {
      description: "Célébrez avec nous notre union à Montréal le 20 juin 2026 et à Cotonou le 19 décembre 2026.",
      ogImage: "/images/metadata-image.jpg",
      ogType: "website",
      twitterCard: "summary_large_image",
      ogLocale: "fr_FR",
    },
  },
});
