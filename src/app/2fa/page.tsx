'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Suspense } from 'react';
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';
import { LogoIcon } from '@/core/commons/logo';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { useRouter } from 'next/navigation';

function TwoFactorAuthContent() {
  const router = useRouter();

  return (
    <ScrollArea className='w-full'>
      <div className='flex pt-10 sm:items-center justify-center pb-5'>
        <Card className='max-w-120 w-full p-2 max-sm:bg-transparent border-none sm:border sm:p-8'>
          <div className='flex flex-col items-center justify-center mb-4'>
            <div
              className='flex flex-col items-center justify-center cursor-pointer'
              onClick={() => router.push('/')}
            >
              <LogoIcon/>
              <h2 className='text-2xl font-bold mb-1'>Eglobalsphere</h2>
            </div>
            <h2 className='text-md font-bold'>Two Factor Authentication</h2>
            <p className='text-sm'>Enter OTP to continue to your account</p>
            {/* {serverError && (
              <p className='text-red-600 text-sm text-center mt-2'>
                {serverError}
              </p>
            )} */}
          </div>
          <form>
            <div className='mb-4'>
              <Label htmlFor='otp' className='mb-2'>
                Enter OTP
              </Label>
              <InputOTP
                maxLength={6}
                pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                // value={otpValue}
                // onChange={handleOtpChange}
                id='twoFactorVerificationCode'
              >
                <InputOTPGroup className='w-full flex gap-1'>
                  {[...Array(6)].map((_, index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className='w-full h-[52px] border rounded-md text-center text-lg'
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              {/* {errors.twoFactorVerificationCode && (
                <p className='text-red-500 text-sm mt-2'>
                  {errors.twoFactorVerificationCode.message}
                </p>
              )} */}
            </div>

            <div className='mt-10'>
              <Button
                type='submit'
                className='w-full h-10'
              >
                Continue
              </Button>
            </div>

            <div className='text-center mt-3'>
              <p
                className='cursor-pointer hover:underline duration-200'
                // onClick={() => resendTwoFactorCode()}
                // aria-disabled={resendLoading}
              >
                Resend Code
              </p>
            </div>

            <div className='mt-5 flex flex-col justify-center gap-5 items-center'>
              <Separator />
              <p className='text-center max-w-90 text-xs dark:text-gray-300 text-gray-800'>
                By logging in you agree to all <b>Eglobalsphere</b> terms and
                conditions @Eglobalsphere 2025
              </p>
            </div>
          </form>
        </Card>
      </div>
    </ScrollArea>
  );
}

export default function TwoFactorAuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TwoFactorAuthContent />
    </Suspense>
  );
}
