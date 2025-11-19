import { StatsCard } from '@/modules/dashboard/components/card/statsCard';
import { SpherexChart, FarouqChart, LPRChart } from '@/modules/dashboard/components/chart';
import { Users, CardSim, SquareLibrary, TicketCheck, TicketMinus } from 'lucide-react';
import { useGetAnalytics } from '../services/dashboard';
import { DashboardPreLoader } from '../components/preloader';

export const Dashboard = () => {
  const { data, isLoading } = useGetAnalytics();

  if (!isLoading) {
    <DashboardPreLoader />;
  }

  return (
    <main>
      <p>Overview of the entire centralised dashboard</p>

      <section className='mt-4 grid grid-cols-2 md:grid-cols-3 gap-4 max-lg:mb-5'>
        <StatsCard Icon={CardSim} title='Active services' stat={data?.userCount} />
        <StatsCard Icon={Users} title='Total Spherex users/employees' stat={0} />
        <StatsCard
          Icon={SquareLibrary}
          title='Total license plates'
          stat={0}
        />
        <StatsCard
          Icon={Users}
          title='Total Farouq Employees'
          stat={0}
        />
        <StatsCard
          Icon={TicketCheck}
          title='Total Closed tickets'
          stat={0}
        />
        <StatsCard
          Icon={TicketMinus}
          title='Total LPR Gates'
          stat={0}
        />
      </section>

      {/* Charts */}

      <section className='mt-7'>
        <SpherexChart chartData={data?.monthlyUserAnalytics} />
      </section>
      <section className="mt-6 grid grid-cols-2 gap-4">
        <LPRChart chartData={data?.monthlyUserAnalytics} />
        <FarouqChart chartData={data?.monthlyUserAnalytics} />
      </section>
    </main>
  );
};
