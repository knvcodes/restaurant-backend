import { message } from "utils/messages";
import { z } from "zod";

// Validation schema for listing owners
export const ownerRegisterSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(3, message.validation.owner.name.min)
      .regex(/[a-z,A-Z]/, message.validation.owner.name.invalid),
    email: z.email(message.validation.owner.email.invalid),
    password: z
      .string()
      .min(8)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        message.validation.owner.password.invalid,
      ),
  }),
});

export const ownerLoginSchema = z.object({
  body: z.object({
    email: z.email(message.validation.owner.email.invalid),
    password: z
      .string()
      .min(8)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        message.validation.owner.password.invalid,
      ),
  }),
});
