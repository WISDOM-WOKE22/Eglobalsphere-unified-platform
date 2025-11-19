'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';
import { Suspense } from 'react';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { useVerifyOtp } from '@/modules/verify-otp/services';
import { LogoIcon } from '@/core/commons/logo';

const VerifyAccountContent = () => {
  const {
    form: {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
      setValue,
      watch,
    },
    verifyOtp,
    serverError,
    resendVerificationCode,
    resendLoading,
  } = useVerifyOtp();

  // Watch OTP value for controlled input
  const otpValue = watch('verificationCode');

  // Update form value when OTP changes
  const handleOtpChange = (value: string) => {
    setValue('verificationCode', value, { shouldValidate: true });
  };

  return (
    <ScrollArea className='w-full h-screen'>
      <div className='flex pt-10 sm:items-center justify-center pb-5 min-h-[calc(100vh-80px)]'>
        <Card className='max-w-[480px] w-full p-2 max-sm:bg-transparent sm:border sm:p-8'>
          <div className='flex flex-col items-center justify-center mb-6'>
            <LogoIcon/>
            <h2 className='text-2xl font-bold mb-1'>Eglobalsphere</h2>
            <h3 className='text-md font-semibold'>Account Verification</h3>
            <p className='text-sm text-center text-gray-600'>
              Enter the OTP code sent to your email to continue
            </p>
            {serverError && (
              <p className='text-red-600 text-sm text-center mt-2'>
                {serverError}
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit(verifyOtp)} noValidate>
            <div className='mb-6'>
              <Label htmlFor='verificationCode' className='block mb-2'>
                Enter OTP
              </Label>
              <InputOTP
                maxLength={6}
                pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                value={otpValue}
                onChange={handleOtpChange}
                id='verificationCode'
              >
                <InputOTPGroup className='w-full flex gap-1'>
                  {[...Array(6)].map((_, index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className='w-full h-[52px] border rounded-md text-center text-lg'
                      {...register('verificationCode', {
                        required: 'OTP is required',
                        pattern: {
                          value: /^[0-9]{6}$/,
                          message: 'OTP must be 6 digits',
                        },
                      })}
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              {errors.verificationCode && (
                <p className='text-red-500 text-sm mt-2'>
                  {errors.verificationCode.message}
                </p>
              )}
            </div>

            <Button
              type='submit'
              className='w-full h-10'
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Verifying OTP...' : 'Continue'}
            </Button>
            <div className='text-center mt-3'>
              <p
                className='cursor-pointer hover:underline duration-200'
                onClick={() => resendVerificationCode()}
                aria-disabled={resendLoading}
              >
                {resendLoading ? 'Loading...' : 'Resend Code'}
              </p>
            </div>

            <Separator className='my-6' />

            <div className='text-center'>
              <p className='text-xs text-gray-600 dark:text-gray-300'>
                By creating this account you agree to all <b>Eglobalsphere</b> terms
                and conditions @Eglobalsphere 2025
              </p>
            </div>
          </form>
        </Card>
      </div>
    </ScrollArea>
  );
};

export default function VerifyAccountPage() {
  return (
    <Suspense fallback={<div>Loading..</div>}>
      <VerifyAccountContent />
    </Suspense>
  );
}
