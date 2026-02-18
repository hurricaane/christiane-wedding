<script setup lang="ts">
import { motion, useInView } from "motion-v";

const headerRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);
const timelineRef = ref<HTMLElement | null>(null);

const headerInView = useInView(headerRef, { once: true, margin: "-100px" });
const contentInView = useInView(contentRef, { once: true, margin: "-100px" });
const timelineInView = useInView(timelineRef, { once: true, margin: "-100px" });

const timeline = [
  {
    title: "La Rencontre",
    subtitle: "Le début de tout",
    place: "Dakar, 2021",
    description: "Un premier regard échangé sous les baobabs.",
    icon: "i-lucide-heart",
  },
  {
    title: "Le Premier Rendez-vous",
    subtitle: "Une soirée magique",
    place: "Almadies, 2022",
    description: "Dîner face à l'océan, des heures de discussion.",
    icon: "i-lucide-utensils",
  },
  {
    title: "La Demande",
    subtitle: "Le “Oui” tant attendu",
    place: "Île de Gorée, 2024",
    description:
      "Un moment suspendu dans le temps, entre histoire et futur.",
    icon: "i-lucide-gem",
    highlight: true,
  },
  {
    title: "Le Grand Jour",
    subtitle: "Unis pour la vie",
    place: "Dakar, 2026",
    description:
      "Entourés de nos proches, nous célébrerons notre union.",
    icon: "i-lucide-party-popper",
  },
];
</script>

<template>
  <section class="section-padding bg-linear-to-t from-background to-ivory-dark">
    <motion.div
      ref="headerRef"
      :initial="{ opacity: 0, y: 40 }"
      :animate="headerInView ? { opacity: 1, y: 0 } : {}"
      :transition="{ duration: 0.8 }"
      class="text-center"
    >
      <p
        class="font-body text-sm tracking-widest uppercase px-4 py-1 rounded-full bg-primary/10 font-bold inline-block text-primary mb-4"
      >
        Depuis 2021
      </p>

      <h2 class="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
        Notre <span class="text-primary">Histoire</span>
      </h2>

      <div class="flex items-center justify-center gap-4">
        <div class="w-16 h-px bg-primary" />
        <UIcon
          name="i-lucide-heart"
          class="text-primary"
          size="20"
        />
        <div class="w-16 h-px bg-primary" />
      </div>
    </motion.div>

    <motion.section
      ref="contentRef"
      :initial="{ opacity: 0, y: 40 }"
      :animate="contentInView ? { opacity: 1, y: 0 } : {}"
      :transition="{ duration: 0.8, delay: 0.2 }"
      class="max-w-300 mx-auto px-6 py-16 md:py-24"
    >
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div class="relative group">
          <div
            class="absolute -inset-4 bg-primary/5 rounded-xl -rotate-2 group-hover:rotate-0 transition-transform duration-500"
          />
          <div class="relative aspect-4/5 overflow-hidden rounded-xl shadow-2xl">
            <div class="absolute inset-0 bg-linear-to-t from-background/40 to-transparent z-10" />
            <NuxtImg
              src="/images/story-couple.jpg"
              alt="Christiane & Stéphane - Histoire Couple"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>
          <div
            class="absolute -bottom-6 -right-6 hidden md:flex items-center justify-center w-24 h-24 bg-primary rounded-full shadow-xl border-4 border-background text-white rotate-12"
          >
            <Icon name="i-lucide-heart" size="36" />
          </div>
        </div>

        <div class="flex flex-col gap-8">
          <div>
            <h3 class="text-2xl md:text-3xl font-bold text-primary mb-6">
              D'une rencontre à Dakar vers l'éternité
            </h3>

            <div class="space-y-6 text-lg leading-relaxed text-muted-foreground">
              <p>
                Notre voyage a commencé dans les rues animées de Dakar. Entre les
                couchers de soleil sur la Corniche et les moments partagés en
                famille, notre amour a grandi.
              </p>
              <p>
                Ensemble, nous avons exploré, rêvé, construit un foyer rempli de
                projets et de promesses.
              </p>
              <p>
                Nous sommes impatients de célébrer ce nouveau chapitre avec vous,
                là où tout a commencé.
              </p>
            </div>
          </div>
          <div class="grid grid-cols-3 gap-4 border-t-3 border-primary/50 pt-8">
            <div class="text-center">
              <p class="text-primary font-bold text-2xl">
                5
              </p>
              <p class="text-xs uppercase opacity-60">
                Années
              </p>
            </div>
            <div class="text-center border-x-2 border-primary/50">
              <p class="text-primary font-bold text-2xl">
                100+
              </p>
              <p class="text-xs uppercase opacity-60">
                Couchers de soleil
              </p>
            </div>
            <div class="text-center">
              <p class="text-primary font-bold text-2xl">
                1
              </p>
              <p class="text-xs uppercase opacity-60">
                Engagement
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>

    <motion.section
      ref="timelineRef"
      :initial="{ opacity: 0, y: 40 }"
      :animate="timelineInView ? { opacity: 1, y: 0 } : {}"
      :transition="{ duration: 0.8 }"
      class="max-w-240 mx-auto px-6 py-16 bg-background rounded-3xl shadow-sm border border-primary/5"
    >
      <h3 class="text-center text-2xl font-bold mb-12 text-secondary/90">
        Les Étapes Clés
      </h3>

      <div class="grid grid-cols-[40px_1fr] md:grid-cols-[1fr_40px_1fr] gap-x-6 md:gap-x-10">
        <template v-for="(item, i) in timeline" :key="i">
          <div class="hidden md:flex flex-col justify-center text-right">
            <p class="text-primary font-bold">
              {{ item.title }}
            </p>
            <p class="text-sm italic opacity-60">
              {{ item.subtitle }}
            </p>
          </div>

          <div class="flex flex-col items-center gap-1">
            <div
              class="flex items-center justify-center size-10 rounded-full"
              :class="item.highlight
                ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                : 'bg-primary/20 text-primary'"
            >
              <Icon :name="item.icon" size="20" />
            </div>
            <div v-if="i < timeline.length - 1" class="w-px h-16 bg-primary/10" />
          </div>

          <div class="flex flex-col justify-center pb-12 md:pb-0">
            <p class="md:hidden text-primary font-bold">
              {{ item.title }}
            </p>
            <p class="font-medium text-secondary">
              {{ item.place }}
            </p>
            <p class="text-sm opacity-70 mt-1">
              {{ item.description }}
            </p>
          </div>
        </template>
      </div>
    </motion.section>
  </section>
</template>
