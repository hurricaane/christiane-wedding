<script setup lang="ts">
import { AnimatePresence, motion } from "motion-v";

const activeWedding = ref<"montreal" | "cotonou" | null>(null);

const montrealItems = { title: "Montréal", date: "20 Juin 2026", location: "Montréal, Canada" };
const cotonouItems = { title: "Cotonou", date: "15 Décembre 2026", location: "Cotonou, Bénin" };

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
          class="text-center text-primary-foreground px-6"
        >
          <motion.p
            :initial="{ opacity: 0, y: 20 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.8, delay: 0.2 }"
            class="font-body text-xs md:text-sm tracking-[0.5em] uppercase mb-4 text-primary-foreground/90"
          >
            Nous nous marions
          </motion.p>

          <motion.h1
            :initial="{ opacity: 0, y: 30 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.8, delay: 0.4 }"
            class="font-display italic text-6xl md:text-8xl lg:text-9xl drop-shadow-2xl mb-8"
          >
            Christiane <span class="text-primary">&</span> Stéphane
          </motion.h1>

          <motion.div
            :initial="{ opacity: 0, y: 20 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.8, delay: 0.6 }"
            class="flex items-center justify-center gap-6 opacity-40"
          >
            <div class="w-12 h-px bg-primary-foreground" />
            <span class="text-[10px] uppercase tracking-[0.4em]">Choisissez une destination</span>
            <div class="w-12 h-px bg-primary-foreground" />
          </motion.div>
        </motion.div>
      </div>
    </AnimatePresence>

    <motion.div
      class="absolute inset-0 transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1)"
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
        src="/images/hero-montreal.jpg"
        alt="Christiane & Stéphane - Montréal"
        class="absolute inset-0 w-full h-full object-cover"
        loading="eager"
        preload
      />
      <div class="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />

      <div
        v-if="activeWedding !== 'montreal'"
        class="absolute left-6 top-1/2 -translate-y-1/2 [writing-mode:vertical-lr] rotate-180 text-white font-bold tracking-[0.6em] uppercase text-[10px] z-50"
      >
        Montréal
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
      class="absolute inset-0 transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1)"
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
        class="absolute inset-0 w-full h-full object-cover"
        loading="eager"
        preload
      />
      <div class="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors duration-500" />

      <div
        v-if="activeWedding !== 'cotonou'"
        class="absolute right-6 top-1/2 -translate-y-1/2 [writing-mode:vertical-lr] text-white font-bold tracking-[0.6em] uppercase text-[10px] z-50"
      >
        Cotonou
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
