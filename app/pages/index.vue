<script setup lang="ts">
import { AnimatePresence, motion } from "motion-v";

useHead({ titleTemplate: null });
useSeoMeta({
  title: "Mariage de Christiane & Stéphane",
});

const activeWedding = ref<"montreal" | "cotonou" | null>(null);

const montrealItems = { title: "Montréal", date: "20 Juin 2026", location: "Canada" };
const cotonouItems = { title: "Cotonou", date: "17 & 19 Décembre 2026", location: "Bénin" };

function handleClose(e: Event) {
  e.stopPropagation();
  activeWedding.value = null;
}
</script>

<template>
  <section class="relative h-screen w-full overflow-hidden bg-black">
    <AnimatePresence>
      <div v-if="!activeWedding" class="absolute inset-0 z-60 flex items-center justify-center pointer-events-none">
        <motion.div
          :exit="{ opacity: 0, scale: 0.9, transition: { duration: 0.5 } }"
          class="text-center text-primary-foreground w-full"
        >
          <!-- Inner wrapper: padded to clear Montréal/Cotonou edge labels -->
          <div class="px-14 sm:px-16 md:px-24">
            <!-- "Les familles" label -->
            <motion.p
              :initial="{ opacity: 0, y: 20 }"
              :animate="{ opacity: 1, y: 0 }"
              :transition="{ duration: 0.8, delay: 0.2 }"
              class="font-body text-[10px] md:text-xs tracking-[0.55em] uppercase mb-6 text-primary-foreground/90"
            >
              Les familles
            </motion.p>

            <!-- Family names: 3-col grid — left name stacked | & centered | right name stacked -->
            <motion.div
              :initial="{ opacity: 0, y: 20 }"
              :animate="{ opacity: 1, y: 0 }"
              :transition="{ duration: 0.8, delay: 0.35 }"
              class="grid grid-cols-[1fr_auto_1fr] items-center gap-x-4 md:gap-x-8 mb-4 max-w-xs sm:max-w-sm md:max-w-md mx-auto"
            >
              <!-- Left family -->
              <div class="text-right leading-snug">
                <p
                  class="font-body text-sm md:text-lg lg:text-xl tracking-[0.25em] uppercase font-semibold text-primary-foreground/95"
                >
                  DOSSOU
                </p>
                <p
                  class="font-body text-sm md:text-lg lg:text-xl tracking-[0.25em] uppercase font-semibold text-primary-foreground/95"
                >
                  AJAVON
                </p>
              </div>

              <!-- Ampersand -->
              <span class="font-display italic text-sable text-2xl md:text-3xl leading-none">
                &amp;
              </span>

              <!-- Right family -->
              <div class="text-left leading-snug">
                <p
                  class="font-body text-sm md:text-lg lg:text-xl tracking-[0.25em] uppercase font-semibold text-primary-foreground/95"
                >
                  FAGON
                </p>
                <p
                  class="font-body text-sm md:text-lg lg:text-xl tracking-[0.25em] uppercase font-semibold text-primary-foreground/95"
                >
                  OHIN
                </p>
              </div>
            </motion.div>

            <!-- Subtitle -->
            <motion.p
              :initial="{ opacity: 0, y: 20 }"
              :animate="{ opacity: 1, y: 0 }"
              :transition="{ duration: 0.8, delay: 0.5 }"
              class="font-body text-[10px] md:text-xs tracking-[0.25em] italic text-primary-foreground/90 mb-6"
            >
              célèbrent l'union de leurs enfants
            </motion.p>

            <!-- Decorative divider -->
            <motion.div
              :initial="{ opacity: 0, scaleX: 0 }"
              :animate="{ opacity: 1, scaleX: 1 }"
              :transition="{ duration: 0.7, delay: 0.65 }"
              class="flex items-center justify-center gap-4 mb-6"
            >
              <div class="w-8 md:w-14 h-px bg-sable" />
              <Icon
                name="i-lucide-heart"
                size="12"
                class="text-sable"
              />
              <div class="w-8 md:w-14 h-px bg-sable" />
            </motion.div>
          </div>

          <!-- Couple names: free from padding so it centers across the full viewport width -->
          <!-- Font sized via vw so it always fits on one line on every screen -->
          <motion.h1
            :initial="{ opacity: 0, y: 30 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.9, delay: 0.8 }"
            class="font-display italic drop-shadow-2xl mb-8 whitespace-nowrap w-full text-center
                   text-[9.5vw] sm:text-[7.5vw] md:text-6xl lg:text-7xl xl:text-8xl"
          >
            Christiane <span class="text-sable">&</span> Stéphane
          </motion.h1>

          <motion.div
            :initial="{ opacity: 0, y: 20 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.8, delay: 1.0 }"
            class="flex items-center justify-center gap-6 opacity-50"
          >
            <div class="w-12 h-px bg-sable/60" />
            <span class="text-[10px] uppercase tracking-[0.4em]">Choisissez une destination</span>
            <div class="w-12 h-px bg-sable/60" />
          </motion.div>
        </motion.div>
      </div>
    </AnimatePresence>

    <motion.div
      class="absolute inset-0 transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1) group"
      :class="[
        activeWedding === 'montreal' ? 'z-40' : 'z-20',
        activeWedding === 'cotonou' ? 'grayscale opacity-30' : 'grayscale-0',
      ]"
      :style="{
        clipPath: activeWedding === 'montreal'
          ? 'inset(0 0% 0 0)'
          : activeWedding === 'cotonou'
            ? 'inset(0 95% 0 0)'
            : 'inset(0 50% 0 0)',
      }"
      :while-hover="!activeWedding ? { scale: 1.03 } : {}"
      @click="activeWedding = 'montreal'"
    >
      <NuxtImg
        src="/images/hero-montreal-2.jpg"
        alt="Christiane & Stéphane - Montréal"
        class="absolute inset-0 w-full h-full object-cover object-left"
        loading="eager"
        preload
      />
      <div class="absolute inset-0 bg-black/60 group-hover:bg-black/30 transition-colors duration-500" />

      <div
        v-if="activeWedding !== 'montreal'"
        class="absolute bottom-16 left-1/4 -translate-x-1/2 z-50 flex flex-col items-center gap-1.5"
      >
        <span
          class="text-white font-bold tracking-[0.6em] uppercase text-xs transition-all duration-500 group-hover:tracking-[0.9em] group-hover:-translate-y-1 inline-block"
        >
          Montréal
        </span>
        <span class="block h-px w-4 bg-white/60 transition-all duration-500 group-hover:w-8" />
      </div>

      <div v-if="activeWedding === 'montreal'" class="h-full flex items-center justify-center relative z-50">
        <WeddingContent
          v-bind="montrealItems"
          side="left"
          @close="handleClose"
        />
      </div>
    </motion.div>

    <motion.div
      class="absolute inset-0 transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1) group"
      :class="[
        activeWedding === 'cotonou' ? 'z-40' : 'z-30',
        activeWedding === 'montreal' ? 'grayscale opacity-30 hover:opacity-100' : 'grayscale-0',
      ]"
      :style="{
        clipPath: activeWedding === 'cotonou'
          ? 'inset(0 0% 0 0)'
          : activeWedding === 'montreal'
            ? 'inset(0 0 0 95%)'
            : 'inset(0 0 0 50%)',
      }"
      :while-hover="!activeWedding ? { scale: 1.03 } : {}"
      @click="activeWedding = 'cotonou'"
    >
      <NuxtImg
        src="/images/hero-cotonou.jpg"
        alt="Christiane & Stéphane - Cotonou"
        class="absolute inset-0 w-full h-full object-cover object-left"
        loading="eager"
        preload
      />
      <div class="absolute inset-0 bg-black/60 group-hover:bg-black/30 transition-colors duration-500" />

      <div
        v-if="activeWedding !== 'cotonou'"
        class="absolute bottom-16 right-1/4 translate-x-1/2 z-50 flex flex-col items-center gap-1.5"
      >
        <span
          class="text-white font-bold tracking-[0.6em] uppercase text-xs transition-all duration-500 group-hover:tracking-[0.9em] group-hover:-translate-y-1 inline-block"
        >
          Cotonou
        </span>
        <span class="block h-px w-4 bg-white/60 transition-all duration-500 group-hover:w-8" />
      </div>

      <div v-if="activeWedding === 'cotonou'" class="h-full flex items-center justify-center relative z-50">
        <WeddingContent
          v-bind="cotonouItems"
          side="right"
          @close="handleClose"
        />
      </div>
    </motion.div>
  </section>
</template>
