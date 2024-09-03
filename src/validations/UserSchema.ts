import z from "zod";

export const UserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email(),
  image: z.string().optional(),
  password: z.string().min(3),
  role: z.enum(["user", "manager", "admin"]).optional().default("user"),
  organizationId: z.string().optional(),
  isOrganization: z.boolean().optional().default(false),
  macAddress: z
    .string()
    .regex(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/, "Invalid MAC Address")
    .optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3),
});
