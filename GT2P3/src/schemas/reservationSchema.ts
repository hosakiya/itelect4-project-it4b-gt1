import { z } from 'zod';

export const reservationSchema = z
  .object({
    userId: z
      .number({ message: "User ID must be a number" })
      .int("User ID must be an integer")
      .positive("User ID must be a positive number"),
    pickupDeadline: z.string().min(1, "Pickup deadline is required"),
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
