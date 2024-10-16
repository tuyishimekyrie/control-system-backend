import z from "zod";

export const UserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email(),
  image: z.string().optional(),
  password: z.string().min(3),
  role: z
    .enum(["user", "manager", "school", "parent", "admin"])
    .optional()
    .default("user"),
  organizationId: z.string().optional(),
  isOrganization: z.boolean().optional().default(false),
  schoolId: z.string().optional(),
  isSchool: z.boolean().optional().default(false),
  parentId: z.string().optional(),
  isParent: z.boolean().optional().default(false),
  macAddress: z
    .string()
    .regex(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/, "Invalid MAC Address")
    .optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3),
});

export const updatePasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  newPassword: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});
