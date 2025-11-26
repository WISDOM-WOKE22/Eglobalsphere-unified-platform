'use client';

import AppSidebar from '../sidebar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuSubTrigger,
  DropdownMenuSub,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar';
import { MobileSidebar } from '../sidebar/mobileSidebar';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { getStatusBadge } from '../components/badge/badge';

export default function NavBar({
  title,
  subHeading,
}: {
  title: string;
  subHeading?: string;
}) {
  const { setTheme } = useTheme();
  const router = useRouter();

  return (
    <nav className='h-14 border-b flex justify-between items-center w-full px-4 fixed z-1 backdrop-blur-md'>
      <AppSidebar userRole={"ADMIN"} />
      <main className='flex justify-between items-center w-full relative backdrop-blur-md max-lg:hidden'>
        <div className='relative -left-2'>
          <h1 className='text-xl font-bold'>{title}</h1>
          <p className='text-[12px] text-gray-600 dark:text-gray-300'>
            {subHeading}
          </p>
        </div>
        <div className='flex flex-row items-center gap-3'>
          <Button
            variant="glass"
          ><Bell /></Button>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className='cursor-pointer border'>
                <AvatarFallback>
                  WW
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <div className='border-b p-1 w-full min-w-[180px]'>
                <div className='flex flex-col text-sm'>
                  <span className='font-medium'>Wisdom</span>
                  <span className='text-xs text-muted-foreground'>
                    wisdomwokedev@gmail.com
                  </span>
                </div>
              </div>
              <DropdownMenuItem
                onClick={() => router.push('/dashboard/settings')}
                className='cursor-pointer'
              >
                Setting
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Theme</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem onClick={() => setTheme('light')}>
                      Light
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('dark')}>
                      Dark
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('system')}>
                      System
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuItem
                className='bg-red-400 cursor-pointer'
              >
                logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </main>

      {/* Mobile Navigation */}
      <main className='w-full justify-between items-center flex flex-row lg:hidden'>
        <MobileSidebar userRole={null} />
        <h1 className='text-xl' onClick={() => router.push('/dashboard')}>
          Eglobalsphere
        </h1>
      </main>
    </nav>
  );
}
