import { StatsCard } from "@/modules/dashboard/components/card/statsCard"
import { CardSim, Users, SquareLibrary, TicketCheck, TicketMinus } from "lucide-react"
import { ActivityChart } from "../components/charts/activity-chart"
import { useSpherexDashboardService } from "../services";

export const SpherexDashboardLayout = () => {
    const { data, error, isLoading } = useSpherexDashboardService();
    return (
        <main>
            <h1>Spherex Dashboard</h1>
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