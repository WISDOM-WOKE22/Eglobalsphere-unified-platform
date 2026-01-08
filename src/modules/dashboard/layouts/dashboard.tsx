import { StatsCard } from '@/modules/dashboard/components/card/statsCard';
import { SpherexChart, FarouqChart, LPRChart } from '@/modules/dashboard/components/chart';
import { Users, CardSim, SquareLibrary, TicketCheck, TicketMinus } from 'lucide-react';
import { useDashboardService } from '../services';
import { DashboardSkeleton } from '../components/preloader';

export const Dashboard = () => {
  const { data, isLoading } = useDashboardService();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <main>
      <p>Overview dashboard</p>

      <section className='mt-4 grid grid-cols-2 md:grid-cols-3 gap-4 max-lg:mb-5'>
        <StatsCard Icon={CardSim} title='Active services' stat={data?.doc?.activeServices ?? 0} />
        <StatsCard Icon={Users} title='Total Spherex users/employees' stat={data?.doc?.totalSphereXEmployees ?? 0} />
        <StatsCard
          Icon={SquareLibrary}
          title='Total license plates'
          stat={data?.doc?.totalLicensePlates ?? 0}
        />
        <StatsCard
          Icon={Users}
          title='Total Farouq Employees'
          stat={data?.doc?.totalFmsEmployees ?? 0}
        />
        <StatsCard
          Icon={TicketCheck}
          title='Total Closed tickets'
          stat={data?.doc?.totalClosedTickets ?? 0}
        />
        <StatsCard
          Icon={TicketMinus}
          title='Total LPR Gates'
          stat={data?.doc?.totalLprGates ?? 0}
        />
      </section>

      {/* Charts */}

      <section className='mt-7'>
        <SpherexChart chartData={data?.doc?.spherexStats ?? []} />
      </section>
      <section className="mt-6 grid grid-cols-2 gap-4 max-lg:grid-cols-1">
        <LPRChart chartData={data?.doc?.lprStats ?? []} />
        <FarouqChart chartData={data?.doc?.farouqStats ?? []} />
      </section>
    </main>
  );
};