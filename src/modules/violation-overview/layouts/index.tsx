import { StatsCard } from "@/modules/dashboard/components/card/statsCard";
import { StatsCardPreloader } from "@/modules/dashboard/components/card/statsCardPreloader";
import { AlertTriangle, TrendingUp, Navigation, Calendar } from "lucide-react";
import { ViolationChart } from "../components/charts";
import { useViolationOverviewService } from "../services";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const ViolationOverviewLayout = () => {
    const { data, isLoading } = useViolationOverviewService();
    
    if (isLoading) {
        return (
            <div>
                <section className='mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 max-lg:mb-5'>
                    {Array.from({ length: 4 }).map((_, index) => (
                        <StatsCardPreloader key={index} />
                    ))}
                </section>
                <div className="mt-10">
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-48" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-[400px] w-full" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    // Handle no data case
    if (!data?.success || !data?.data) {
        return (
            <div>
                <section className='mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 max-lg:mb-5'>
                    <StatsCard 
                        title="Total Violations"
                        stat={0}
                        Icon={AlertTriangle}
                    />
                    <StatsCard 
                        title="Total Oneway Violations"
                        stat={0}
                        Icon={Navigation}
                    />
                    <StatsCard 
                        title="Total Speed Violations"
                        stat={0}
                        Icon={TrendingUp}
                    />
                    <StatsCard 
                        title="Total Violations Today"
                        stat={0}
                        Icon={Calendar}
                    />
                </section>
                <div className="mt-10">
                    <ViolationChart chartData={[]} />
                </div>
            </div>
        );
    }

    const { 
        total_violations, 
        total_oneway_violations, 
        total_speed_violations, 
        violations_today,
        violationsStats 
    } = data.data;

    return (
        <div>
            <section className='mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 max-lg:mb-5'>
                <StatsCard 
                    title="Total Violations"
                    stat={total_violations}
                    Icon={AlertTriangle}
                />
                <StatsCard 
                    title="Total Oneway Violations"
                    stat={total_oneway_violations}
                    Icon={Navigation}
                />
                <StatsCard 
                    title="Total Speed Violations"
                    stat={total_speed_violations}
                    Icon={TrendingUp}
                />
                <StatsCard 
                    title="Total Violations Today"
                    stat={violations_today}
                    Icon={Calendar}
                />
            </section>

            <div className="mt-10">
                <ViolationChart chartData={violationsStats} />
            </div>
        </div>
    );
};