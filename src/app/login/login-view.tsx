'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { useLogin } from '@/modules/login/services/login';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import logo from '@/assets/logo-icon.svg';

const LoginPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    form: {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
    },
    login,
    serverError,
  } = useLogin();

//   useEffect(() => {
//     router.push('/onboarding/personnel');
//   }, []);

  return (
    <ScrollArea className='w-full'>
      <div className='flex pt-10 sm:items-center justify-center pb-5'>
        <Card className='w-full max-w-120 p-2 max-sm:bg-transparent border-none sm:border sm:p-8'>
          <div
            className='flex flex-col items-center justify-center mb-4 cursor-pointer'
            onClick={() => router.push('/')}
          >
            <Image
              src={logo}
              height={40}
              width={40}
              className='rounded-lg mb-1'
              alt='logo'
            />
            <h2 className='text-2xl font-bold mb-1'>Eglobalsphere</h2>
            <h2 className='text-md font-bold'>Login Your Account</h2>
            {serverError && (
              <p className='text-red-600 text-sm text-center'>{serverError}</p>
            )}
          </div>
          <form onSubmit={handleSubmit(login)}>
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
            <div className='mt-6'>
              <Button type='submit' className='w-full cursor-pointer h-10'>
                {isSubmitting ? 'Logging in...' : 'Login'}
              </Button>
            </div>

            {/* <div className='mt-8 flex items-center gap-5 justify-center'>
              <Separator className='w-full max-w-30' />
              <p>OR</p>
              <Separator className='w-full max-w-30' />
            </div> */}

            {/* <div className='flex justify-center mt-6'>
              <Button className='cursor-pointer'>Sign in with Google</Button>
            </div> */}

            <div className='flex flex-row justify-center items-center mt-4 gap-4 relative left-4'>
              <Link href='/forget-password' className='hover:underline mt-4'>
                Can&apos;t Login
              </Link>
            </div>

            <div className='mt-5 flex flex-col justify-center gap-5 items-center'>
              <Separator />
              <p className='text-center max-w-90 text-xs dark:text-gray-300 text-gray-800'>
                By loging in you agree to all <b>Eglobalsphere</b> terms and
                conditions @Eglobalsphere 2026
              </p>
            </div>
          </form>
        </Card>
      </div>
    </ScrollArea>
  );
};

export default LoginPage;
