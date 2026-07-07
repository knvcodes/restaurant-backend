import { z } from "zod";
import { message } from "../../utils/messages.js";

// Schema for adding a new dish
export const addDishSchema = z.object({
  body: z.object({
    name: z.string().min(1, message.validation.addDish.name.required),
    description: z
      .string(message.validation.addDish.description.invalid)
      .optional(),
    isActive: z.boolean(message.validation.addDish.isActive.invalid).optional(),
    tags: z
      .array(z.string(), message.validation.addDish.tags.invalid)
      .optional(),
    metadata: z
      .record(z.string(), z.any(), message.validation.addDish.metadata.invalid)
      .optional(),
    supplements: z
      .array(z.string(), message.validation.addDish.supplements.invalid)
      .optional(),
    serving: z
      .array(
        z.object({
          title: z.string(message.validation.addDish.serving.title.invalid),
          value: z.number(message.validation.addDish.serving.value.invalid),
          price: z.number(message.validation.addDish.serving.price.invalid),
          currency: z.string(
            message.validation.addDish.serving.currency.invalid,
          ),
        }),
        message.validation.addDish.serving.invalid,
      )
      .optional(),
    restaurantId: z.string(message.validation.addDish.restaurantId.invalid),
  }),
});

// Schema for listing dishes (query params)
export const dishesListingSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    search: z.string().optional(),
    restaurantId: z.string().optional(),
  }),
});
