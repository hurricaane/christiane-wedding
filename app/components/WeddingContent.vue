<script setup lang="ts">
import { AnimatePresence, motion } from "motion-v";

defineProps<{
  title: string;
  date: string;
  location: string;
  side: "left" | "right";
}>();

const emit = defineEmits(["close"]);
</script>

<template>
  <AnimatePresence>
    <motion.div
      :exit="{ opacity: 0, scale: 0.9, transition: { duration: 0.5 } }"
      class="text-center text-primary-foreground px-6 max-w-5xl mx-auto"
    >
      <motion.p
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.8, delay: 0.2 }"
        class="font-body text-xs md:text-sm tracking-[0.5em] uppercase mb-4 opacity-80"
      >
        Nous nous marions à
      </motion.p>

      <motion.h2
        :initial="{ opacity: 0, y: 30 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.8, delay: 0.4 }"
        class="font-display italic text-6xl md:text-8xl mb-8 leading-tight"
      >
        {{ title }}
      </motion.h2>

      <motion.div
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.8, delay: 0.6 }"
        class="flex items-center justify-center gap-4 my-8"
      >
        <div class="w-16 md:w-24 h-px bg-primary" />
        <span>
          <Icon
            name="i-lucide-heart"
            size="1.2em"
            class="text-primary"
          />
        </span>
        <div class="w-16 md:w-24 h-px bg-primary" />
      </motion.div>

      <motion.p
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.8, delay: 0.8 }"
        class="font-display text-3xl md:text-5xl mb-8"
      >
        {{ date }}
      </motion.p>

      <motion.p
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.8, delay: 1 }"
        class="font-body text-base tracking-[0.3em] uppercase opacity-60"
      >
        {{ location }}
      </motion.p>

      <motion.div
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.8, delay: 1.2 }"
        class="flex flex-col items-center gap-10 mt-20"
      >
        <UButton
          label="Confirmer ma présence"
          color="primary"
          size="xl"
          class="rounded-full px-14 py-5 shadow-2xl font-body tracking-widest text-sm hover:scale-105 transition-all text-primary-foreground hover:bg-primary/85 cursor-pointer"
          to="/rsvp"
        />

        <button
          type="button"
          class="flex items-center gap-4 text-primary-foreground/40 hover:text-primary-foreground transition-all uppercase tracking-[0.4em] text-[10px] cursor-pointer group py-4"
          @click.stop="emit('close', $event)"
        >
          <Icon
            v-if="side === 'right'"
            name="i-lucide-arrow-left"
            class="w-4 h-4 group-hover:-translate-x-2 transition-transform"
          />

          <span>Voir l'autre destination</span>

          <Icon
            v-if="side === 'left'"
            name="i-lucide-arrow-right"
            class="w-4 h-4 group-hover:translate-x-2 transition-transform"
          />
        </button>
      </motion.div>
    </motion.div>
  </AnimatePresence>
</template>
