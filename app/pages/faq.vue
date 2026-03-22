<script setup lang="ts">
import type { AccordionItem } from "@nuxt/ui";

import { useIntersectionObserver } from "@vueuse/core";
import { motion } from "motion-v";

useSeoMeta({
  title: "FAQ",
  description: "Vos questions sur le mariage, le thème, le RSVP et les cadeaux — tout ce qu'il faut savoir.",
});

const headerRef = ref(null);
const accordionRef = ref(null);
const isHeaderInView = ref(false);
const isAccordionInView = ref(false);

useIntersectionObserver(headerRef, (entries) => {
  if (entries[0]?.isIntersecting)
    isHeaderInView.value = true;
}, { threshold: 0.1 });

useIntersectionObserver(accordionRef, (entries) => {
  if (entries[0]?.isIntersecting)
    isAccordionInView.value = true;
}, { threshold: 0.1 });

const emailCopied = ref(false);

async function copyEmail() {
  await navigator.clipboard.writeText("couplefagnon@gmail.com");
  emailCopied.value = true;
  setTimeout(() => emailCopied.value = false, 2000);
}

const swatches = [
  { label: "Bleu cobalt", color: "#1e40af" },
  { label: "Vert olive", color: "#6b7a37" },
  { label: "Terracotta", color: "#c17a56" },
  { label: "Doré", color: "#c9a84c" },
  { label: "Crème", color: "#f5f0e8" },
];

const faqItems = [
  {
    label: "Quel est le thème du mariage ?",
    slot: "theme" as const,
    icon: "i-lucide-palette",
  },
  {
    label: "Y aura-t-il des options pour les régimes alimentaires spécifiques ?",
    content: "Si vous avez des restrictions ou préférences alimentaires (allergies, régimes spécifiques, etc.), merci de nous en informer au moment de confirmer votre présence via le formulaire. Cela nous permettra de faire le nécessaire pour que chacun profite pleinement du repas.",
    icon: "i-lucide-utensils",
  },
  {
    label: "Comment confirmer ma présence ?",
    slot: "rsvp" as const,
    icon: "i-lucide-calendar-check",
  },
  {
    label: "Puis-je prendre des photos pendant la cérémonie ?",
    content: "Oui, vous êtes libres de prendre des photos pendant la cérémonie si vous le souhaitez. Un QR code sera mis à disposition pour vous permettre de partager facilement vos plus beaux clichés avec nous pendant et après le mariage.",
    icon: "i-lucide-camera",
  },
  {
    label: "Puis-je offrir un cadeau ?",
    slot: "gift" as const,
    icon: "i-lucide-gift",
  },
  {
    label: "Comment se rendre à la Chapelle Notre-Dame-du-Sacré-Cœur ?",
    slot: "transport" as const,
    icon: "i-lucide-navigation",
  },
  {
    label: "Que pouvez-vous faire au Vieux-Port de Montréal ?",
    content: "Le Vieux-Port de Montréal offre une multitude d'activités pour tous les âges, allant des loisirs en plein air à une promenade dans les rues avoisinantes. En saison estivale, la Place Jacques-Cartier s'anime avec des spectacles de rue, de la musique et des terrasses animées. La Rue Saint-Paul, quant à elle, regorge de petits commerçants et de cafés charmants. Côté gourmandises, ne manquez pas la Queue de Castor, une spécialité emblématique à déguster sur le pouce. Pour les plus aventureux, des attractions comme SOS Labyrinthe, Voiles en Voiles ou encore La Grande Roue de Montréal sauront compléter votre visite.",
    icon: "i-lucide-map",
  },
  {
    label: "Vous avez une autre question ?",
    slot: "ask" as const,
    icon: "i-lucide-message-circle",
  },
] satisfies AccordionItem[];
</script>

<template>
  <section class="section-padding bg-linear-to-t from-background to-ivory-dark">
    <!-- Header -->
    <div ref="headerRef">
      <motion.div
        :initial="{ opacity: 0, y: 40 }"
        :animate="isHeaderInView ? { opacity: 1, y: 0 } : {}"
        :transition="{ duration: 0.8 }"
        class="text-center mb-16"
      >
        <p
          class="font-body text-sm tracking-widest uppercase px-4 py-1 rounded-full bg-marine/10 font-bold inline-block text-marine mb-4"
        >
          Questions fréquentes
        </p>
        <h2 class="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
          FAQ
        </h2>
        <p class="font-body text-muted-foreground text-lg max-w-xl mx-auto mb-8">
          Tout ce que vous devez savoir pour célébrer avec nous.
        </p>
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
    </div>

    <!-- Accordion -->
    <div ref="accordionRef" class="max-w-3xl mx-auto px-4">
      <motion.div
        :initial="{ opacity: 0, y: 30 }"
        :animate="isAccordionInView ? { opacity: 1, y: 0 } : {}"
        :transition="{ duration: 0.8, delay: 0.2 }"
      >
        <UAccordion
          :items="faqItems"
          type="single"
          :collapsible="true"
          :ui="{
            root: 'w-full divide-y divide-marine/10',
            item: 'py-1',
            trigger: 'group flex-1 flex items-center gap-3 py-5 focus-visible:outline-none cursor-pointer w-full text-left',
            label: 'font-display text-lg text-marine group-hover:text-sable-dark transition-colors duration-200 text-start',
            leadingIcon: 'text-sable shrink-0 size-5',
            trailingIcon: 'text-sable/60 shrink-0 size-5 ms-auto group-data-[state=open]:rotate-180 transition-transform duration-300',
            content: 'data-[state=open]:animate-[accordion-down_250ms_ease-out] data-[state=closed]:animate-[accordion-up_200ms_ease-in] overflow-hidden',
            body: 'pb-6 pt-1',
          }"
        >
          <!-- Thème -->
          <template #theme>
            <div class="space-y-4">
              <p class="text-muted-foreground leading-relaxed">
                Le mariage sera célébré dans un esprit chic et élégant. Nous vous invitons à privilégier des tenues de
                ville habillées dans les tons suivants afin d'harmoniser l'ensemble :
              </p>
              <div class="flex flex-wrap gap-3 pt-1">
                <div
                  v-for="swatch in swatches"
                  :key="swatch.label"
                  class="flex items-center gap-2 px-3 py-1.5 rounded-full border border-marine/10 bg-ivory/60"
                >
                  <span
                    class="w-3.5 h-3.5 rounded-full shrink-0 border border-marine/10"
                    :style="{ backgroundColor: swatch.color }"
                  />
                  <span class="text-sm font-body text-foreground/70">{{ swatch.label }}</span>
                </div>
              </div>
            </div>
          </template>

          <!-- RSVP -->
          <template #rsvp>
            <div class="space-y-4">
              <p class="text-muted-foreground leading-relaxed">
                Merci de confirmer votre présence via notre formulaire en ligne. Cela nous aidera à organiser au mieux cette journée avec
                vous.
              </p>
              <UButton
                label="Confirmer ma présence"
                icon="i-lucide-check-circle"
                color="primary"
                variant="soft"
                size="md"
                class="rounded-full"
                to="/rsvp"
              />
            </div>
          </template>

          <!-- Cadeau -->
          <template #gift>
            <div class="space-y-4">
              <p class="text-muted-foreground leading-relaxed">
                Votre présence lors de cette journée spéciale signifie beaucoup pour nous,
                et nous apprécions l'amour et le soutien que vous nous apportez. Si vous
                souhaitez nous honorer avec un cadeau, nous apprécierions grandement une
                contribution financière pour notre avenir commun. Vous pouvez le faire
                via le lien ci-dessous ou via Interac.
              </p>
              <div class="flex flex-col sm:flex-row gap-3 pt-1">
                <button
                  class="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-marine/15 bg-ivory/60 text-sm font-body text-foreground/70 hover:border-sable/40 hover:bg-sable/10 transition-all duration-200 cursor-pointer select-none"
                  @click="copyEmail"
                >
                  <UIcon
                    :name="emailCopied ? 'i-lucide-check' : 'i-lucide-mail'"
                    class="text-sable shrink-0 transition-all duration-200"
                    size="16"
                  />
                  <span>Interac : <span class="text-marine font-medium">couplefagnon@gmail.com</span></span>
                  <span class="ml-1 text-xs text-sable/70">{{ emailCopied ? 'Copié !' : 'Copier' }}</span>
                </button>
              </div>
              <p class="text-sm text-muted-foreground/70 italic">
                Merci du fond du cœur !
              </p>
            </div>
          </template>

          <!-- Transport -->
          <template #transport>
            <div class="space-y-5 text-muted-foreground leading-relaxed">
              <div class="space-y-1">
                <p class="font-semibold text-marine">
                  Métro
                </p>
                <p>Station Place-d'Armes (ligne orange)</p>
              </div>
              <div class="space-y-2">
                <p class="font-semibold text-marine">
                  Véhicule motorisé
                </p>
                <p>Veuillez noter que la basilique ne dispose pas de stationnement. Il est toutefois possible de se garer dans la rue (parcomètres) ou dans les stationnements payants du Vieux-Montréal.</p>
                <div class="flex flex-col gap-2 pt-1">
                  <a
                    href="https://assets.fabriquenotredame.ca/production/Basilique/Depliants-et-cartes/Carte-de-stationnement_Vieux-Montreal.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-2 text-sm text-marine hover:text-sable-dark transition-colors duration-200"
                  >
                    <UIcon
                      name="i-lucide-file-text"
                      class="shrink-0"
                      size="15"
                    />
                    Voir la carte de stationnements du Vieux-Port
                  </a>
                  <a
                    href="https://www.agencemobilitedurable.ca/fr/infos-pratiques/mobicite"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-2 text-sm text-marine hover:text-sable-dark transition-colors duration-200"
                  >
                    <UIcon
                      name="i-lucide-smartphone"
                      class="shrink-0"
                      size="15"
                    />
                    Télécharger l'application de parcomètre (Mobicité)
                  </a>
                </div>
              </div>
            </div>
          </template>

          <!-- Poser une question -->
          <template #ask>
            <div class="space-y-4">
              <p class="text-muted-foreground leading-relaxed">
                Vous n'avez pas trouvé la réponse à votre question ? Rendez-vous sur la page RSVP — un champ est prévu
                pour nous laisser un message ou poser vos questions. Nous vous répondrons dans les plus brefs délais.
              </p>
              <UButton
                label="Poser ma question"
                icon="i-lucide-message-circle"
                color="primary"
                variant="soft"
                size="md"
                class="rounded-full"
                to="/rsvp"
              />
            </div>
          </template>
        </UAccordion>
      </motion.div>
    </div>
  </section>
</template>
