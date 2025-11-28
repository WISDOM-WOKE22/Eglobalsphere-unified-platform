'use client';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  SidebarMenuItem,
  SidebarMenu,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
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
import { Button } from '@/components/ui/button';
import {
  PERMISSIONS,
  AppSidebarProps,
  MENU_ITEMS,
  MenuItem,
} from '../../constants/sidebar';
import { useRouter } from 'next/navigation';
import { LogoIcon } from '../logo';

export function MobileSidebar({ userRole, className }: AppSidebarProps) {
  const pathname = usePathname();
  const { setTheme } = useTheme();
  const router = useRouter();
  typeof userRole === 'string';
  const allowedPermissions: string[] = userRole
    ? Array.from(
      PERMISSIONS[userRole as string as keyof typeof PERMISSIONS] || []
    )
    : [];
  const accessibleMenuItems = MENU_ITEMS.filter(
    (item) => item.permission !== null
  ).filter((item) => allowedPermissions.includes(item.permission as string));

  // Group menu items
  const groupedMenuItems = accessibleMenuItems.reduce(
    (groups, item) => {
      const group = groups[item.group] || [];
      group.push(item);
      groups[item.group] = group;
      return groups;
    },
    {} as Record<string, MenuItem[]>
  );

  const isActive = (href: string) => {
    // Base route check (e.g., /dashboard)
    if (href === pathname) return true;

    // Handle nested routes
    const baseRoute = href.split('/')[1]; // Get the first segment
    const currentRoute = pathname.split('/')[1];

    // If base routes match and href is not home
    if (baseRoute === currentRoute && href !== '/') return true;

    // If the current path starts with the href (for deeper nesting)
    if (pathname.startsWith(href) && href !== '/') return true;

    return false;
  };

  const formatGroupName = (name: string) => {
    const groupLabels: Record<string, string> = {
      overview: 'Overview',
      management: 'User Management',
      communication: 'Communication',
      settings: 'System Settings',
    };
    return groupLabels[name] || name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant='ghost' size='icon' className='cursor-pointer'>
          <Menu className='size-6' />
          <span className='sr-only'>Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side='left' className='p-0 w-[260px]'>
        <div className='flex flex-col h-full'>
          {/* Header */}
          <div className='p-4 border-b'>
            <div className='flex items-center gap-2 mt-2 flex-row cursor-pointer'
              onClick={() => router.push('/dashboard')}
            >
              <LogoIcon />
              <h1 className='text-xl mb-2'>EglobalSphere</h1>
            </div>
          </div>

          {/* Menu Items */}
          <div className='flex-1 overflow-y-auto p-3'>
            <SidebarMenu className='p-3 flex flex-col gap-4'>
              {Object.entries(groupedMenuItems).map(([group, items]) => (
                <div key={group} className='flex flex-col gap-1'>
                  <div className='px-2 mb-2'>
                    <span className='text-xs font-medium text-muted-foreground'>
                      {formatGroupName(group)}
                    </span>
                  </div>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild>
                        <Link
                          href={item.href}
                          className={`h-[40px] flex items-center gap-2 rounded-md px-2
                        ${isActive(item.href)
                              ? 'bg-primary text-primary-foreground'
                              : 'hover:bg-accent hover:text-accent-foreground'
                            }`}
                        >
                          <item.icon className='h-5 w-5' />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </div>
              ))}
            </SidebarMenu>
          </div>

          {/* Footer */}
          <div className='border-t p-4'>
            <div className='flex items-center gap-2'>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar className='cursor-pointer'>
                    <AvatarFallback>
                      WW
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <div className='border-b p-1 w-full min-w-[180px]'>
                    <div className='flex flex-col text-sm'>
                      <span className='font-medium'>Wisdom</span>
                      {/* <span className="text-xs text-muted-foreground">Platform Admin</span> */}
                    </div>
                  </div>
                  <DropdownMenuItem
                    onClick={() => router.push('/dashboard/settings')}
                  >
                    <Link href='/dashboard/settings'>Settings</Link>
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
                </DropdownMenuContent>
              </DropdownMenu>
              <div className='flex flex-col text-sm'>
                <span className='font-medium'>Wisdom</span>
                {/* <span className="text-xs text-muted-foreground">Platform Admin</span> */}
              </div>
              <Button variant='ghost' size='icon' className='ml-auto'>
                <LogOut className='h-4 w-4' />
                <span className='sr-only'>Log out</span>
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
