import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1),
  price: z.number().nonnegative(),
  status: z.enum(['active', 'inactive']).optional().default('active'),
  category: z.string().min(1).optional(),
  stock: z.number().int().nonnegative().optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const changeStatusSchema = z.object({
  status: z.enum(['active', 'inactive']),
});