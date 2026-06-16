import { ADMIN, CUSTOMER, OWNER } from "config/vars";
import { message } from "utils/messages";
import { z } from "zod";

// Validation schema for listing auths
export const authRegisterSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(3, message.validation.user.name.min)
      .regex(/[a-z,A-Z]/, message.validation.user.name.invalid),
    email: z.email(message.validation.user.email.invalid),
    password: z
      .string()
      .min(8)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        message.validation.user.password.invalid,
      ),
    role: z.enum([ADMIN, OWNER, CUSTOMER]),
  }),
});

export const authLoginSchema = z.object({
  body: z.object({
    email: z.email(message.validation.user.email.invalid),
    password: z
      .string()
      .min(8)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        message.validation.user.password.invalid,
      ),
  }),
});
