import z from "zod";

const passwordField = z
  .string()
  .min(8, "password must be atleast 8 characters")
  .regex(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/,
    "password not valid",
  );

export const changePasswordSchema = z
  .object({
    password: z.string().min(1, "Current password is required"),
    newPassword: passwordField,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "passwords should match",
  })
  .refine((data) => data.password !== data.newPassword, {
    path: ["newPassword"],
    message: "New password must be different from current password",
  });

export type ChangePasswordFormSchema = z.infer<typeof changePasswordSchema>;