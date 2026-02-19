<script setup lang="ts">
import { AnimatePresence, motion } from "motion-v";

type Props = {
  minLoadingTime?: number;
};

const props = withDefaults(defineProps<Props>(), {
  minLoadingTime: 2500,
});

const emit = defineEmits(["loadingComplete"]);

const isLoading = ref(true);
const isOpening = ref(false);
const showContent = ref(false);

watchEffect(() => {
  if (import.meta.client) {
    document.body.style.overflow = isLoading.value ? "hidden" : "";
  }
});

onMounted(async () => {
  const startTime = Date.now();

  setTimeout(() => {
    isOpening.value = true;
  }, 600);

  await new Promise((resolve) => {
    if (document.readyState === "complete") {
      resolve(true);
    }
    else {
      window.addEventListener("load", () => resolve(true), { once: true });
      setTimeout(() => resolve(true), 5000);
    }
  });

  const elapsedTime = Date.now() - startTime;
  const remainingTime = Math.max(0, props.minLoadingTime - elapsedTime);

  setTimeout(() => {
    isLoading.value = false;
    // We emit and show content after the exit animation starts/finishes
    setTimeout(() => {
      showContent.value = true;
      emit("loadingComplete");
    }, 800);
  }, remainingTime);
});
</script>

<template>
  <div class="relative min-h-screen">
    <AnimatePresence>
      <motion.div
        v-if="isLoading"
        key="loader"
        initial="{ opacity: 1 }"
        :exit="{
          opacity: 0,
          y: -100,
          transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
        }"
        class="fixed inset-0 z-100 flex items-center justify-center bg-ivory origin-top"
      >
        <div class="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
          <div class="absolute -top-24 -left-24 w-96 h-96 border border-gold/30 rounded-full" />
          <div class="absolute -bottom-24 -right-24 w-96 h-96 border border-gold/30 rounded-full" />
        </div>

        <div class="relative w-80 h-48 flex items-center justify-center">
          <div class="absolute inset-0 bg-ivory-dark border border-gold/10 rounded-sm shadow-inner" />

          <motion.div
            v-if="isOpening"
            :initial="{ y: 20, opacity: 0, scale: 0.9 }"
            :animate="{ y: -140, opacity: 1, scale: 1 }"
            :transition="{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }"
            class="absolute w-72 h-80 bg-white shadow-2xl rounded-sm p-6 z-50 flex flex-col items-center justify-center border border-gold/5"
          >
            <div class="w-full h-full border border-gold/20 p-4 flex flex-col items-center justify-center relative">
              <div class="absolute top-2 left-2 w-4 h-4 border-t border-l border-gold/40" />
              <div class="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-gold/40" />

              <Icon name="i-lucide-sparkles" class="text-gold w-8 h-8 mb-4" />
              <h2 class="font-display italic text-3xl text-foreground text-center px-2 leading-tight">
                Christiane & Stéphane
              </h2>
              <div class="h-px w-16 bg-gold/40 my-4" />
              <p class="font-body text-xs tracking-widest uppercase text-gold-dark font-bold text-center">
                20 Juin 2026<br>15 Décembre 2026
              </p>
              <p class="font-body text-[10px] text-muted-foreground mt-4 uppercase tracking-tighter">
                MONTRÉAL | COTONOU
              </p>
            </div>
          </motion.div>

          <div
            class="absolute inset-0 bg-white rounded-sm z-20 shadow-xl"
            style="clip-path: polygon(0 0, 0% 100%, 100% 100%, 100% 0, 50% 50%);"
          />

          <div
            class="absolute top-0 left-0 right-0 bg-ivory-dark h-full origin-top z-30 pointer-events-none"
            :class="{ 'animate-flap-open': isOpening }"
            style="clip-path: polygon(0 0, 50% 55%, 100% 0);"
          />

          <div
            class="absolute z-60 transition-all duration-700 ease-in-out top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-2"
            :class="[
              isOpening ? 'opacity-0 scale-150 blur-sm pointer-events-none' : 'opacity-100 scale-100',
            ]"
          >
            <div
              class="w-14 h-14 bg-linear-to-br from-gold-light via-gold to-gold-dark rounded-full shadow-lg flex items-center justify-center"
              style="box-shadow: 0 4px 12px rgba(184, 149, 106, 0.4), inset 0 -2px 4px rgba(0,0,0,0.2);"
            >
              <Icon name="i-lucide-heart" class="text-ivory w-7 h-7 fill-current drop-shadow-sm" />
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>

    <Transition
      enter-active-class="transition-opacity duration-1000 delay-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
    >
      <div v-if="showContent" class="font-body">
        <slot />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
@keyframes flap-open {
  0% {
    transform: rotateX(0deg);
  }

  100% {
    transform: rotateX(-180deg);
  }
}

.animate-flap-open {
  animation: flap-open 1.2s cubic-bezier(0.45, 0, 0.55, 1) forwards;
  backface-visibility: hidden;
}
</style>
