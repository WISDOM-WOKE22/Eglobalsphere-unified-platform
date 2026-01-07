'use client';

export const DashboardSkeleton = () => {
  return (
    <main>
      <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />

      {/* Stats Cards Skeleton */}
      <section className='mt-4 grid grid-cols-2 md:grid-cols-3 gap-4 max-lg:mb-5'>
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </section>

      {/* Charts Skeleton */}
      <section className='mt-7'>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4">
          <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="h-80 bg-gray-100 dark:bg-gray-700/50 rounded animate-pulse" />
        </div>
      </section>

      <section className="mt-6 grid grid-cols-2 gap-4 max-lg:grid-cols-1">
        {[...Array(2)].map((_, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4"
          >
            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-64 bg-gray-100 dark:bg-gray-700/50 rounded animate-pulse" />
          </div>
        ))}
      </section>
    </main>
  );
};