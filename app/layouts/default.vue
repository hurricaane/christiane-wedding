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
const isScrolled = ref(false);

function handleScroll() {
  isScrolled.value = window.scrollY > 50;
}

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<template>
  <div class="min-h-screen">
    <Motion
      as-child
      :initial="{ y: -100 }"
      :animate="{ y: 0 }"
      :transition="{ duration: 0.6 }"
    >
      <UHeader
        mode="drawer"
        class="border-0 transition-all duration-300"
        :class="[
          isScrolled
            ? 'bg-background/95 backdrop-blur-md shadow-sm'
            : 'bg-transparent',
        ]"
      >
        <template #title>
          <h1
            class="text-3xl items-center transition-colors duration-200"
            :class="[
              isScrolled
                ? 'text-foreground hover:text-primary'
                : 'text-foreground hover:text-gold-light',
            ]"
          >
            C & S
          </h1>
        </template>

        <UNavigationMenu
          :items="navigationItems"
          :highlight="true"
          variant="link"
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
    <slot />
    <UFooter />
  </div>
</template>
