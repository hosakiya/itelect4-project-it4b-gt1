import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("That is not an email address."),
  password: z.string().min(8, "At least 8 characters."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = loginSchema.extend({
  name: z.string().min(1, "Your name is required."),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
