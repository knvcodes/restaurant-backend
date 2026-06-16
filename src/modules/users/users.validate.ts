import { z } from "zod";

// Validation schema for listing userss
export const usersListingSchema = z.object({
  query: z.object({
    search: z.string().optional(),
    limit: z
      .string()
      .regex(/^[0-9]+$/, "Limit must be a valid number")
      .optional(),
  }),
});

// Validation schema for users details
export const usersDetailsSchema = z.object({
  params: z.object({
    id: z.string().min(1, "users id is required"),
  }),
});