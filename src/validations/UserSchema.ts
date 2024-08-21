import z from "zod";

export const UserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email(),
  image: z.string().optional(),
  password: z.string().min(3),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3),
});
