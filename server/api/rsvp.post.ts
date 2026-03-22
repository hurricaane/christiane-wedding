import { render } from "@vue-email/render";
import GuestConfirmation from "#shared/emails/GuestConfirmation.vue";
import OrganizerNotification from "#shared/emails/OrganizerNotification.vue";
import env from "#shared/lib/env";
import { Resend } from "resend";
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

  const resend = new Resend(env?.RESEND_API_KEY);

  const [guestHtml, organizerHtml] = await Promise.all([
    render(GuestConfirmation, { name, attending, dietary: dietary ?? "" }),
    render(OrganizerNotification, { name, email, attending, dietary: dietary ?? "", message: message ?? "" }),
  ]);

  const [guestResult, organizerResult] = await Promise.all([
    resend.emails.send({
      from: "Christiane & Stéphane <wedding@luminaconsulting.fr>",
      to: [email],
      subject: "Christiane & Stéphane — Confirmation de votre RSVP",
      html: guestHtml,
    }),
    resend.emails.send({
      from: "Christiane & Stéphane <wedding@luminaconsulting.fr>",
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
