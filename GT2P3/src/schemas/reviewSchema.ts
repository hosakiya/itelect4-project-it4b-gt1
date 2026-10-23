import { z } from "zod";

// The same two limits as aiRequestSchema in itelect4-backend, with the
// same messages, so the browser says it before a request is spent.
export const reviewFormSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(20, "Describe your project or reading inquiry in at least 20 characters.")
    .max(2000, "Keep your inquiry under 2000 characters."),
});

export type ReviewFormValues = z.infer<typeof reviewFormSchema>;
