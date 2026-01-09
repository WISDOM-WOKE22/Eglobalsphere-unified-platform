import { StatsCard } from "@/modules/dashboard/components/card/statsCard"
import { CardSim, Users, SquareLibrary, TicketCheck, TicketMinus, Loader2, RefreshCw } from "lucide-react"
import { ActivityChart } from "../components/charts/activity-chart"
import { useSpherexDashboardService } from "../services";
import { Button } from "@/components/ui/button";
import { SpherexDashboardSkeleton } from "../components/preloader";


export const SpherexDashboardLayout = () => {
    const { data, isLoading, isSyncing, syncSpherexLogs } = useSpherexDashboardService();
    
    // Show elegant skeleton preloader while loading
    if (isLoading) {
        return <SpherexDashboardSkeleton />;
    }
    
    return (
        <main>
            <div className="flex flex-row items-center gap-3 justify-between">
                <h1>Spherex Dashboard</h1>
                <Button onClick={syncSpherexLogs} disabled={isSyncing} variant="outline">
                    {isSyncing ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
                    {isSyncing ? 'Syncing...' : 'Sync Spherex Logs'}
                </Button>
            </div>

            <section className='mt-4 grid grid-cols-2 md:grid-cols-3 gap-4 max-lg:mb-5'>
                <StatsCard Icon={CardSim} title='Total Emloyees' stat={data?.statistics.total_employees ?? 0} />
                <StatsCard Icon={Users} title='Total Visitors' stat={data?.statistics.total_visitors ?? 0} />
                <StatsCard
                    Icon={SquareLibrary}
                    title='Total Zones'
                    stat={data?.statistics.total_zones ?? 0}
                />
                <StatsCard
                    Icon={Users}
                    title='Total Security Guards'
                    stat={data?.statistics.total_security_guards ?? 0}
                />
                <StatsCard
                    Icon={TicketCheck}
                    title='Active Employees'
                    stat={data?.statistics.active_employees ?? 0}
                />
                <StatsCard
                    Icon={TicketMinus}
                    title='Inactive Employees'
                    stat={data?.statistics.inactive_employees ?? 0}
                />
            </section>
            <section className="mt-10">
                <ActivityChart chartData={data?.spherexStats ?? []} />
            </section>
        </main>
    )
}