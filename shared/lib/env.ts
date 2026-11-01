import { z } from "zod";

import tryParseEnv from "./try-parse-env";

const EnvSchema = z.object({
  NODE_ENV: z.string(),
  RESEND_API_KEY: z.string(),
  GOOGLE_MAPS_API_KEY: z.string().min(1),
  // Override on Vercel Preview so test RSVPs don't reach the couple
  RSVP_ORGANIZER_EMAIL: z.email().default("couplefagnon@gmail.com"),
});

export type EnvSchema = z.infer<typeof EnvSchema>;

export default tryParseEnv(EnvSchema);
