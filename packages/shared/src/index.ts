import { z } from 'zod';

export const version = '1.0.0';

export const HealthResponseSchema = z.object({
  status: z.string(),
  version: z.string(),
});

export type HealthResponse = z.infer<typeof HealthResponseSchema>;
