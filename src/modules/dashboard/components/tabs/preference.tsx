/* eslint-disable @typescript-eslint/no-explicit-any */
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ImageUpload from '@/core/commons/components/upload';
import { useSettingService } from '../../services/settings';
import { useCallback, useEffect } from 'react';
import { UserPreferenceFormData } from '../../schema/settings';
import { toast } from 'sonner';


export const PreferenceSettings = () => {
  const {
    updateForm: {
      formState: { isSubmitting, errors },
      setValue,
      register,
      handleSubmit,
      watch,
      reset,
    },
    serverError,
    updatePreference,
  } = useSettingService();
  const image = watch('image');

  const handleUpdate = useCallback(
    async (data: UserPreferenceFormData) => {
      try {
        const formData = new FormData();
        if (data?.image) {
          formData.append('image', data.image);
        }
        formData.append('firstName', data.firstName);
        formData.append('lastName', data.lastName);

        await updatePreference(formData);
      } catch (error: any) {
        toast.error(serverError || 'Failed to create');
      }
    },
    [serverError]
  );

  return (
    <form onSubmit={handleSubmit(handleUpdate)}>
      <div className='flex flex-row items-center justify-between'>
        <h1 className='font-bold'>Preference Settings</h1>
        <Button type='submit' disabled={isSubmitting}>
          {isSubmitting ? 'updating...' : 'Edit'}
        </Button>
      </div>
      <Separator className='my-4' />
      <main>
        <ImageUpload
          value={image}
          onChange={(file) => {
            if (file) {
              setValue('image', file, { shouldValidate: true });
            }
          }}
          error={errors.image?.message}
        />
      </main>
      <main className='grid sm:grid-cols-2 grid-cols-1 gap-5 mt-5'>
        <div className='mb-4'>
          <Label htmlFor='email' className='mb-2'>
            First Name
          </Label>
          <Input
            type='text'
            id='email'
            placeholder='Enter First Name'
            className='h-12'
            {...register('firstName')}
          />
          {errors.firstName && (
            <p className='text-red-500 text-sm mt-1'>
              {errors.firstName.message}
            </p>
          )}
        </div>
        <div className='mb-4'>
          <Label htmlFor='email' className='mb-2'>
            Last Name
          </Label>
          <Input
            type='text'
            id='email'
            placeholder='Enter Last Name'
            className='h-12'
            {...register('lastName')}
          />
          {errors.lastName && (
            <p className='text-red-500 text-sm mt-1'>
              {errors.lastName.message}
            </p>
          )}
        </div>
      </main>
    </form>
  );
};
