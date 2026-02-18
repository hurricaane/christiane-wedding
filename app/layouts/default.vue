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
              isHomepage && 'text-primary-foreground/80 hover:text-primary-foreground data-[active]:text-primary-foreground data-[active]:after:bg-primary-foreground',
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

    <UFooter v-if="!isHomepage" />
  </div>
</template>
