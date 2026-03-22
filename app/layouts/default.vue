<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

import { AnimatePresence, motion } from "motion-v";

const route = useRoute();
const navigationItems = computed<NavigationMenuItem[]>(() => [
  {
    label: "Accueil",
    to: "/",
    active: route.path === "/",
  },
  {
    label: "Notre Histoire",
    to: "/notre-histoire",
    active: route.path.startsWith("/notre-histoire"),
  },
  {
    label: "Cérémonie",
    to: "/ceremonie",
    active: route.path.startsWith("/ceremonie"),
  },
  {
    label: "FAQ",
    to: "/faq",
    active: route.path.startsWith("/faq"),
  },
  {
    label: "RSVP",
    to: "/rsvp",
    active: route.path.startsWith("/rsvp"),
  },
]);

const isHomepage = computed(() => route.path === "/");

const showScrollTop = ref(false);

function onScroll() {
  showScrollTop.value = window.scrollY > 300;
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

onMounted(() => window.addEventListener("scroll", onScroll, { passive: true }));
onUnmounted(() => window.removeEventListener("scroll", onScroll));
</script>

<template>
  <div :class="{ 'h-screen overflow-hidden': isHomepage, 'min-h-screen': !isHomepage }">
    <Motion
      as-child
      :initial="{ y: -100 }"
      :animate="{ y: 0 }"
      :transition="{ duration: 0.6 }"
    >
      <UHeader
        mode="slideover"
        :ui="{ slideover: { side: 'right' } }"
        class="border-0 transition-all duration-300 w-full z-50"
        :class="[
          isHomepage
            ? 'absolute bg-transparent shadow-none backdrop-blur-none'
            : 'sticky top-0 bg-background/95 backdrop-blur-md shadow-sm',
        ]"
      >
        <template #title>
          <h1
            class="text-3xl items-center hover:text-primary transition-colors duration-200"
            :class="[
              isHomepage
                ? 'text-primary-foreground'
                : 'text-foreground',
            ]"
          >
            C & S
          </h1>
        </template>

        <UNavigationMenu
          :items="navigationItems"
          :highlight="true"
          variant="link"
          :ui="{
            link: [
              'transition-colors duration-200',
              // Dynamic styles based on isHomepage
              isHomepage
                ? 'text-primary-foreground/80 hover:text-primary-foreground data-[active]:text-primary-foreground data-[active]:after:bg-primary-foreground'
                : 'text-foreground/80 hover:text-primary data-[active]:text-primary data-[active]:after:bg-primary',
            ],
          }"
        />

        <!-- Mobile Menu Button -->
        <template #toggle="{ open, toggle }">
          <Motion
            as-child
            :initial="{
              opacity: 0,
              y: -20,
            }"
            :animate="{
              opacity: 1,
              y: 0,
              scale: open ? 0.9 : 1,
              rotate: open ? 90 : 0,
            }"
            :transition="{
              type: 'spring',
              stiffness: 300,
              damping: 20,
            }"
          >
            <UButton
              variant="ghost"
              color="primary"
              size="xl"
              :icon="open ? 'i-lucide-x' : 'i-lucide-menu'"
              class="lg:hidden"
              :class="isHomepage ? 'text-ivory hover:text-ivory/80' : ''"
              aria-label="Menu"
              @click="toggle"
            />
          </Motion>
        </template>
        <!-- Mobile Navigation -->
        <template #body>
          <UNavigationMenu
            :items="navigationItems"
            orientation="vertical"
            class="-mx-2.5"
            :ui="{
              link: 'font-body text-lg text-ivory/70 hover:text-ivory data-[active]:text-sable transition-colors duration-200 py-3 border-b border-sable/10',
              list: 'gap-0',
            }"
          />
          <div class="mt-auto pt-12 text-center">
            <p class="font-display text-3xl text-sable/30 italic select-none">
              C & S
            </p>
            <p class="font-body text-xs text-ivory/20 tracking-widest uppercase mt-1">
              20 Juin · 19 Décembre 2026
            </p>
          </div>
        </template>
      </UHeader>
    </Motion>

    <UMain>
      <slot />
    </UMain>

    <UFooter
      v-if="!isHomepage"
      class="bg-marine border-t border-white/10 pt-12 pb-4"
      :ui="{
        top: 'py-0', // Reduce default top padding if needed
        bottom: 'py-0', // Overrides the py-8 lg:py-12 from your app.config.ts
        container: 'flex flex-col items-center justify-center',
      }"
    >
      <template #top>
        <div class="flex flex-col items-center text-center">
          <h3 class="font-display text-3xl md:text-4xl text-ivory mb-4">
            Christiane
            <span class="text-sable italic">&</span>
            Stéphane
          </h3>

          <div
            class="font-body text-sm tracking-widest text-ivory/50 mb-6 flex flex-col md:flex-row items-center gap-2 md:gap-4"
          >
            <span>20 Juin 2026 • Montréal</span>
            <span class="hidden md:block text-sable/40">•</span>
            <span>17 Décembre 2026 • Cotonou</span>
            <span class="hidden md:block text-sable/40">•</span>
            <span>19 Décembre 2026 • Cotonou</span>
          </div>

          <div class="flex items-center justify-center gap-2 text-sable/80">
            <span class="text-sm uppercase tracking-tighter">Fait avec</span>
            <UIcon
              name="i-lucide-heart"
              size="14"
              class="fill-current animate-pulse text-sable"
            />
            <span class="text-sm uppercase tracking-tighter">pour notre grand jour</span>
          </div>
        </div>
      </template>

      <template #bottom>
        <div class="w-full border-t border-ivory/10 pt-8 flex flex-col items-center gap-3">
          <div class="flex items-center gap-4 font-body text-xs text-ivory/30 tracking-widest uppercase">
            <NuxtLink to="/mentions-legales" class="underline hover:text-ivory/60 transition-colors duration-200">
              Mentions légales
            </NuxtLink>
            <span class="text-ivory/20">•</span>
            <NuxtLink
              to="/politique-de-confidentialite"
              class="underline hover:text-ivory/60 transition-colors duration-200"
            >
              Politique de confidentialité
            </NuxtLink>
          </div>
          <p class="font-body text-xs text-ivory/30 tracking-widest text-center uppercase">
            © {{ new Date().getFullYear() }} <a
              href="https://luminaconsulting.fr"
              target="_blank"
              rel="noopener noreferrer"
              class="underline hover:text-ivory/60 transition-colors duration-200"
            >Lumina
              Consulting</a>. Tous droits réservés.
          </p>
        </div>
      </template>
    </UFooter>
    <!-- Scroll to top — mobile only -->
    <Teleport to="body">
      <AnimatePresence>
        <motion.button
          v-if="showScrollTop && !isHomepage"
          :initial="{ opacity: 0, scale: 0.7, y: 10 }"
          :animate="{ opacity: 1, scale: 1, y: 0 }"
          :exit="{ opacity: 0, scale: 0.7, y: 10 }"
          :transition="{ duration: 0.25, type: 'spring', stiffness: 300, damping: 22 }"
          :while-tap="{ scale: 0.9 }"
          class="md:hidden fixed bottom-6 right-5 z-50 size-11 rounded-full bg-sable text-ivory shadow-lg flex items-center justify-center"
          aria-label="Retour en haut"
          @click="scrollToTop"
        >
          <UIcon name="i-lucide-arrow-up" size="18" />
        </motion.button>
      </AnimatePresence>
    </Teleport>
  </div>
</template>
