import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useSettingService } from '../../services/settings';
import { Switch } from '@/components/ui/switch';
// import { useCallback } from 'react';
// import { toast } from 'sonner';
// import { UserSecurityFormData } from '../../schema/settings';

export const SecuritySettings = () => {
  const {
    updateSecurity,
    securityForm: {
      formState: { errors, isSubmitting },
      handleSubmit,
      register,
    },
    toggleTwoFactor,
    settingLoading,
  } = useSettingService();

  // const handleUpdateSecurity = useCallback(async(data: UserSecurityFormData) => {
  //   try{
  //     await updateSecurity(data)
  //   } catch(error){
  //     toast.error((error as Error).message)
  //   }
  // }, [])

  return (
    <section>
      <form onSubmit={handleSubmit(updateSecurity)}>
        <div className='flex flex-row items-center justify-between'>
          <h1 className='font-bold'>Update Your password</h1>
          <Button disabled={isSubmitting} type='submit'>
            {isSubmitting ? 'updating...' : 'Update'}
          </Button>
        </div>
        <Separator className='my-5' />
        <main className='grid sm:grid-cols-2 grid-cols-1 gap-5'>
          <div className='mb-4'>
            <Label htmlFor='email' className='mb-2'>
              Current Password
            </Label>
            <Input
              type='password'
              id='email'
              placeholder='Enter Old Password'
              className='h-12'
              {...register('currentPassword')}
            />
            {errors.currentPassword && (
              <p className='text-red-500 text-sm mt-1'>
                {errors.currentPassword.message}
              </p>
            )}
          </div>
        </main>
        <main className='grid sm:grid-cols-2 grid-cols-1 gap-5'>
          <div className='mb-4'>
            <Label htmlFor='FullName' className='mb-2'>
              New Password
            </Label>
            <Input
              type='password'
              id='fullName'
              placeholder='Enter new Password'
              className='h-12'
              {...register('newPassword')}
            />
            {errors.newPassword && (
              <p className='text-red-500 text-sm mt-1'>
                {errors.newPassword.message}
              </p>
            )}
          </div>
          <div className='mb-4'>
            <Label htmlFor='email' className='mb-2'>
              Confirm New Password
            </Label>
            <Input
              type='password'
              id='email'
              placeholder='Confirm New Password'
              className='h-12'
              {...register('confirmPassword')}
            />
            {errors.currentPassword && (
              <p className='text-red-500 text-sm mt-1'>
                {errors.currentPassword.message}
              </p>
            )}
          </div>
        </main>
      </form>
      {/* <Separator className='my-5' /> */}
      {/* <main className='flex flex-row items-center justify-between'>
        <p>Change your account email</p>
        <Button>Change</Button>
      </main> */}
      <Separator className='my-5' />
      <main className='flex flex-row items-center justify-between'>
        <p>Enable 2fa for your account</p>
        <Switch
          // checked={user}
          onCheckedChange={toggleTwoFactor}
          disabled={settingLoading}
        />
      </main>
      <Separator className='my-5' />
      {/* <main className='flex flex-row items-center justify-between'>
        <p>logout every device</p>
        <Button variant='destructive'>Logout</Button>
      </main> */}
    </section>
  );
};
