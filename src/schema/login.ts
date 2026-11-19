import z from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email not valid"),
  password: z
    .string()
    .min(8, "password must be at least 8 char")
    .regex(/[A-Z]/, "password should contain at least one captal letter")
    .regex(/[a-z]/, "password should contain at least one lower letter")
    .regex(/[0-9]/, "password should contain at least one number")
    .regex(/[^A-Za-z0-9]/, "password should contain at least captal letter"),
});

export type LoginFormSchema = z.infer<typeof loginSchema>;