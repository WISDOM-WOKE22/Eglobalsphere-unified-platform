import { z } from 'zod';

export const userPreferenceSchema = z.object({
  image: z
    .union([
      z
        .instanceof(File)
        .refine((file) => file.size <= 5 * 1024 * 1024, {
          message: 'File size must be less than 5MB',
        })
        .refine((file) => ['image/jpeg', 'image/png'].includes(file.type), {
          message: 'File must be a JPEG, PNG, or PDF',
        }),
      z.string().url(),
    ])
    .optional(),
  firstName: z.string().min(1, { message: 'Enter First Name' }),
  lastName: z.string().min(1, { message: 'Enter Last Name' }),
});

export type UserPreferenceFormData = z.infer<typeof userPreferenceSchema>;

export const userSecuritySchema = z.object({
  currentPassword: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' }),
  newPassword: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' }),
  confirmPassword: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' }),
});

export type UserSecurityFormData = z.infer<typeof userSecuritySchema>;
