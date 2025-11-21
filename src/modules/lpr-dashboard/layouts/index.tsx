import { StatsCard } from "@/modules/dashboard/components/card/statsCard";
import { CardSim } from "lucide-react";
import { LPRChart } from "../components/chart";

export const LPRDashboardLayout = () => {
    return (
        <div>
            <h1>LPR Dashboard</h1>
            <section className='mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 max-lg:mb-5'>
                <StatsCard Icon={CardSim} title='Total License Plates' stat={0} />
                <StatsCard Icon={CardSim} title='Total Inactive License Plates' stat={0} />
                <StatsCard Icon={CardSim} title='Total Gates' stat={0} />
                <StatsCard Icon={CardSim} title='Total Entries Today' stat={0} />
                <StatsCard Icon={CardSim} title='Total Exit Today' stat={0} />
                <StatsCard Icon={CardSim} title='Total Authorized Access Today' stat={0} />
                <StatsCard Icon={CardSim} title='Total Unauthorized Access Today' stat={0} />
                <StatsCard Icon={CardSim} title='Total Access Today' stat={0} />
            </section>
            <section className="mt-7">
                <LPRChart chartData={[]} />
            </section>
        </div>
    );
};