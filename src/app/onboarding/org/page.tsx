/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Suspense, useCallback, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import ImageUpload from '@/core/commons/components/upload';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { BackButton } from '@/core/commons/navigation/backButton';
import { toast } from 'sonner';
import { useOnboardingService } from '@/modules/onBoarding/services';
import { OrganizationSetupFormData } from '@/modules/onBoarding/schema';

function OnboardingLayout() {

  const {
    organizationForm: {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
      setValue,
      watch,
      reset,
    },
    setupOrganization,
    serverError,
  } = useOnboardingService();

  const image = watch('image');
  const organizationName = watch('name');

  useEffect(() => {
    reset({
      name: organizationName,
      image: image ?? '',
    });
  }, []);

  const onSubmit = useCallback(
    async (data: OrganizationSetupFormData) => {
      try {
        if (!image) {
          toast.error('Please select an image');
          return;
        }

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('image', image);
        formData.append('isOnboarded', 'true');

        await setupOrganization(formData);
      } catch (error: any) {
        console.error('Failed to create:', error);
        toast.error(serverError || 'Failed to create ');
      }
    },
    [setupOrganization, image, serverError]
  );

  return (
    <div className='lg:px-10 px-4 py-5'>
      <div>
        <p>
          <b className='text-xl'>Eglobalsphere</b> unified platform
        </p>
      </div>
      <main className=' py-1 w-full flex flex-row gap-2'>
        <section className='w-full lg:max-w-xl'>
          <Progress value={66.33} className='w-full my-2' />
          <BackButton title='back' />
          <div className='mt-4 flex flex-col gap-3'>
            <h1 className='text-3xl font-semibold '>
              Let&apos;s setup your Organization
            </h1>
            {serverError && (
              <p className='text-red-500 text-sm'>{serverError}</p>
            )}
            <p>
              We’ll start by setting up your organization with just the
              essentials — no long forms, just the key info we need to tailor
              your experience.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='mt-5'>
              <ImageUpload
                placeholder='Upload Logo'
                value={image}
                onChange={(file) => {
                  if (file) {
                    console.log(file);
                    setValue('image', file, { shouldValidate: true });
                  }
                }}
              />
              {errors.image && (
                <p className='text-red-500 text-sm mt-1'>
                  {errors.image.message}
                </p>
              )}
            </div>

            <div className='mt-5 gap-1'>
              <Label>Organization name</Label>
              <Input
                placeholder='Enter Organization name'
                className='mt-2'
                disabled
                {...register('name')}
              />
            </div>

            <Button className='mt-5' type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Loading' : 'Finish'}
            </Button>
          </form>
        </section>

        <section className='max-lg:hidden'>
          <main className='border w-full h-screen fixed top-20 left-[45%] right-0 rounded-lg shadow-lg'>
            <div className='p-4 bg-gray-50 dark:bg-gray-800 rounded-t-lg'>
              <div className='flex flex-row gap-2'>
                <div className='size-5 bg-gray-400 rounded-full cursor-pointer' />
                <div className='size-5 bg-gray-400 rounded-full cursor-pointer' />
                <div className='size-5 bg-gray-400 rounded-full cursor-pointer' />
              </div>
            </div>
            <Separator />

            <div className='flex flex-col gap-5 p-4'>
              <div className='flex flex-row items-center gap-3'>
                <ImageUpload
                  placeholder='Upload Logo'
                  disabled={true}
                  value={image}
                />
                <h1 className='text-4xl'>{organizationName}</h1>
              </div>
            </div>
            <Separator />
          </main>
        </section>
      </main>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OnboardingLayout />
    </Suspense>
  );
}
