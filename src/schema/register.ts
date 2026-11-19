import z from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "at least 2 char")
      .max(20, "at most 20 char"),
    username: z
      .string()
      .min(2, "at least 2 char")
      .max(20, "at most 20 char"),
    email: z.string().email("Email not valid"),
    password: z
      .string()
      .min(8, "password must be at least 8 char")
      .regex(/[A-Z]/, "password should contain at least one captal letter")
      .regex(/[a-z]/, "password should contain at least one lower letter")
      .regex(/[0-9]/, "password should contain at least one number")
      .regex(/[^A-Za-z0-9]/, "password should contain at least captal letter"),
    rePassword: z.string(),
    dateOfBirth: z.string().refine((value) => {
      return new Date().getFullYear() - new Date(value).getFullYear() >= 16;
    }, "age must be greater that 16 year"),
    gender: z.enum(["male", "female"], { message: "please choose a gender" }),
  })
  .refine((data) => data.password === data.rePassword, {
    path: ["rePassword"],
    message: "should matches",
  });

export type RegisterFormSchema = z.infer<typeof registerSchema>;