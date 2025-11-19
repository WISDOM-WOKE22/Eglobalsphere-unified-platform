import { z } from 'zod';

export const twoFactorSchema = z.object({
  twoFactorVerificationCode: z.string().min(1, { message: 'Enter OTP' }),
});

export type TwoFactorFormData = z.infer<typeof twoFactorSchema>;
