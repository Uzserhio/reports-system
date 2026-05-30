import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerAdminSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(2),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterAdminInput = z.infer<typeof registerAdminSchema>;

export const authResponseSchema = z.object({
  user: z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    fullName: z.string(),
    isPlatformAdmin: z.boolean(),
    companyId: z.string().uuid().nullable(),
  }),
  accessToken: z.string(),
  refreshToken: z.string(),
});
