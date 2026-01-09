import { StatsCard } from "@/modules/dashboard/components/card/statsCard";
import { StatsCardPreloader } from "@/modules/dashboard/components/card/statsCardPreloader";
import { FarouqAttendanceChart, FarouqOverviewChart } from "@/modules/farouq-overview/components/charts";
import { Users, UserCheck, UserX, AlertTriangle, TrendingUp, Briefcase, MapPin, Camera, Loader2, RefreshCw } from "lucide-react";
import { useFarouqOverviewService } from "../services";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const FarouqOverviewLayout = () => {
    const { data, isLoading, isSyncing, syncFarouqLogs } = useFarouqOverviewService();
    
    if (isLoading) {
        return (
            <div>
                <section className='mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 max-lg:mb-5'>
                    {Array.from({ length: 8 }).map((_, index) => (
                        <StatsCardPreloader key={index} />
                    ))}
                </section>
                <div className="mt-10 flex flex-col gap-10">
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-48" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-[400px] w-full" />
                        </CardContent>
                    </Card>
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
    if (!data?.doc || data.status !== 'success') {
        return (
            <div>
                <section className='mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 max-lg:mb-5'>
                    <StatsCard title="Total Employees" stat={0} Icon={Users} />
                    <StatsCard title="Total Present today" stat={0} Icon={UserCheck} />
                    <StatsCard title="Total Absent today" stat={0} Icon={UserX} />
                    <StatsCard title="Total Violations" stat={0} Icon={AlertTriangle} />
                    <StatsCard title="Performance Average" stat={0} Icon={TrendingUp} />
                    <StatsCard title="Total Shifts" stat={0} Icon={Briefcase} />
                    <StatsCard title="Total Zones" stat={0} Icon={MapPin} />
                    <StatsCard title="Total Cameras" stat={0} Icon={Camera} />
                </section>
                <div className="mt-10 flex flex-col gap-10">
                    <FarouqOverviewChart chartData={[]} />
                    <FarouqAttendanceChart chartData={[]} />
                </div>
            </div>
        );
    }

    const {
        total_employees,
        present_today,
        absent_today,
        violations,
        performance,
        shifts,
        zones,
        cameras,
        farouqStats
    } = data.doc;
    
    return (
        <div>
            <div className="flex flex-row items-center gap-3 justify-between">
                <h1>Farouq Overview</h1>
                <Button onClick={syncFarouqLogs} disabled={isSyncing} variant="outline">
                    {isSyncing ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
                    {isSyncing ? 'Syncing...' : 'Sync Farouq Logs'}
                </Button>
            </div>
            <section className='mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 max-lg:mb-5'>
                <StatsCard
                    title="Total Employees"
                    stat={total_employees}
                    Icon={Users}
                />
                <StatsCard
                    title="Present Today"
                    stat={present_today}
                    Icon={UserCheck}
                />
                <StatsCard
                    title="Absent Today"
                    stat={absent_today}
                    Icon={UserX}
                />
                <StatsCard
                    title="Violations"
                    stat={violations}
                    Icon={AlertTriangle}
                />
                <StatsCard
                    title="Performance Average"
                    stat={`${performance.average.toFixed(1)}%`}
                    Icon={TrendingUp}
                />
                <StatsCard
                    title="Total Shifts"
                    stat={shifts}
                    Icon={Briefcase}
                />
                <StatsCard
                    title="Total Zones"
                    stat={zones}
                    Icon={MapPin}
                />
                <StatsCard
                    title="Total Cameras"
                    stat={cameras}
                    Icon={Camera}
                />
            </section>
            <div className="mt-10 flex flex-col gap-10">
                <FarouqOverviewChart chartData={farouqStats} />
                <FarouqAttendanceChart chartData={farouqStats} />
            </div>
        </div>
    );
};