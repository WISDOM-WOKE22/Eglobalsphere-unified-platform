import { Skeleton } from "@/components/ui/skeleton";

export const LPRDashboardSkeleton = () => {
    return (
        <div>
            {/* Title Skeleton */}
            <Skeleton className="h-9 w-48 mb-4" />
            
            {/* Stats Cards Skeleton */}
            <section className='mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 max-lg:mb-5'>
                {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="rounded-lg border bg-card p-4 space-y-3">
                        {/* Icon Skeleton */}
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-10 w-10 rounded" />
                        </div>
                        {/* Title Skeleton */}
                        <Skeleton className="h-4 w-3/4" />
                        {/* Stat Skeleton */}
                        <Skeleton className="h-8 w-1/2" />
                    </div>
                ))}
            </section>
            
            {/* Chart Skeleton */}
            <section className="mt-7">
                <div className="rounded-lg border bg-card p-6 space-y-4">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-[400px] w-full" />
                </div>
            </section>
        </div>
    );
};