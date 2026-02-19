<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";

import { motion } from "motion-v";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2, "Votre nom est requis."),
  email: z.email("Votre email est invalide."),
  attending: z.enum(["yes", "no"], {
    error: "Veuillez nous indiquer votre présence.",
  }),
  locations: z.array(z.string()).optional(),
  dietary: z.string().optional(),
  message: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.attending === "yes") {
    if (!data.locations || data.locations.length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["locations"],
        message: "Veuillez sélectionner au moins un lieu.",
      });
    }
  }
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  name: "",
  email: "",
  attending: undefined,
  locations: [],
  dietary: "",
  message: "",
});

const isSubmitting = ref(false);
const locationOptions = [
  { label: "Montréal (20 juin)", value: "montreal" },
  { label: "Cotonou (15 décembre)", value: "cotonou" },
];

const presenceOptions = [
  { label: "Je serai présent(e) avec joie", value: "yes" },
  { label: "Je ne pourrai malheureusement pas être présent(e)", value: "no" },
];

async function onSubmit(event: FormSubmitEvent<Schema>) {
  isSubmitting.value = true;

  // Simulate API call
  // eslint-disable-next-line no-console
  console.log("Données RSVP:", event.data);

  await new Promise(resolve => setTimeout(resolve, 1500));
  isSubmitting.value = false;
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
          class="font-body text-sm tracking-widest uppercase px-4 py-1 rounded-full bg-primary/10 font-bold inline-block text-primary mb-4"
        >
          Confirmez votre présence
        </p>
        <h1 class="text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
          RSVP
        </h1>
        <p class="font-display text-muted-foreground tracking-wide uppercase text-sm">
          Veuillez répondre avant le 20 Avril 2026
        </p>
        <div class="flex items-center justify-center gap-4 mt-6">
          <div class="w-16 h-px bg-primary" />
          <Icon
            name="i-lucide-heart"
            class="text-primary"
            size="20"
          />
          <div class="w-16 h-px bg-primary" />
        </div>
      </motion.div>

      <motion.div
        :initial="{ opacity: 0, y: 30 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.8, delay: 0.2 }"
        class="bg-card border border-primary/10 shadow-xl rounded-2xl p-8 md:p-12"
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
            <div v-if="state.attending === 'yes'" class="space-y-8 pt-4 border-t border-primary/5">
              <UFormField
                label="À quel(s) événement(s) ?"
                name="locations"
                required
                :ui="{ label: 'text-foreground font-semibold mb-4' }"
              >
                <UCheckboxGroup
                  v-model="state.locations"
                  :items="locationOptions"
                  class="mt-2 w-full"
                  :ui="{
                    fieldset: 'grid md:grid-cols-2 gap-4',
                    label: 'text-foreground font-medium cursor-pointer',
                    item: 'p-4 border border-primary/10 rounded-xl bg-ivory/40 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5 transition-all',
                    indicator: 'text-ivory',
                  }"
                />
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
            label="Un message pour les mariés ?"
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
    </div>
  </section>
</template>
