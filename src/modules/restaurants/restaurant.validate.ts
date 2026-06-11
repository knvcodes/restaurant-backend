import { z } from "zod";

export const restaurantListingSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    limit: z
      .string()
      .regex(/^[0-9]+$/, "Limit must be a valid number")
      .optional(),
  }),
});

export const restaurantDetailsSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Restaurant id is required"),
  }),
});
