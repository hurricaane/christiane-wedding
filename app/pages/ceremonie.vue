<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";

import { useIntersectionObserver } from "@vueuse/core";
import { motion } from "motion-v";

type CeremonyEvent = {
  id: string;
  time: string;
  title: string;
  venue: string;
  location: string;
  icon: string;
  mapUrl: string;
  imageUrl: string;
};

const ceremonyData = {
  montreal: [
    {
      id: "mtl-civil",
      time: "12h00",
      title: "Cérémonie Civile",
      venue: "Chapelle Notre-Dame-du-Sacré-Cœur",
      location: "424 Rue St-Sulpice, Montréal QC H2Y 2V5",
      icon: "i-lucide-building-2",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2796.38883547843!2d-73.5566!3d45.5046",
      imageUrl: "/images/ceremony-montreal-civil.jpg",
    },
    {
      id: "mtl-photo",
      time: "13h00",
      title: "Séance Photo",
      venue: "Vieux-Port de Montréal",
      location: "Vieux-Port, Montréal, Canada",
      icon: "i-lucide-camera",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2796.5!2d-73.5545!3d45.5050",
      imageUrl: "/images/ceremony-montreal-photoshoot.jpg",
    },
    {
      id: "mtl-cocktail",
      time: "14h00",
      title: "Cocktail Urbain",
      venue: "Salle Notre-Dame — Basilique Notre-Dame",
      location: "424 Rue St-Sulpice, Montréal QC H2Y 2V5",
      icon: "i-lucide-glass-water",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2796.38883547843!2d-73.5566!3d45.5046",
      imageUrl: "/images/ceremony-montreal-cocktail.jpg",
    },
  ],
  cotonou: [
    {
      id: "cot-trad",
      time: "17 décembre — À confirmer",
      title: "Cérémonie Traditionnelle",
      venue: "À confirmer",
      location: "Cotonou, Bénin",
      icon: "i-lucide-users",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.2!2d2.41!",
      imageUrl: "/images/drapeau-benin.svg",
    },
    {
      id: "cot-church",
      time: "19 décembre — 14h00",
      title: "Cérémonie Religieuse",
      venue: "Église Protestante Méthodiste de Gbeto (EPMB)",
      location: "Rue 407, Cotonou, Bénin",
      icon: "i-lucide-church",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.1!2d2.43!",
      imageUrl: "/images/drapeau-benin.svg",
    },
    {
      id: "cot-gala",
      time: "19 décembre — 19h00",
      title: "Grande Réception",
      venue: "Françoise's Garden — Thé Venue",
      location: "Boulevard de la Marina, Cotonou, Bénin",
      icon: "i-lucide-party-popper",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.3!2d2.42!",
      imageUrl: "/images/drapeau-benin.svg",
    },
  ],
};

const items = ref<TabsItem[]>([
  {
    slot: "montreal" as const,
    label: "Montréal",
    icon: "i-lucide-map-pin",
  },
  {
    slot: "cotonou" as const,
    label: "Cotonou",
    icon: "i-lucide-map-pin",
  },
]);

const isModalOpen = ref(false);
const selectedEvent = ref<CeremonyEvent | null>(null);
const sectionRef = ref(null);
const isInView = ref(false);

useIntersectionObserver(sectionRef, (entries) => {
  const isIntersecting = entries[0]?.isIntersecting;
  if (isIntersecting)
    isInView.value = true;
}, { threshold: 0.1 });

function openMap(event: CeremonyEvent) {
  selectedEvent.value = event;
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
  setTimeout(() => {
    selectedEvent.value = null;
  }, 300);
}
</script>

<template>
  <section ref="sectionRef" class="section-padding bg-linear-to-t from-background to-ivory-dark min-h-screen">
    <div class="container-wedding">
      <motion.div
        :initial="{ opacity: 0, y: 40 }"
        :animate="isInView ? { opacity: 1, y: 0 } : {}"
        :transition="{ duration: 0.8 }"
        class="text-center mb-12"
      >
        <p
          class="font-body text-sm tracking-widest uppercase px-4 py-1 rounded-full bg-marine/10 font-bold inline-block text-marine mb-4"
        >
          Célébration
        </p>
        <h2 class="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
          La Cérémonie
        </h2>
        <div class="flex items-center justify-center gap-4">
          <div class="w-16 h-px bg-sable/60" />
          <Icon
            name="i-lucide-heart"
            class="text-sable"
            size="20"
          />
          <div class="w-16 h-px bg-sable/60" />
        </div>
      </motion.div>

      <Motion
        as-child
        :initial="{ opacity: 0, y: 40 }"
        :animate="isInView ? { opacity: 1, y: 0 } : {}"
        :transition="{ duration: 0.8, delay: 0.2 }"
      >
        <UTabs
          :items="items"
          variant="pill"
          class="w-full max-w-6xl mx-auto"
          :ui="{
            root: 'flex-col gap-8',
            list: 'bg-primary/10 p-1.5 rounded-full max-w-xs mx-auto',
            indicator: 'bg-primary rounded-full shadow-md',
            trigger: 'data-[state=active]:text-primary-foreground data-[state=inactive]:text-foreground/50 hover:data-[state=inactive]:not-disabled:text-foreground/30 text-primary font-bold transition-all duration-300 cursor-pointer',
          }"
        >
          <template #montreal>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
              <EventCard
                v-for="(event, index) in ceremonyData.montreal"
                :key="event.id"
                :event="event"
                :index="index"
                :is-in-view="isInView"
                @open-map="openMap"
              />
            </div>
          </template>

          <template #cotonou>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
              <EventCard
                v-for="(event, index) in ceremonyData.cotonou"
                :key="event.id"
                :event="event"
                :index="index"
                :is-in-view="isInView"
                @open-map="openMap"
              />
            </div>
          </template>
        </UTabs>
      </Motion>
    </div>

    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="isModalOpen"
          class="fixed inset-0 z-200 flex items-center justify-center bg-marine/80 backdrop-blur-sm px-4"
          @click="closeModal"
        >
          <motion.div
            :initial="{ opacity: 0, scale: 0.95 }"
            :animate="{ opacity: 1, scale: 1 }"
            class="relative bg-card rounded-lg shadow-2xl max-w-4xl w-full overflow-hidden"
            @click.stop
          >
            <div class="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h3 class="font-display text-2xl text-foreground mb-1">
                  {{ selectedEvent?.title }}
                </h3>
                <p class="font-body text-sm text-muted-foreground">
                  {{ selectedEvent?.venue }}
                </p>
              </div>
              <UButton
                color="primary"
                variant="ghost"
                icon="i-lucide-x"
                class="hover:bg-primary/40 cursor-pointer"
                @click="closeModal"
              />
            </div>

            <div class="relative w-full h-[60vh]">
              <iframe
                v-if="selectedEvent"
                :src="selectedEvent.mapUrl"
                width="100%"
                height="100%"
                style="border: 0"
                allowfullscreen
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>
