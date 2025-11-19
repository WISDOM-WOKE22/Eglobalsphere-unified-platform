import {
  LayoutDashboard,
  Users,
  Mail,
  BellDotIcon,
  Flower,
  Coins,
  TableOfContents,
  CarFront,
  Logs,
  LayoutGrid,
  UserRoundPlus,
  SquareLibrary,
  DoorClosed,
  ClipboardPlus,
} from 'lucide-react';

export type UserRole =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'SUB_ADMIN'
  | 'USER'
  | 'user'
  | 'admin'
  | 'sub-admin';

export interface MenuItem {
  href: string;
  label: string;
  icon: React.ElementType;
  permission: string | null;
  group: string;
}

export const PERMISSIONS = {
  SUPER_ADMIN: [
    'dashboard',
    'schools',
    'users',
    'analytics',
    'sub-admins',
    'notifications',
    'newsletters',
    // 'subscription',
    'customization',
    'subjects',
    'questions',
    'categories',
    'codes',
    'results',
    ...(process.env.NODE_ENV === 'development' ? ['notes'] : []),
  ],
  ADMIN: [
    'dashboard',
    'schools',
    'users',
    'analytics',
    'sub-admins',
    'notifications',
    'newsletters',
    'subscription',
    'customization',
    'subjects',
    'questions',
    'categories',
    'codes',
    'results',
    ...(process.env.NODE_ENV === 'development' ? ['notes'] : []),
  ],
  SUB_ADMIN: ['dashboard', 'schools', 'notes'],
  USER: [
    'dashboard',
    'my-profile',
    'result',
    'performance',
    'my-notifications',
  ],
} as const;

export const MENU_ITEMS: MenuItem[] = [
  // Dashboard Group
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    permission: 'dashboard',
    group: 'overview',
  },
  {
    href: '/my-dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    permission: 'my-dashboard',
    group: '',
  },
  // User Management Group
  {
    href: '/spherex-dashboard',
    label: 'Spherex Overview',
    icon: LayoutGrid,
    permission: 'users',
    group: 'spherex',
  },
  {
    href: '/spherex-employees',
    label: 'Users/employees',
    icon: Users,
    permission: 'users',
    group: 'spherex',
  },
  {
    href: '/spherex-visitors',
    label: 'Visitors',
    icon: UserRoundPlus,
    permission: 'users',
    group: 'spherex',
  },
  {
    href: '/spherex-logs',
    label: 'Spherex Logs',
    icon: TableOfContents,
    permission: 'users',
    group: 'spherex',
  },
  {
    href: '/lpr-overview',
    label: 'LPR Overview',
    icon: LayoutGrid,
    permission: 'users',
    group: 'LPR',
  },
  {
    href: '/lpr-plates',
    label: 'License plates',
    icon: SquareLibrary,
    permission: 'users',
    group: 'LPR',
  },
  {
    href: '/lpr-gates',
    label: 'Gates',
    icon: DoorClosed,
    permission: 'users',
    group: 'LPR',
  },
  {
    href: '/lpr-logs',
    label: 'LPR Logs',
    icon: TableOfContents,
    permission: 'users',
    group: 'LPR',
  },
  {
    href: '/violation-overview',
    label: 'Vehicle Violation Overview',
    icon: CarFront,
    permission: 'users',
    group: 'Vehicle Violation',
  },
  {
    href: '/violation-logs',
    label: 'Vehicle Violation Logs',
    icon: Logs,
    permission: 'users',
    group: 'Vehicle Violation',
  },
  {
    href: '/farouq-overview',
    label: 'Farouq Overview',
    icon: LayoutGrid,
    permission: 'users',
    group: 'Farouq factory',
  },
  {
    href: '/farouq-employees',
    label: 'Employees',
    icon: Users,
    permission: 'users',
    group: 'Farouq factory',
  },
  {
    href: '/farouq-logs',
    label: 'Farouq Logs',
    icon: TableOfContents,
    permission: 'users',
    group: 'Farouq factory',
  },
  // Communication Group
  {
    href: '/notifications',
    label: 'Notifications',
    icon: BellDotIcon,
    permission: 'notifications',
    group: 'communication',
  },
  {
    href: '/reports',
    label: 'Reports',
    icon: ClipboardPlus,
    permission: 'notifications',
    group: 'communication',
  },
  {
    href: '/newsletters',
    label: 'Newsletters',
    icon: Mail,
    permission: 'newsletters',
    group: 'communication',
  },
  {
    href: '/customizations',
    label: 'Customization',
    icon: Flower,
    permission: 'customization',
    group: 'settings',
  },
  {
    href: '/licenses',
    label: 'Licenses',
    icon: Coins,
    permission: 'subscription',
    group: 'settings',
  },

];

export interface AppSidebarProps {
  userRole: UserRole | undefined | null;
  className?: string;
}
