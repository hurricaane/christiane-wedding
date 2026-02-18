<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

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
    label: "RSVP",
    to: "/rsvp",
    active: route.path.startsWith("/rsvp"),
  },
]);

const isHomepage = computed(() => route.path === "/");
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
        mode="drawer"
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
          />
        </template>
      </UHeader>
    </Motion>

    <UMain>
      <slot />
    </UMain>

    <UFooter
      v-if="!isHomepage"
      class="bg-charcoal border-t border-white/10 pt-12 pb-4"
      :ui="{
        top: 'py-0', // Reduce default top padding if needed
        bottom: 'py-0', // Overrides the py-8 lg:py-12 from your app.config.ts
        container: 'flex flex-col items-center justify-center',
      }"
    >
      <template #top>
        <div class="flex flex-col items-center text-center">
          <h3 class="font-display text-3xl md:text-4xl text-white mb-4">
            Christiane
            <span class="text-primary italic">&</span>
            Stéphane
          </h3>

          <div
            class="font-body text-sm tracking-widest text-white/60 mb-6 flex flex-col md:flex-row items-center gap-2 md:gap-4"
          >
            <span>20 Juin 2026 • Montréal</span>
            <span class="hidden md:block opacity-30">|</span>
            <span>15 Décembre 2026 • Cotonou</span>
          </div>

          <div class="flex items-center justify-center gap-2 text-primary">
            <span class="text-sm uppercase tracking-tighter">Fait avec</span>
            <UIcon
              name="i-lucide-heart"
              size="14"
              class="fill-current animate-pulse"
            />
            <span class="text-sm uppercase tracking-tighter">pour notre grand jour</span>
          </div>
        </div>
      </template>

      <template #bottom>
        <div class="w-full border-t-2 border-primary-foreground/10 pt-8">
          <p class="font-body text-xs text-primary-foreground/40 tracking-widest text-center uppercase">
            © {{ new Date().getFullYear() }} Lumina Consulting. Tous droits réservés.
          </p>
        </div>
      </template>
    </UFooter>
  </div>
</template>
