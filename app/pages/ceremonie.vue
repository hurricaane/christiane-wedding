<script setup lang="ts">
import { useIntersectionObserver } from "@vueuse/core";
import { motion } from "motion-v";

useSeoMeta({
  title: "La Cérémonie",
  description: "Tous les détails de nos cérémonies à Cotonou : lieux, horaires et programme.",
});

type CeremonyEvent = {
  id: string;
  time: string;
  title: string;
  venue: string;
  location: string;
  icon: string;
  imageUrl: string;
};

const ceremonyData = {
  cotonou: [
    {
      id: "cot-church",
      time: "19 décembre — À confirmer",
      title: "Cérémonie Religieuse",
      venue: "Église Protestante Méthodiste de Gbeto (EPMB)",
      location: "9C8F+9F2, Rue 407, Cotonou, Benin",
      icon: "i-lucide-church",
      imageUrl: "/images/ceremony-cotonou-church.jpg",
    },
    {
      id: "cot-gala",
      time: "19 décembre — À confirmer",
      title: "Grande Réception",
      venue: "Françoise's Garden — Thé Venue",
      location: "89XX+78C, Boulevard de la Marina, Cotonou, Benin",
      icon: "i-lucide-party-popper",
      imageUrl: "/images/ceremony-cotonou-gala.jpg",
    },
  ],
};

const isModalOpen = ref(false);
const selectedEvent = ref<CeremonyEvent | null>(null);
const mapError = ref(false);
const mapLoading = ref(false);
const sectionRef = ref(null);
const isInView = ref(false);

useIntersectionObserver(sectionRef, (entries) => {
  const isIntersecting = entries[0]?.isIntersecting;
  if (isIntersecting)
    isInView.value = true;
}, { threshold: 0.1 });

function openMap(event: CeremonyEvent) {
  mapError.value = false;
  mapLoading.value = true;
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
        <div class="grid md:grid-cols-2 gap-8 mt-8 w-full max-w-4xl mx-auto">
          <EventCard
            v-for="(event, index) in ceremonyData.cotonou"
            :key="event.id"
            :event="event"
            :index="index"
            :is-in-view="isInView"
            @open-map="openMap"
          />
        </div>
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
              <div
                v-if="mapLoading && !mapError"
                class="absolute inset-0 flex items-center justify-center bg-ivory-dark/60"
              >
                <Icon
                  name="i-lucide-loader-2"
                  class="animate-spin text-marine"
                  size="32"
                />
              </div>
              <img
                v-if="selectedEvent && !mapError"
                :src="`/api/map-image?address=${encodeURIComponent(selectedEvent.location)}`"
                class="w-full h-full object-cover transition-opacity duration-300"
                :class="[mapLoading ? 'opacity-0' : 'opacity-100']"
                :alt="`Carte : ${selectedEvent.venue}, ${selectedEvent.location}`"
                @load="mapLoading = false"
                @error="mapError = true; mapLoading = false"
              >
              <div
                v-else-if="mapError"
                class="w-full h-full flex items-center justify-center font-body text-sm text-muted-foreground"
              >
                Impossible de charger la carte.
              </div>
              <a
                v-if="selectedEvent"
                :href="`https://maps.google.com/?q=${encodeURIComponent(selectedEvent.location)}`"
                target="_blank"
                rel="noopener noreferrer"
                class="absolute bottom-4 right-4 px-4 py-2 rounded-full bg-ivory-dark text-marine text-sm font-body font-semibold shadow hover:bg-sable/30 transition-colors"
              >
                Ouvrir dans Google Maps <span aria-hidden="true">→</span>
              </a>
            </div>
          </motion.div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>
