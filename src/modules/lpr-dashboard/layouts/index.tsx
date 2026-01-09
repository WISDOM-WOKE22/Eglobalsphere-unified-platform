import { StatsCard } from "@/modules/dashboard/components/card/statsCard";
import { CardSim, Loader2, RefreshCw } from "lucide-react";
import { LPRChart } from "../components/chart";
import { useLPRDashboardService } from "../services";
import { LPRDashboardSkeleton } from "../components/preloader";
import { Button } from "@/components/ui/button";

export const LPRDashboardLayout = () => {
    const { data, isLoading, syncLprLogs, isSyncing } = useLPRDashboardService();
    
    if (isLoading) {
        return <LPRDashboardSkeleton />;
    }

    return (
        <div>
            <div className="flex flex-row items-center gap-3 justify-between">
                <h1>LPR Dashboard</h1>
                <Button onClick={syncLprLogs} disabled={isSyncing} variant="outline">
                    {isSyncing ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
                    {isSyncing ? 'Syncing...' : 'Sync LPR Logs'}
                </Button>
            </div>
            <section className='mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 max-lg:mb-5'>
                <StatsCard Icon={CardSim} title='Total License Plates' stat={data?.statistics.total_license_plates ?? 0} />
                <StatsCard Icon={CardSim} title='Total Inactive License Plates' stat={data?.statistics.total_inactive_plates ?? 0} />
                <StatsCard Icon={CardSim} title='Total Gates' stat={data?.statistics.total_gates ?? 0} />
                <StatsCard Icon={CardSim} title='Total Entries Today' stat={data?.statistics.total_entries_today ?? 0} />
                <StatsCard Icon={CardSim} title='Total Exit Today' stat={data?.statistics.total_exits_today ?? 0} />
                <StatsCard Icon={CardSim} title='Total Authorized Access Today' stat={data?.statistics.total_authorized_today ?? 0} />
                <StatsCard Icon={CardSim} title='Total Unauthorized Access Today' stat={data?.statistics.total_unauthorized_today ?? 0} />
                <StatsCard Icon={CardSim} title='Total Access Today' stat={data?.statistics.total_access_today ?? 0} />
            </section>
            <section className="mt-7">
                <LPRChart chartData={data?.lprStats} />
            </section>
        </div>
    );
};