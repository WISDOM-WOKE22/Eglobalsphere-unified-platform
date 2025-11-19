import { StatsCard } from "@/modules/dashboard/components/card/statsCard"
import { CardSim, Users, SquareLibrary, TicketCheck, TicketMinus } from "lucide-react"

export const SpherexDashboardLayout = () => {
    return (
        <main>
            <h1>Spherex Dashboard</h1>
            <section className='mt-4 grid grid-cols-2 md:grid-cols-3 gap-4 max-lg:mb-5'>
                <StatsCard Icon={CardSim} title='Total Emloyees' stat={0} />
                <StatsCard Icon={Users} title='Total Visitors' stat={0} />
                <StatsCard
                    Icon={SquareLibrary}
                    title='Total Zones'
                    stat={0}
                />
                <StatsCard
                    Icon={Users}
                    title='Total Security Guards'
                    stat={0}
                />
                <StatsCard
                    Icon={TicketCheck}
                    title='Active Employees'
                    stat={0}
                />
                <StatsCard
                    Icon={TicketMinus}
                    title='Inactive Employees'
                    stat={0}
                />
            </section>
        </main>
    )
}