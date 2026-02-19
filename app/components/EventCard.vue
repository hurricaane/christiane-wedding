<script setup lang="ts">
import { motion } from "motion-v";

defineProps(["event", "index", "isInView"]);
defineEmits(["open-map"]);
</script>

<template>
  <motion.div
    :initial="{ opacity: 0, y: 30 }"
    :animate="isInView ? { opacity: 1, y: 0 } : {}"
    :transition="{ duration: 0.6, delay: 0.2 + index * 0.1 }"
    class="card-wedding flex flex-col items-center text-center transition-transform hover:-translate-y-2"
  >
    <div class="w-16 h-16 rounded-full bg-primary/20 ring-2 ring-primary/40 flex items-center justify-center mb-6">
      <Icon :name="event.icon" class="text-primary w-7 h-7" />
    </div>

    <span class="text-primary font-body font-bold text-sm tracking-widest uppercase mb-2">
      {{ event.time }}
    </span>

    <h3 class="font-display text-2xl text-foreground mb-3">
      {{ event.title }}
    </h3>

    <p class="text-foreground font-body font-medium mb-1">
      {{ event.venue }}
    </p>

    <div class="flex items-center justify-center gap-2 text-muted-foreground text-sm mb-6">
      <Icon name="i-lucide-map-pin" class="w-4 h-4 text-primary" />
      <span>{{ event.location }}</span>
    </div>

    <div class="w-full h-48 mb-6 rounded-lg overflow-hidden border border-primary/10">
      <NuxtImg
        :src="event.imageUrl"
        class="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
    </div>

    <!-- eslint-disable vue/custom-event-name-casing -->
    <UButton
      label="Voir sur la carte"
      icon="i-lucide-map"
      block
      size="lg"
      class="rounded-full shadow-xl py-3 items-center gap-2 text-primary-foreground cursor-pointer"
      @click="$emit('open-map', event)"
    />
  </motion.div>
</template>
