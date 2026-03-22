<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";

import { motion } from "motion-v";
import { z } from "zod";

useSeoMeta({
  title: "RSVP",
  description: "Confirmez votre présence à notre mariage avant le 15 août 2026.",
});

const schema = z.object({
  name: z.string().min(2, "Votre nom est requis."),
  email: z.email("Votre email est invalide."),
  attending: z.enum(["yes", "no"], {
    error: "Veuillez nous indiquer votre présence.",
  }),
  dates: z.array(z.enum(["17-dec", "19-dec-church", "19-dec-reception"])).optional(),
  dietary: z.string().optional(),
  message: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.attending === "yes" && (!data.dates || data.dates.length === 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Veuillez sélectionner au moins une date.",
      path: ["dates"],
    });
  }
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  name: "",
  email: "",
  attending: undefined,
  dates: [],
  dietary: "",
  message: "",
});

const DEC19_SUB = ["19-dec-church", "19-dec-reception"] as const;

const dec19Checked = computed(() =>
  DEC19_SUB.some(d => state.dates?.includes(d)),
);
const dec19Indeterminate = computed(() => {
  const count = DEC19_SUB.filter(d => state.dates?.includes(d)).length;
  return count === 1;
});

const dec19Model = computed({
  get: () => dec19Indeterminate.value ? "indeterminate" : dec19Checked.value,
  set: () => {
    const current = state.dates?.filter(d => !DEC19_SUB.includes(d as never)) ?? [];
    if (dec19Checked.value && !dec19Indeterminate.value) {
      state.dates = current as typeof state.dates;
    }
    else {
      state.dates = [...current, ...DEC19_SUB] as typeof state.dates;
    }
  },
});

function toggleDate(date: string, checked: boolean) {
  if (!state.dates)
    state.dates = [];
  if (checked) {
    if (!state.dates.includes(date as never))
      state.dates = [...state.dates, date as never];
  }
  else {
    state.dates = state.dates.filter(d => d !== date) as typeof state.dates;
  }
}

const isSubmitting = ref(false);
const isSubmitted = ref(false);
const submitError = ref<string | null>(null);

const presenceOptions = [
  { label: "Je serai présent(e) avec joie", value: "yes" },
  { label: "Je ne pourrai malheureusement pas être présent(e)", value: "no" },
];

async function onSubmit(event: FormSubmitEvent<Schema>) {
  isSubmitting.value = true;
  submitError.value = null;
  try {
    await $fetch("/api/rsvp", { method: "POST", body: event.data });
    isSubmitted.value = true;
  }
  catch {
    submitError.value = "Une erreur est survenue. Veuillez réessayer.";
  }
  finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <section class="section-padding bg-linear-to-t from-background to-ivory-dark py-16 px-4">
    <div class="container-wedding">
      <motion.div
        :initial="{ opacity: 0, y: 40 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.8 }"
        class="text-center mb-16"
      >
        <p
          class="font-body text-sm tracking-widest uppercase px-4 py-1 rounded-full bg-marine/10 font-bold inline-block text-marine mb-4"
        >
          Confirmez votre présence
        </p>
        <h1 class="text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
          RSVP
        </h1>
        <p class="font-display text-muted-foreground tracking-wide uppercase text-lg md:text-xl">
          Cotonou — 17 &amp; 19 Décembre 2026
        </p>
        <div class="flex items-center justify-center gap-4 mt-6">
          <div class="w-16 h-px bg-sable/60" />
          <Icon
            name="i-lucide-heart"
            class="text-sable"
            size="20"
          />
          <div class="w-16 h-px bg-sable/60" />
        </div>
      </motion.div>

      <motion.div
        v-if="!isSubmitted"
        :initial="{ opacity: 0, y: 30 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.8, delay: 0.2 }"
        class="bg-card border border-marine/10 shadow-xl rounded-2xl p-8 md:p-12"
      >
        <UForm
          :schema="schema"
          :state="state"
          class="space-y-10"
          @submit="onSubmit"
        >
          <div class="grid md:grid-cols-2 gap-8">
            <UFormField
              label="Nom complet"
              name="name"
              required
              :ui="{ label: 'text-foreground font-semibold mb-2' }"
            >
              <UInput
                v-model="state.name"
                placeholder="Prénom & Nom"
                icon="i-lucide-user"
                size="lg"
                variant="outline"
                class="w-full"
                :ui="{ base: 'bg-ivory/80 focus:bg-ivory text-foreground' }"
              />
            </UFormField>
            <UFormField
              label="Adresse email"
              name="email"
              required
              :ui="{ label: 'text-foreground font-semibold mb-2' }"
            >
              <UInput
                v-model="state.email"
                placeholder="email@exemple.com"
                icon="i-lucide-mail"
                size="lg"
                variant="outline"
                class="w-full"
                :ui="{ base: 'bg-ivory/80 focus:bg-ivory text-foreground' }"
              />
            </UFormField>
          </div>

          <UFormField
            label="Serez-vous parmi nous ?"
            name="attending"
            required
            :ui="{ label: 'text-lg text-foreground font-semibold mb-4' }"
          >
            <URadioGroup
              v-model="state.attending"
              :items="presenceOptions"
              class="mt-2 w-full"
              :ui="{
                fieldset: 'flex flex-col gap-4',
                item: 'p-4 border border-primary/10 rounded-xl bg-ivory/40 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5 transition-all',
                label: 'text-foreground font-medium cursor-pointer',
                indicator: 'after:bg-ivory',
              }"
            />
          </UFormField>

          <Transition
            enter-active-class="transition-all duration-500 ease-out"
            enter-from-class="opacity-0 -translate-y-4 max-h-0"
            enter-to-class="opacity-100 translate-y-0 max-h-[500px]"
            leave-active-class="transition-all duration-300 ease-in"
            leave-from-class="opacity-100 translate-y-0 max-h-[500px]"
            leave-to-class="opacity-0 -translate-y-4 max-h-0"
          >
            <div v-if="state.attending === 'yes'" class="space-y-8 pt-4 border-t border-marine/10">
              <UFormField
                label="À quelle(s) cérémonie(s) serez-vous présent(e) ?"
                name="dates"
                required
                :ui="{ label: 'text-foreground font-semibold mb-4' }"
              >
                <div class="mt-2 flex flex-col gap-4">
                  <!-- 17 Décembre -->
                  <div
                    class="p-4 border rounded-xl bg-ivory/40 transition-all"
                    :class="state.dates?.includes('17-dec') ? 'border-primary bg-primary/5' : 'border-primary/10'"
                  >
                    <UCheckbox
                      id="date-17-dec"
                      :model-value="state.dates?.includes('17-dec')"
                      label="17 Décembre 2026 — Cérémonie Traditionnelle"
                      :ui="{ label: 'text-foreground font-medium cursor-pointer' }"
                      @update:model-value="toggleDate('17-dec', $event)"
                    />
                  </div>

                  <!-- 19 Décembre (parent + sub-options) -->
                  <div
                    class="border rounded-xl bg-ivory/40 transition-all overflow-hidden"
                    :class="dec19Checked ? 'border-primary bg-primary/5' : 'border-primary/10'"
                  >
                    <div class="p-4">
                      <UCheckbox
                        id="date-19-dec"
                        v-model="dec19Model"
                        label="19 Décembre 2026"
                        :ui="{ label: 'text-foreground font-medium cursor-pointer' }"
                      />
                    </div>
                    <Transition
                      enter-active-class="transition-all duration-300 ease-out"
                      enter-from-class="opacity-0 max-h-0"
                      enter-to-class="opacity-100 max-h-40"
                      leave-active-class="transition-all duration-200 ease-in"
                      leave-from-class="opacity-100 max-h-40"
                      leave-to-class="opacity-0 max-h-0"
                    >
                      <div v-if="dec19Checked" class="px-4 pb-4 flex flex-col gap-3 border-t border-primary/10 pt-3 ml-6">
                        <UCheckbox
                          id="date-19-dec-church"
                          :model-value="state.dates?.includes('19-dec-church')"
                          label="Cérémonie Religieuse"
                          :ui="{ label: 'text-foreground/80 font-medium cursor-pointer text-sm' }"
                          @update:model-value="toggleDate('19-dec-church', $event)"
                        />
                        <UCheckbox
                          id="date-19-dec-reception"
                          :model-value="state.dates?.includes('19-dec-reception')"
                          label="Grande Réception"
                          :ui="{ label: 'text-foreground/80 font-medium cursor-pointer text-sm' }"
                          @update:model-value="toggleDate('19-dec-reception', $event)"
                        />
                      </div>
                    </Transition>
                  </div>
                </div>
              </UFormField>

              <UFormField
                label="Restrictions ou allergies alimentaires"
                name="dietary"
                :ui="{ label: 'text-foreground font-semibold mb-2' }"
              >
                <UTextarea
                  v-model="state.dietary"
                  placeholder="Ex: Végétarien, sans gluten..."
                  variat="outline"
                  size="lg"
                  :rows="2"
                  autoresize
                  class="w-full"
                  :ui="{ base: 'bg-ivory/80 focus:bg-ivory text-foreground' }"
                />
              </UFormField>
            </div>
          </Transition>

          <UFormField
            label="Un message ou une question pour les mariés ?"
            name="message"
            :ui="{ label: 'text-foreground font-semibold mb-2' }"
          >
            <UTextarea
              v-model="state.message"
              placeholder="Laissez nous un petit mot..."
              variant="outline"
              size="lg"
              :rows="4"
              autoresize
              class="w-full"
              :ui="{ base: 'bg-ivory/80 focus:bg-ivory text-foreground' }"
            />
          </UFormField>

          <p
            v-if="submitError"
            class="text-red-600 text-sm text-center font-medium"
          >
            {{ submitError }}
          </p>

          <UButton
            type="submit"
            label="Envoyer ma réponse"
            block
            color="primary"
            :loading="isSubmitting"
            class="rounded-full py-2 text-base text-primary-foreground font-bold shadow-lg hover:shadow-primary/30 transition-all hover:-translate-y-1 active:scale-[0.98]"
          />
        </UForm>
      </motion.div>

      <motion.div
        v-else
        :initial="{ opacity: 0, y: 30 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.8 }"
        class="bg-card border border-marine/10 shadow-xl rounded-2xl p-8 md:p-12 text-center"
      >
        <div class="flex items-center justify-center gap-4 mb-8">
          <div class="w-16 h-px bg-sable/60" />
          <Icon
            name="i-lucide-heart"
            class="text-sable"
            size="24"
          />
          <div class="w-16 h-px bg-sable/60" />
        </div>
        <h2 class="font-display text-3xl md:text-4xl text-foreground mb-4">
          Merci, {{ state.name }} !
        </h2>
        <p class="font-body text-muted-foreground text-lg leading-relaxed">
          Nous avons bien reçu votre réponse.<br>
          Un email de confirmation vous a été envoyé.
        </p>
        <div class="flex items-center justify-center gap-4 mt-8">
          <div class="w-16 h-px bg-sable/60" />
          <Icon
            name="i-lucide-heart"
            class="text-sable"
            size="20"
          />
          <div class="w-16 h-px bg-sable/60" />
        </div>
        <p class="font-display text-muted-foreground tracking-wide uppercase text-sm mt-8">
          Christiane &amp; Stéphane
        </p>
      </motion.div>
    </div>
  </section>
</template>
