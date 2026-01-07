import { z } from "zod";

export const preferenceLogoSchema = z.object({
  file: z
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
});

export type PreferenceLogoFormData = z.infer<typeof preferenceLogoSchema>;

export const preferenceSchema = z.object({
  company_name: z.string().min(1, { message: 'Enter Company name' }),
//   theme_mode: z.string().min(1, { message: 'Select Theme' }),

});

export type preferenceSchemaType = z.infer<typeof preferenceSchema>;