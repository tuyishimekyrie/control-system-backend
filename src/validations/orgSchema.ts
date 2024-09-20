import z from "zod";

export const OrganizationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
});

export const OrganizationUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  maxUsers: z.number().int().optional(),
});

export const ParentSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
});

export const ParentUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  maxUsers: z.number().int().optional(),
});

export const SchoolSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
});

export const SchoolUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  maxUsers: z.number().int().optional(),
});
