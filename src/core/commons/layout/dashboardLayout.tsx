'use client';

import NavBar from '../navigation/navigation';
// import { NotificationModal } from '@/modules/dashboard/components/modal/notification';

export default function DashboardLayout({
  children,
  pageTitle,
  subHeading,
}: {
  children: React.ReactNode;
  pageTitle: string;
  subHeading?: string;
}) {
  return (
    <main className='w-full lg:overflow-x-hidden'>
      <NavBar title={pageTitle} subHeading={subHeading} />
      <div className='pl-[25px] max-[500px]:px-[10px] md:pl-[260px] pt-[75px] pr-[25px] pb-[25px]'>
        {children}
      </div>
      {/* <NotificationModal /> */}
    </main>
  );
}
