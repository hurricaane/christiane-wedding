// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

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
  modules: [
    "@nuxt/eslint",
    "@nuxt/ui",
    "motion-v/nuxt",
    "@nuxt/image",
  ],
  // Module Configuration
  eslint: {
    config: {
      standalone: false,
    },
  },
});
