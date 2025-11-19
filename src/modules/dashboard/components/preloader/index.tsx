'use client';
import { Skeleton } from '@/components/ui/skeleton';
import { StatsCardPreloader } from '../card/statsCardPreloader';

export const DashboardPreLoader = () => {
  return (
    <main>
      <p>Loading your data... </p>
      <section className='mt-4 grid grid-cols-2 md:grid-cols-3 gap-4 max-lg:mb-5'>
        {[1, 2, 3, 4, 5, 6].map((_) => (
          <StatsCardPreloader />
        ))}
      </section>
      <Skeleton className='h-80 w-full mt-8 rounded-2xl' />
    </main>
  );
};
