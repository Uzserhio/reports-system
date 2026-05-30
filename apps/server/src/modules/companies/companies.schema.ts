import { z } from 'zod';

export const companyStatusSchema = z.enum(['active', 'suspended', 'deleted']);

export const createCompanySchema = z.object({
  name: z.string().min(2).max(255),
  slug: z.string().min(2).max(100).regex(/^[a-z0-0-]+$/, 'Slug must be lowercase alphanumeric and hyphens only'),
  status: companyStatusSchema.optional().default('active'),
  settings: z.record(z.any()).optional().default({}),
  enabledModules: z.array(z.string().uuid()).optional().default([]),
});

export const updateCompanySchema = z.object({
  name: z.string().min(2).max(255).optional(),
  slug: z.string().min(2).max(100).regex(/^[a-z0-0-]+$/).optional(),
  status: companyStatusSchema.optional(),
  settings: z.record(z.any()).optional(),
  enabledModules: z.array(z.string().uuid()).optional(),
});

export type CreateCompanyInput = z.infer<typeof createCompanySchema>;
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;

export const companyResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  status: companyStatusSchema,
  settings: z.record(z.any()),
  enabledModules: z.array(z.string().uuid()),
  createdAt: z.date(),
  updatedAt: z.date(),
});
