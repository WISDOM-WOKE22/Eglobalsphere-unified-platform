import { StatsCard } from "@/modules/dashboard/components/card/statsCard";
import { FarouqAttendanceChart, FarouqOverviewChart } from "@/modules/farouq-overview/components/charts";
import { AlertCircle } from "lucide-react";

export const FarouqOverviewLayout = () => {
    return (
        <div>
            <section className='mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 max-lg:mb-5'>
                <StatsCard
                    title="Total Employees"
                    stat={0}
                    Icon={AlertCircle}
                />
                <StatsCard
                    title="Total Present today"
                    stat={0}
                    Icon={AlertCircle}
                />
                <StatsCard
                    title="Total Absent today"
                    stat={0}
                    Icon={AlertCircle}
                />
                <StatsCard
                    title="Total Violations"
                    stat={0}
                    Icon={AlertCircle}
                />
                <StatsCard
                    title="Performance ratings"
                    stat={0}
                    Icon={AlertCircle}
                />
                <StatsCard
                    title="Total shifts"
                    stat={0}
                    Icon={AlertCircle}
                />
                <StatsCard
                    title="Total Zones"
                    stat={0}
                    Icon={AlertCircle}
                />
                <StatsCard
                    title="Total Cameras"
                    stat={0}
                    Icon={AlertCircle}
                />
            </section>
            <div className="mt-10 flex flex-col gap-10">
                <FarouqOverviewChart chartData={[]} />
                <FarouqAttendanceChart chartData={[]} />
            </div>
        </div>
    );
};