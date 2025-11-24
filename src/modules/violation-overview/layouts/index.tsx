import { StatsCard } from "@/modules/dashboard/components/card/statsCard";
import { Users } from "lucide-react";
import { ViolationChart } from "../components/charts";

export const ViolationOverviewLayout = () => {
    return (
        <div>
            <section className='mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 max-lg:mb-5'>
                <StatsCard 
                    title="Total Violations"
                    stat="0"
                    Icon={Users}
                />
                <StatsCard 
                    title="Total Oneway Violations"
                    stat="0"
                    Icon={Users}
                />
                <StatsCard 
                    title="Total Speed Violations"
                    stat="0"
                    Icon={Users}
                />
                <StatsCard 
                    title="Total Violations Today"
                    stat="0"
                    Icon={Users}
                />
            </section>

            <div className="mt-10">
                <ViolationChart chartData={[]} />
            </div>
        </div>
    );
};