import { z } from 'zod';

export const reservationSchema = z
  .object({
    userId: z.union([z.string(), z.number()]).optional(),
    pickupDeadline: z.string().min(1, "Pickup deadline is required"),
    quantity: z.number().int().min(1).max(3),
    purpose: z.string().trim().max(1000).refine((value) => {
      const words = value.split(/\s+/).filter(Boolean).length;
      return words >= 5 && words <= 20;
    }, "Purpose of borrowing must be 5 to 20 words."),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the library policies",
    }),
  })
  .refine(
    (data) => {
      if (!data.pickupDeadline) return false;
      const deadline = new Date(data.pickupDeadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return deadline > today;
    },
    {
      message: "Pickup deadline must be in the future",
      path: ["pickupDeadline"],
    }
  );

export type ReservationFormValues = z.infer<typeof reservationSchema>;
