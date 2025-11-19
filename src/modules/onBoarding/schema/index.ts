import { z } from 'zod';

export const organizationSetupSchema = z.object({
  image: z.union([
    z
      .instanceof(File)
      .refine((file) => file.size <= 5 * 1024 * 1024, {
        message: 'File size must be less than 5MB',
      })
      .refine((file) => ['image/jpeg', 'image/png'].includes(file.type), {
        message: 'File must be a JPEG, PNG, or PDF',
      }),
    z.string().url(),
  ]),
  name: z.string().min(1, { message: 'Enter Organization Name' }),
  isOnboarded: z.boolean().optional(),
});

export type OrganizationSetupFormData = z.infer<typeof organizationSetupSchema>;

export const accountSchema = z.object({
  firstName: z.string().min(1, { message: 'First Name is required' }),
  lastName: z.string().min(1, { message: 'Last Name is required' }),
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email address' })
    .optional(),
  code: z.string().optional(),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' }),
  confirmPassword: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' }),
});

export type accountFormData = z.infer<typeof accountSchema>;

export const OrganizationDetailsSchema = z.object({
  description: z.string().min(1, { message: 'Describe your organization' }),
  usersRange: z.string().min(1, { message: 'Select your users range' }),
  phone: z.string().min(1, { message: 'provide organization mobile number' }),
  country: z.string().min(1, { message: 'Select your country' }),
  staffRange: z.string().min(1, { message: 'Select your staff range' }),
});

export type OrganizationDetailsFormData = z.infer<
  typeof OrganizationDetailsSchema
>;
