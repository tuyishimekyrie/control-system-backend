import z from "zod";

export const OrganizationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
});

export const OrganizationUpdateSchema = z.object({
  name: z.string().min(1).optional(),
});
