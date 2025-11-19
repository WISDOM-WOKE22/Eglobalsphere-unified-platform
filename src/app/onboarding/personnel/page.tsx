'use client';

import { Suspense, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import ImageUpload from '@/core/commons/components/upload';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { EyeOff, Eye } from 'lucide-react';
import { useOnboardingService } from '@/modules/onBoarding/services';

function OnboardingLayout() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    accountSetupForm: {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
      reset,
    },
    setupAccount,
    serverError,
  } = useOnboardingService();

  return (
    <div className='lg:px-10 px-4 py-5 w-full'>
      <div>
        <p>
          <b className='text-xl'>Eglobalsphere</b> unified platform
        </p>
      </div>
      <main className=' py-1 w-full flex flex-row gap-2'>
        <section className='w-full lg:max-w-xl'>
          <Progress value={10} className='w-full' />
          <div className='mt-5 flex flex-col gap-3'>
            <h1 className='text-3xl font-semibold '>
              Let&apos;s setup your Account
            </h1>
            {serverError && (
              <p className='text-red-500 text-sm'>{serverError}</p>
            )}
            <p>Create your account and get access to your organization</p>
          </div>

          <form onSubmit={handleSubmit(setupAccount)} className='mt-5'>
            <div className='mb-4'>
              <Label htmlFor='first name' className='mb-2'>
                First Name
              </Label>
              <Input
                id='firstName'
                placeholder='Enter your First Name'
                className='h-12'
                {...register('firstName')}
              />
              {errors.firstName && (
                <p className='text-red-500 text-sm'>
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className='mb-4'>
              <Label htmlFor='last name' className='mb-2'>
                Last Name
              </Label>
              <Input
                id='lastName'
                placeholder='Enter your Last Name'
                className='h-12'
                {...register('lastName')}
              />
              {errors.lastName && (
                <p className='text-red-500 text-sm'>
                  {errors.lastName.message}
                </p>
              )}
            </div>
            <div className='mb-4'>
              <Label htmlFor='email' className='mb-2'>
                Email
              </Label>
              <Input
                type='email'
                id='email'
                placeholder='Enter your email'
                className='h-12'
                {...register('email')}
              />
              {errors.email && (
                <p className='text-red-500 text-sm'>{errors.email.message}</p>
              )}
            </div>
            <div className='mb-4'>
              <Label htmlFor='password' className='mb-2'>
                Password
              </Label>
              <div className='relative'>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  id='password'
                  placeholder='Enter your password'
                  className='h-12 pr-10'
                  {...register('password')}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer'
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className='text-red-500 text-sm'>
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className='mb-4'>
              <Label htmlFor='confirmPassword' className='mb-2'>
                Confirm Password
              </Label>
              <div className='relative'>
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id='confirmPassword'
                  placeholder='Confirm your password'
                  className='h-12 pr-10'
                  {...register('confirmPassword')}
                />
                <button
                  type='button'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer'
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className='text-red-500 text-sm'>
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <Button className='mt-5' type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Loading...' : 'Next'}
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
                  placeholder='My Logo'
                  disabled={true}
                  value=""
                />
                <h1 className='text-4xl'>Eglobalsphere</h1>
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
