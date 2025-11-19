import { z } from 'zod';

export const verifyOtpSchema = z.object({
  verificationCode: z.string().min(1, { message: 'Enter OTP' }),
});

export type VerifyOtpFormData = z.infer<typeof verifyOtpSchema>;
