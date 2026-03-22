# RSVP Email Integration with Resend & Vue Email

**Date:** 2026-03-15
**Status:** Approved

---

## Overview

Add email delivery to the RSVP form on the Christiane & Stéphane wedding site. When a guest submits the form, two emails are sent via Resend:

1. **Guest confirmation** — sent to the guest's email address
2. **Organizer notification** — sent to `couplefagnon@gmail.com`

The Resend API key is already configured in `.env`. The frontend form, Zod schema, and validation are already in place — only the submit handler, server-side route, and email templates need to be added.

---

## Architecture

### File Structure

```
shared/
  emails/
    GuestConfirmation.vue       # Confirmation email sent to the guest
    OrganizerNotification.vue   # Notification sent to couplefagnon@gmail.com

server/
  api/
    rsvp.post.ts                # Validates body, renders templates, sends both emails

shared/lib/
  env.ts                        # Already includes RESEND_API_KEY — no changes needed
```

### nuxt.config.ts change

Add a `nitro` block to the existing config (the current `nuxt.config.ts` has no `nitro` key, so this is a pure addition):

```ts
import vue from "@vitejs/plugin-vue";

export default defineNuxtConfig({
  // ...existing config unchanged...
  nitro: {
    rollupConfig: {
      plugins: [vue()]
    }
  }
});
```

This is the officially documented approach per vue-email docs for enabling server-side `.vue` component rendering in Nitro.

---

## Dependencies to Install

| Package                 | Purpose                                                         |
| ----------------------- | --------------------------------------------------------------- |
| `resend`                | Resend Node.js SDK for sending emails                           |
| `@vue-email/render`     | Renders Vue components to email-compatible HTML strings         |
| `@vue-email/components` | Vue Email UI primitives (Html, Head, Body, Text, Section, etc.) |
| `@vitejs/plugin-vue`    | Allows Nitro to process `.vue` files at build/runtime           |

Both `@vue-email/render` and `@vue-email/components` are separate packages — both are required. No Nuxt module needed.

---

## Server Route: `server/api/rsvp.post.ts`

**Responsibilities:**

1. Parse and validate the request body with Zod using the schema below (redeclared inline — do not import from `rsvp.vue`):

```ts
const schema = z.object({
  name: z.string().min(2),
  email: z.email(),
  attending: z.enum(["yes", "no"]),
  dietary: z.string().optional(),
  message: z.string().optional(),
});
```

2. Render both Vue Email templates. Use the async `render` function from `@vue-email/render` — it takes `(Component, props)` and returns `Promise<string>`:

```ts
import { render } from "@vue-email/render";
import GuestConfirmation from "#shared/emails/GuestConfirmation.vue";
import OrganizerNotification from "#shared/emails/OrganizerNotification.vue";

const guestHtml = await render(GuestConfirmation, { name, attending, dietary });
const organizerHtml = await render(OrganizerNotification, { name, email, attending, dietary, message });
```

3. Send both emails in parallel via `Promise.all` using the Resend Node.js SDK
4. Return `{ success: true }` on success, or throw `createError({ statusCode: 500 })` on failure

**Accessing the API key:** The `shared/` directory is accessible in server routes via Nuxt 4's `#shared` alias:

```ts
import env from "#shared/lib/env";
// then use env.RESEND_API_KEY
```

**From address:** `"Christiane & Stéphane <onboarding@resend.dev>"` — the display name should be included. This is a Resend sandbox default and must be updated to a verified custom domain before going live in production.

**Email subjects:**

- Guest confirmation: `"Christiane & Stéphane — Confirmation de votre RSVP"`
- Organizer notification: `"Nouveau RSVP — {name}"` (interpolate the guest's name)

**Error handling:** If either email in `Promise.all` fails, the entire call rejects and a 500 is returned. No partial success. The guest sees an error message and can retry. Spam/rate-limit protection is explicitly out of scope for this implementation.

---

## Email Templates

### `GuestConfirmation.vue`

Sent to the guest's email address. Warm wedding aesthetic using `@vue-email/components` primitives (`Html`, `Head`, `Body`, `Section`, `Text`, `Hr`). Cream/warm color palette to match the site.

**Props:** `name: string`, `attending: 'yes' | 'no'`, `dietary?: string`

**If attending (`yes`):**

- Subject line equivalent: "Merci, [name] ! Votre présence est confirmée."
- Body: Expresses joy at their attendance, confirms the date (19 Décembre 2026, Cotonou), echoes dietary restrictions if provided ("Nous avons bien noté : [dietary]"), signed warmly from Christiane & Stéphane.

**If not attending (`no`):**

- Subject line equivalent: "Merci de nous avoir répondu, [name]."
- Body: Graciously acknowledges they cannot make it, expresses they'll be missed ("Vous nous manquerez"), signed warmly from Christiane & Stéphane.

### `OrganizerNotification.vue`

Sent to `couplefagnon@gmail.com`. Clean, scannable internal layout using simple table/section structure. No decorative styling required.

**Props:** `name: string`, `email: string`, `attending: 'yes' | 'no'`, `dietary?: string`, `message?: string`

**Content:** All RSVP fields displayed as a labeled list:

- **Nom :** {name}
- **Email :** {email}
- **Présence :** Présent(e) / Absent(e)
- **Régime alimentaire :** {dietary} (omit row if empty)
- **Message :** {message} (omit row if empty)

---

## Frontend Integration: `app/pages/rsvp.vue`

**Context:** `isSubmitting` already exists in the component (`const isSubmitting = ref(false)`). Two new refs are added:

```ts
const isSubmitted = ref(false);
const submitError = ref<string | null>(null);
```

**Updated `onSubmit`** (replaces the current fake timeout entirely):

```ts
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
```

**Template changes:**

- Wrap the existing `<motion.div>` card containing `<UForm>` in `v-if="!isSubmitted"`
- Add a `v-else` block: a warm thank-you panel with the text "Merci, {{ state.name }} ! Nous avons bien reçu votre réponse." (`state.name` is the existing reactive form state object already declared in the component) and a decorative heart divider, consistent with the page's existing motion/animation style
- Add `<p v-if="submitError">{{ submitError }}</p>` styled as an error message (red text) directly above the submit `<UButton>`

---

## Local Development

Use the existing `RESEND_API_KEY` in `.env` for local testing. Resend will deliver real emails in test mode to verified addresses only when using `onboarding@resend.dev` as the from address. To verify delivery, check the Resend dashboard after form submission.

---

## Success Criteria

- Guest receives a styled confirmation email immediately after form submission
- Organizer receives a notification at `couplefagnon@gmail.com` with all RSVP fields
- Form transitions to a thank-you panel on success
- Form shows an inline French error message on failure; `isSubmitting` resets to `false`
- No `console.log` statements or fake timeouts remain in `onSubmit`
- `onboarding@resend.dev` is noted as temporary pending domain verification
