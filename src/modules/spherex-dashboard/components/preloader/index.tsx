import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Elegant skeleton for individual stat cards
const StatsCardSkeleton = () => {
  return (
    <Card className='w-full p-0 gap-0 animate-in fade-in-50 duration-500'>
      <CardHeader className='p-3 flex items-center justify-between'>
        <Skeleton className='h-4 w-32' />
        <Skeleton className='h-4 w-4 rounded' />
      </CardHeader>
      <CardContent className='p-3'>
        <Skeleton className='h-9 w-20' />
      </CardContent>
    </Card>
  );
};

// Elegant skeleton for the activity chart
const ActivityChartSkeleton = () => {
  return (
    <Card className='w-full animate-in fade-in-50 duration-500'>
      <CardHeader>
        <Skeleton className='h-6 w-40 mb-2' />
        <Skeleton className='h-4 w-64' />
      </CardHeader>
      <CardContent className='h-[400px] p-6'>
        <div className='h-full w-full flex items-end justify-between gap-4 px-8'>
          {/* Animated bar chart skeleton */}
          {[65, 45, 75, 55, 85, 40, 70].map((height, index) => (
            <div key={index} className='flex-1 flex flex-col items-center gap-2'>
              <Skeleton 
                className='w-full rounded-t-lg' 
                style={{ 
                  height: `${height}%`,
                  animationDelay: `${index * 100}ms`
                }} 
              />
              <Skeleton className='h-3 w-8' />
            </div>
          ))}
        </div>
      </CardContent>
      <div className='px-6 pb-6 flex flex-col gap-2'>
        <Skeleton className='h-4 w-48' />
        <Skeleton className='h-3 w-72' />
      </div>
    </Card>
  );
};

// Main dashboard skeleton preloader
export const SpherexDashboardSkeleton = () => {
  return (
    <main>
      {/* Header skeleton */}
      <div className="flex flex-row items-center gap-3 justify-between mb-4 animate-in fade-in-50 duration-300">
        <Skeleton className='h-8 w-48' />
        <Skeleton className='h-10 w-44 rounded-md' />
      </div>
      
      {/* Stats cards grid skeleton */}
      <section className='mt-4 grid grid-cols-2 md:grid-cols-3 gap-4 max-lg:mb-5'>
        {Array.from({ length: 6 }).map((_, index) => (
          <div 
            key={index}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <StatsCardSkeleton />
          </div>
        ))}
      </section>
      
      {/* Activity chart skeleton */}
      <section className="mt-10" style={{ animationDelay: '350ms' }}>
        <ActivityChartSkeleton />
      </section>
    </main>
  );
};

