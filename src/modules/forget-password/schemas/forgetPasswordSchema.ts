import { z } from 'zod';

export const forgetPasswordSchema = z.object({
  email: z.string().email({ message: 'Email is required' }),
});

export type ForgetPasswordFormData = z.infer<typeof forgetPasswordSchema>;
