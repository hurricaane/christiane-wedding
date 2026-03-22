<script setup lang="ts">
import { motion, useInView } from "motion-v";

useSeoMeta({
  title: "Notre Histoire",
  description: "De Montréal aux Cinque Terre — l'histoire d'amour de Christiane et Stéphane, depuis 2019.",
});

const headerRef = ref<HTMLElement | null>(null);
const contentRef = ref<HTMLElement | null>(null);
const timelineRef = ref<HTMLElement | null>(null);

const headerInView = useInView(headerRef, { once: true, margin: "-100px" });
const contentInView = useInView(contentRef, { once: true, margin: "-100px" });
const timelineInView = useInView(timelineRef, { once: true, margin: "-100px" });

const timeline = [
  {
    title: "La Rencontre",
    subtitle: "L'été qui a tout changé",
    place: "Montréal, 2019",
    description: "Un premier regard échangé dans l'appartement d'un ami commun, puis une rencontre fortuite devant la gare routière de Montréal — on ne s'est plus quittés.",
    icon: "i-lucide-heart",
  },
  {
    title: "Le Premier Rendez-vous",
    subtitle: "Le début d'une belle série",
    place: "Montréal, 15 juin 2019",
    description: "Un dîner au Randolph dans le Quartier Latin, organisé en prélude à mon anniversaire. Le début d'une longue série de moments précieux, tombant amoureux doucement et passionnément.",
    icon: "i-lucide-utensils",
  },
  {
    title: "Les Fiançailles",
    subtitle: "Le grand « Oui »",
    place: "Manarola, 3 septembre 2025",
    description: "Parmi les vignes de Manarola, il s'est agenouillé. Submergée de surprise, d'émotion et de joie, j'ai dit oui de tout mon cœur.",
    icon: "i-lucide-gem",
    highlight: true,
  },
  {
    title: "Le Grand Jour",
    subtitle: "Unis pour la vie",
    place: "Montréal 2026 & Cotonou 2026",
    description: "Entourés de nos proches, nous célébrerons notre union.",
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
        class="font-body text-sm tracking-widest uppercase px-4 py-1 rounded-full bg-marine/10 font-bold inline-block text-marine mb-4"
      >
        Depuis 2019
      </p>

      <h2 class="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
        Notre Histoire
      </h2>

      <div class="flex items-center justify-center gap-4">
        <div class="w-16 h-px bg-sable/60" />
        <UIcon
          name="i-lucide-heart"
          class="text-sable"
          size="20"
        />
        <div class="w-16 h-px bg-sable/60" />
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
            class="absolute -inset-4 bg-marine/5 rounded-xl -rotate-2 group-hover:rotate-0 transition-transform duration-500"
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
            class="absolute -bottom-6 -right-6 hidden md:flex items-center justify-center w-24 h-24 bg-sable rounded-full shadow-xl border-4 border-background text-ivory rotate-12"
          >
            <Icon name="i-lucide-heart" size="36" />
          </div>
        </div>

        <div class="flex flex-col gap-8">
          <div>
            <h3 class="text-2xl md:text-3xl font-bold text-marine mb-6">
              Un amour bâti à deux
            </h3>

            <div class="space-y-6 text-lg leading-relaxed text-muted-foreground">
              <p>
                À l'été 2019, leurs regards se croisent dans l'appartement d'un ami commun. Ils ignorent encore que
                ce moment marquera le début de leur histoire. Peu après, la main de Dieu les réunit devant la gare
                d'autobus de Montréal : d'abord presque comme des inconnus, ils se découvrent très vite comme une
                évidence.
              </p>
              <p>
                S'ensuit leur premier rendez-vous au Randolph du Quartier Latin, où leur histoire commence
                véritablement. Rencontre après rencontre, ils apprennent à se connaître, dévoilent leurs
                personnalités et tombent amoureux, lentement et passionnément.
              </p>
              <p>
                Six ans plus tard, leur amour les mène jusqu'aux paysages enchanteurs des Cinque Terre. C'est à
                Manarola qu'à l'automne 2025, surplombant les vignobles et la mer, leur histoire prend un nouveau
                tournant. Une demande en mariage inattendue, un genou à terre, et un « oui » rempli d'émotion.
              </p>
              <p>
                Depuis ce jour, ils sont prêts à choisir chaque jour de s'aimer pour toujours, en scellant leur
                union en 2026, entourés de leurs proches.
              </p>
            </div>
          </div>
          <div class="grid grid-cols-3 gap-4 border-t border-marine/20 pt-8">
            <div class="text-center">
              <p class="text-sable font-bold text-2xl">
                7
              </p>
              <p class="text-xs uppercase text-marine/50 tracking-wider">
                Années
              </p>
            </div>
            <div class="text-center border-x border-marine/20">
              <p class="text-sable font-bold text-2xl">
                2
              </p>
              <p class="text-xs uppercase text-marine/50 tracking-wider">
                Continents
              </p>
            </div>
            <div class="text-center">
              <p class="text-sable font-bold text-2xl">
                1
              </p>
              <p class="text-xs uppercase text-marine/50 tracking-wider">
                Fiançailles
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
      class="max-w-240 mx-auto px-6 py-16 bg-card rounded-3xl shadow-md border border-marine/10"
    >
      <h3 class="text-center text-2xl font-bold mb-12 text-marine">
        Les Étapes Clés
      </h3>

      <div class="grid grid-cols-[40px_1fr] md:grid-cols-[1fr_40px_1fr] gap-x-6 md:gap-x-10">
        <template v-for="(item, i) in timeline" :key="i">
          <div class="hidden md:flex flex-col justify-center text-right md:py-6">
            <p class="text-marine font-bold">
              {{ item.title }}
            </p>
            <p class="text-sm italic text-muted-foreground">
              {{ item.subtitle }}
            </p>
          </div>

          <div class="flex flex-col items-center gap-1 self-stretch">
            <div
              class="flex items-center justify-center size-10 rounded-full shrink-0"
              :class="item.highlight
                ? 'bg-sable text-ivory ring-4 ring-sable/25 shadow-md'
                : 'bg-marine/10 text-marine'"
            >
              <Icon :name="item.icon" size="20" />
            </div>
            <div v-if="i < timeline.length - 1" class="w-px flex-1 min-h-8 bg-marine/15" />
          </div>

          <div class="flex flex-col justify-center pb-12 md:py-6">
            <p class="md:hidden text-marine font-bold">
              {{ item.title }}
            </p>
            <p class="font-medium text-olive">
              {{ item.place }}
            </p>
            <p class="text-sm text-muted-foreground mt-1">
              {{ item.description }}
            </p>
          </div>
        </template>
      </div>
    </motion.section>
  </section>
</template>
