# RSVP Email Integration Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire up the existing RSVP form to send two emails via Resend on submission — a styled confirmation to the guest and a notification to the couple.

**Architecture:** A new Nuxt server route (`server/api/rsvp.post.ts`) validates the form body, renders two Vue Email templates from `shared/emails/`, and sends them in parallel via the Resend SDK. The frontend `onSubmit` handler is updated to call this route and show success/error state.

**Tech Stack:** Nuxt 4, Vue 3, TypeScript, Resend Node.js SDK, @vue-email/render, @vue-email/components, Zod v4, pnpm

---

## Chunk 1: Dependencies & Configuration

### Task 1: Install packages

**Files:**

- Modify: `package.json` (via pnpm)

- [ ] **Step 1: Install the four required packages**

```bash
cd /home/yannick/Work/Freelance/Websites/christiane-wedding/backend-changes
pnpm add resend @vue-email/render @vue-email/components @vitejs/plugin-vue
```

Expected: pnpm resolves and installs all four packages without errors. `package.json` gets four new entries under `dependencies`.

- [ ] **Step 2: Verify installation**

```bash
pnpm list resend @vue-email/render @vue-email/components @vitejs/plugin-vue
```

Expected: all four packages listed with version numbers.

---

### Task 2: Update nuxt.config.ts

**Files:**

- Modify: `nuxt.config.ts`

The current file has no `nitro` key. Add it alongside the existing `vite` block. Also add the `vue` import at the top.

- [ ] **Step 1: Edit `nuxt.config.ts`**

Add `import vue from '@vitejs/plugin-vue'` after the existing tailwindcss import, then add a `nitro` block inside `defineNuxtConfig`. The final file should look like:

```ts
// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";

import "./shared/lib/env";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["./app/assets/css/main.css"],
  vite: {
    plugins: [
      // @ts-expect-error Don't understand the error
      tailwindcss(),
    ],
  },
  nitro: {
    rollupConfig: {
      plugins: [vue()],
    },
  },
  app: {
    head: {
      titleTemplate: "%s | Christiane & Stéphane",
      htmlAttrs: {
        class: "h-full",
      },
      bodyAttrs: {
        class: "antialiased overflow-x-hidden",
      },
    },
  },
  modules: [
    "@nuxt/eslint",
    "@nuxt/ui",
    "motion-v/nuxt",
    "@nuxt/image",
    "@nuxtjs/seo",
  ],
  eslint: {
    config: {
      standalone: false,
    },
  },
  site: {
    url: "https://christiane-wedding.vercel.app",
    name: "Christiane & Stéphane",
    indexable: false,
  },
  seo: {
    meta: {
      description: "Célébrez avec nous notre union à Montréal le 20 juin 2026 et à Cotonou le 19 décembre 2026.",
      ogImage: "/images/metadata-image.jpg",
      ogType: "website",
      twitterCard: "summary_large_image",
      ogLocale: "fr_FR",
    },
  },
});
```

- [ ] **Step 2: Verify dev server starts without errors**

```bash
pnpm dev
```

Expected: Nuxt starts successfully. No errors about Vue plugin conflicts or missing modules. Press Ctrl+C when confirmed.

---

## Chunk 2: Email Templates

### Task 3: Create GuestConfirmation.vue

**Files:**

- Create: `shared/emails/GuestConfirmation.vue` (the `shared/emails/` directory does not exist yet — it will be created when this file is written)

This template is sent to the guest. It uses `@vue-email/components` primitives (already installed in Task 1 as part of the `@vue-email/components` package) and branches on the `attending` prop. Inline styles are required for email client compatibility — no Tailwind. The `@vue-email/components` package exports components as `Html`, `Head`, `Body`, `Text`, `Section`, `Hr` — imported and registered under `E`-prefixed names to avoid conflicts with HTML elements.

- [ ] **Step 1: Create the file**

```vue
<!-- shared/emails/GuestConfirmation.vue -->
<script lang="ts">
import { Body, Head, Hr, Html, Section, Text } from "@vue-email/components";

export default {
  components: {
    EHtml: Html,
    EHead: Head,
    EBody: Body,
    EText: Text,
    ESection: Section,
    EHr: Hr,
  },
  props: {
    name: {
      type: String,
      required: true,
    },
    attending: {
      type: String as () => "yes" | "no",
      required: true,
    },
    dietary: {
      type: String,
      default: "",
    },
  },
};
</script>

<template>
  <EHtml lang="fr">
    <EHead />
    <EBody style="background-color: #fdf8f3; margin: 0; padding: 0; font-family: Georgia, 'Times New Roman', serif;">
      <ESection style="max-width: 600px; margin: 40px auto; padding: 0 20px;">
        <!-- Header -->
        <ESection style="text-align: center; padding: 48px 32px 32px; background-color: #ffffff; border-radius: 12px 12px 0 0; border: 1px solid #e8ddd0; border-bottom: none;">
          <EText style="font-size: 12px; letter-spacing: 4px; text-transform: uppercase; color: #8b7355; margin: 0 0 16px;">
            Christiane &amp; Stéphane
          </EText>
          <EText style="font-size: 32px; color: #2c2c2c; margin: 0 0 8px; font-style: italic;">
            {{ attending === 'yes' ? 'Merci !' : 'Merci de nous avoir répondu' }}
          </EText>
          <EHr style="border: none; border-top: 1px solid #e8ddd0; margin: 24px auto; width: 80px;" />
        </ESection>

        <!-- Body -->
        <ESection style="padding: 32px; background-color: #ffffff; border: 1px solid #e8ddd0; border-top: none; border-bottom: none;">
          <!-- Attending: yes -->
          <template v-if="attending === 'yes'">
            <EText style="font-size: 16px; line-height: 1.7; color: #3d3d3d; margin: 0 0 20px;">
              Cher(e) {{ name }},
            </EText>
            <EText style="font-size: 16px; line-height: 1.7; color: #3d3d3d; margin: 0 0 20px;">
              Nous sommes profondément touchés par votre présence à nos côtés. Votre RSVP a bien été enregistré — nous avons hâte de partager ce moment inoubliable avec vous.
            </EText>
            <ESection style="background-color: #fdf8f3; border: 1px solid #e8ddd0; border-radius: 8px; padding: 20px 24px; margin: 24px 0;">
              <EText style="font-size: 13px; letter-spacing: 2px; text-transform: uppercase; color: #8b7355; margin: 0 0 8px;">
                Détails de la célébration
              </EText>
              <EText style="font-size: 15px; color: #2c2c2c; margin: 0;">
                📅 19 Décembre 2026<br>
                📍 Cotonou, Bénin
              </EText>
            </ESection>
            <EText v-if="dietary" style="font-size: 15px; line-height: 1.7; color: #3d3d3d; margin: 0 0 20px;">
              Nous avons bien noté vos préférences alimentaires : <em>{{ dietary }}</em>.
            </EText>
            <EText style="font-size: 16px; line-height: 1.7; color: #3d3d3d; margin: 0 0 20px;">
              Plus d'informations vous parviendront dans les semaines à venir. En attendant, n'hésitez pas à consulter notre site pour tous les détails sur la cérémonie.
            </EText>
          </template>

          <!-- Attending: no -->
          <template v-else>
            <EText style="font-size: 16px; line-height: 1.7; color: #3d3d3d; margin: 0 0 20px;">
              Cher(e) {{ name }},
            </EText>
            <EText style="font-size: 16px; line-height: 1.7; color: #3d3d3d; margin: 0 0 20px;">
              Merci d'avoir pris le temps de nous répondre. Nous comprenons que la vie nous réserve parfois des imprévus, et votre pensée à notre égard nous touche énormément.
            </EText>
            <EText style="font-size: 16px; line-height: 1.7; color: #3d3d3d; margin: 0 0 20px;">
              Vous nous manquerez ce jour-là. Nous espérons avoir l'occasion de célébrer avec vous une prochaine fois.
            </EText>
          </template>

          <EText style="font-size: 16px; line-height: 1.7; color: #3d3d3d; margin: 24px 0 0;">
            Avec toute notre affection,
          </EText>
          <EText style="font-size: 20px; color: #2c2c2c; margin: 8px 0 0; font-style: italic;">
            Christiane &amp; Stéphane
          </EText>
        </ESection>

        <!-- Footer -->
        <ESection style="padding: 24px 32px; background-color: #f5ede3; border: 1px solid #e8ddd0; border-top: none; border-radius: 0 0 12px 12px; text-align: center;">
          <EText style="font-size: 12px; color: #8b7355; margin: 0; letter-spacing: 2px; text-transform: uppercase;">
            19 Décembre 2026 · Cotonou, Bénin
          </EText>
        </ESection>
      </ESection>
    </EBody>
  </EHtml>
</template>
```

- [ ] **Step 2: Verify the file was created correctly**

Open `shared/emails/GuestConfirmation.vue` and confirm it has the full template with `EHtml`, `EHead`, `EBody` structure and both attending branches.

---

### Task 4: Create OrganizerNotification.vue

**Files:**

- Create: `shared/emails/OrganizerNotification.vue` (directory created by Task 3)

Clean internal notification. Omits rows for empty dietary/message. Same component import pattern as GuestConfirmation.vue.

- [ ] **Step 1: Create the file**

```vue
<!-- shared/emails/OrganizerNotification.vue -->
<script lang="ts">
import { Body, Head, Html, Section, Text } from "@vue-email/components";

export default {
  components: {
    EHtml: Html,
    EHead: Head,
    EBody: Body,
    EText: Text,
    ESection: Section,
  },
  props: {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    attending: {
      type: String as () => "yes" | "no",
      required: true,
    },
    dietary: {
      type: String,
      default: "",
    },
    message: {
      type: String,
      default: "",
    },
  },
};
</script>

<template>
  <EHtml lang="fr">
    <EHead />
    <EBody style="background-color: #f5f5f5; margin: 0; padding: 0; font-family: Arial, sans-serif;">
      <ESection style="max-width: 560px; margin: 32px auto; padding: 0 16px;">
        <!-- Header -->
        <ESection style="background-color: #2c2c2c; padding: 20px 24px; border-radius: 8px 8px 0 0;">
          <EText style="color: #ffffff; font-size: 14px; letter-spacing: 2px; text-transform: uppercase; margin: 0;">
            Nouveau RSVP
          </EText>
        </ESection>

        <!-- Content -->
        <ESection style="background-color: #ffffff; padding: 24px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">
          <!-- Row: Nom -->
          <ESection style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #f0f0f0;">
            <EText style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #888888; margin: 0 0 4px;">
              Nom
            </EText>
            <EText style="font-size: 15px; color: #2c2c2c; margin: 0; font-weight: bold;">
              {{ name }}
            </EText>
          </ESection>

          <!-- Row: Email -->
          <ESection style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #f0f0f0;">
            <EText style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #888888; margin: 0 0 4px;">
              Email
            </EText>
            <EText style="font-size: 15px; color: #2c2c2c; margin: 0;">
              {{ email }}
            </EText>
          </ESection>

          <!-- Row: Présence -->
          <ESection style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #f0f0f0;">
            <EText style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #888888; margin: 0 0 4px;">
              Présence
            </EText>
            <EText :style="`font-size: 15px; margin: 0; font-weight: bold; color: ${attending === 'yes' ? '#2e7d32' : '#c62828'};`">
              {{ attending === 'yes' ? '✓ Présent(e)' : '✗ Absent(e)' }}
            </EText>
          </ESection>

          <!-- Row: Régime (conditional) -->
          <ESection v-if="dietary" style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #f0f0f0;">
            <EText style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #888888; margin: 0 0 4px;">
              Régime alimentaire
            </EText>
            <EText style="font-size: 15px; color: #2c2c2c; margin: 0;">
              {{ dietary }}
            </EText>
          </ESection>

          <!-- Row: Message (conditional) -->
          <ESection v-if="message" style="margin-bottom: 0;">
            <EText style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #888888; margin: 0 0 4px;">
              Message
            </EText>
            <EText style="font-size: 15px; color: #2c2c2c; margin: 0; line-height: 1.6; font-style: italic;">
              "{{ message }}"
            </EText>
          </ESection>
        </ESection>
      </ESection>
    </EBody>
  </EHtml>
</template>
```

- [ ] **Step 2: Verify the file was created**

Confirm `shared/emails/OrganizerNotification.vue` exists and has both conditional sections (`v-if="dietary"`, `v-if="message"`).

---

## Chunk 3: Server Route & Frontend

### Task 5: Create the server route

**Files:**

- Create: `server/api/rsvp.post.ts`

This is the core of the integration. It validates, renders, and sends.

- [ ] **Step 1: Create `server/` directory structure and the route file**

The `server/api/` directory does not exist yet — create it implicitly by creating the file at the correct path.

```ts
import { render } from "@vue-email/render";
import GuestConfirmation from "#shared/emails/GuestConfirmation.vue";
import OrganizerNotification from "#shared/emails/OrganizerNotification.vue";
import env from "#shared/lib/env";
import { Resend } from "resend";
// server/api/rsvp.post.ts
import { z } from "zod";

// Note: project uses Zod v4 — z.email() is a valid standalone schema in Zod v4
const schema = z.object({
  name: z.string().min(2),
  email: z.email(),
  attending: z.enum(["yes", "no"]),
  dietary: z.string().optional(),
  message: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    throw createError({ statusCode: 400, message: "Invalid form data" });
  }

  const { name, email, attending, dietary, message } = parsed.data;

  const resend = new Resend(env.RESEND_API_KEY);

  const [guestHtml, organizerHtml] = await Promise.all([
    render(GuestConfirmation, { name, attending, dietary: dietary ?? "" }),
    render(OrganizerNotification, { name, email, attending, dietary: dietary ?? "", message: message ?? "" }),
  ]);

  const [guestResult, organizerResult] = await Promise.all([
    resend.emails.send({
      from: "Christiane & Stéphane <onboarding@resend.dev>",
      to: [email],
      subject: "Christiane & Stéphane — Confirmation de votre RSVP",
      html: guestHtml,
    }),
    resend.emails.send({
      from: "Christiane & Stéphane <onboarding@resend.dev>",
      to: ["couplefagnon@gmail.com"],
      subject: `Nouveau RSVP — ${name}`,
      html: organizerHtml,
    }),
  ]);

  if (guestResult.error || organizerResult.error) {
    console.error("Resend error:", guestResult.error ?? organizerResult.error);
    throw createError({ statusCode: 500, message: "Failed to send email" });
  }

  return { success: true };
});
```

- [ ] **Step 2: Verify the dev server still starts cleanly**

```bash
pnpm dev
```

Expected: server starts, no TypeScript or import resolution errors. Press Ctrl+C when confirmed.

---

### Task 6: Update the frontend

**Files:**

- Modify: `app/pages/rsvp.vue`

Two changes: update the `<script setup>` block and update the template.

- [ ] **Step 1: Update the script block**

In `app/pages/rsvp.vue`, replace the current `onSubmit` function and add the two new refs. The `<script setup>` block should go from:

```ts
const isSubmitting = ref(false)

const presenceOptions = [...]

async function onSubmit(event: FormSubmitEvent<Schema>) {
  isSubmitting.value = true

  // Simulate API call
  // eslint-disable-next-line no-console
  console.log("Données RSVP:", event.data);

  await new Promise(resolve => setTimeout(resolve, 1500));
  isSubmitting.value = false;
}
```

To:

```ts
const isSubmitting = ref(false)
const isSubmitted = ref(false)
const submitError = ref<string | null>(null)

const presenceOptions = [...]

async function onSubmit(event: FormSubmitEvent<Schema>) {
  isSubmitting.value = true
  submitError.value = null
  try {
    await $fetch('/api/rsvp', { method: 'POST', body: event.data })
    isSubmitted.value = true
  }
  catch {
    submitError.value = "Une erreur est survenue. Veuillez réessayer."
  }
  finally {
    isSubmitting.value = false
  }
}
```

- [ ] **Step 2: Update the template — wrap form in v-if and add success panel**

The existing `<motion.div>` card (the one with class `bg-card border border-marine/10 shadow-xl rounded-2xl p-8 md:p-12`) needs to be wrapped:

```html
<motion.div
  v-if="!isSubmitted"
  :initial="{ opacity: 0, y: 30 }"
  :animate="{ opacity: 1, y: 0 }"
  :transition="{ duration: 0.8, delay: 0.2 }"
  class="bg-card border border-marine/10 shadow-xl rounded-2xl p-8 md:p-12"
>
  <UForm ...>
    ...
    <!-- Add error message above the submit button -->
    <p v-if="submitError" class="text-red-600 text-sm text-center font-medium">{{ submitError }}</p>

    <UButton ... />
  </UForm>
</motion.div>

<!-- Success panel -->
<motion.div
  v-else
  :initial="{ opacity: 0, y: 30 }"
  :animate="{ opacity: 1, y: 0 }"
  :transition="{ duration: 0.8 }"
  class="bg-card border border-marine/10 shadow-xl rounded-2xl p-8 md:p-12 text-center"
>
  <div class="flex items-center justify-center gap-4 mb-8">
    <div class="w-16 h-px bg-sable/60" />
    <Icon name="i-lucide-heart" class="text-sable" size="24" />
    <div class="w-16 h-px bg-sable/60" />
  </div>
  <h2 class="font-display text-3xl md:text-4xl text-foreground mb-4">Merci, {{ state.name }} !</h2>
  <p class="font-body text-muted-foreground text-lg leading-relaxed">
    Nous avons bien reçu votre réponse.<br />
    Un email de confirmation vous a été envoyé.
  </p>
  <div class="flex items-center justify-center gap-4 mt-8">
    <div class="w-16 h-px bg-sable/60" />
    <Icon name="i-lucide-heart" class="text-sable" size="20" />
    <div class="w-16 h-px bg-sable/60" />
  </div>
  <p class="font-display text-muted-foreground tracking-wide uppercase text-sm mt-8">Christiane &amp; Stéphane</p>
</motion.div>
```

- [ ] **Step 3: Verify the page compiles without TypeScript errors**

```bash
pnpm dev
```

Open `http://localhost:3000/rsvp` in a browser. Expected: form loads correctly, no console errors.

- [ ] **Step 4: Manual end-to-end test — submit the form**

Fill in the RSVP form with:

- Name: a test name
- Email: your own email address (so you can verify receipt)
- Attending: Yes
- Dietary: "Test"
- Message: "Test message"

Click "Envoyer ma réponse".

Expected:

- Form transitions to the thank-you panel showing the test name
- No error message appears
- Check the Resend dashboard (`resend.com/emails`) — two emails should appear (one to the test email, one to `couplefagnon@gmail.com`)
- Check the test email inbox for the guest confirmation

- [ ] **Step 5: Test the "not attending" path**

Reload the page. Fill the form with attending = "Non". Submit.

Expected: thank-you panel appears. Resend dashboard shows two emails (guest confirmation with the "not attending" message, organizer notification showing Absent(e)).

- [ ] **Step 6: Test error state (optional)**

Temporarily break the API key in `.env` (change one character), restart the dev server, submit the form.

Expected: inline red error message appears in French. Button is no longer stuck in loading state. Restore the API key when done.

---

## Deployment Note

Before going live, update the `from` address in `server/api/rsvp.post.ts` from `onboarding@resend.dev` to a verified custom domain address. The Resend sandbox default only delivers to addresses you've verified in the Resend dashboard.
