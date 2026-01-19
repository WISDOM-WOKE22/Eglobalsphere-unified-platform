'use client';

import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
} from 'recharts';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
} from '@/components/ui/chart';
import { SphereXStatsEntry } from '@/types';

export function SpherexChart({
  chartData,
}: {
  chartData: SphereXStatsEntry[] | undefined;
}) {
  const chartConfig = {
    checkins: {
      label: 'Check-ins',
      color: 'hsl(142, 76%, 36%)',
    },
    checkouts: {
      label: 'Check-outs',
      color: 'hsl(0, 84%, 60%)',
    },
  } satisfies ChartConfig;

  // Handle undefined or empty chartData
  if (!chartData || chartData.length === 0) {
    return (
      <Card className='w-full'>
        <CardHeader>
          <CardTitle>SphereX Weekly Activity</CardTitle>
        </CardHeader>
        <CardContent className='h-[400px] p-6'>
          <div className='flex flex-col items-center justify-center h-full text-center'>
            <BarChart3 className='h-16 w-16 text-muted-foreground/50 mb-4' />
            <h3 className='text-lg font-semibold text-foreground mb-2'>
              No Data Available
            </h3>
            <p className='text-sm text-muted-foreground max-w-sm'>
              There is no activity data to display at this time. Please check back later.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate analytics
  const totalCheckins = chartData.reduce((sum, entry) => sum + entry.checkins, 0);
  const totalCheckouts = chartData.reduce((sum, entry) => sum + entry.checkouts, 0);
  const totalActivity = totalCheckins + totalCheckouts;
  const avgDaily = Math.round(totalActivity / chartData.length);
  const trend = totalCheckins > totalCheckouts ? 'positive' : 'negative';
  const trendPercentage = totalCheckouts > 0 
    ? Math.abs(((totalCheckins - totalCheckouts) / totalCheckouts) * 100).toFixed(1)
    : '0.0';

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>SphereX Weekly Activity</CardTitle>
        <p className="text-sm text-muted-foreground">Employee check-ins and check-outs this week</p>
      </CardHeader>
      <CardContent className='h-[400px] p-6'>
        <ChartContainer config={chartConfig} className='h-full w-full'>
          <ResponsiveContainer width='100%' height='100%'>
            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id='gradientCheckins' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor={chartConfig.checkins.color} stopOpacity={0.8} />
                  <stop offset='95%' stopColor={chartConfig.checkins.color} stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id='gradientCheckouts' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor={chartConfig.checkouts.color} stopOpacity={0.8} />
                  <stop offset='95%' stopColor={chartConfig.checkouts.color} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke='hsl(var(--muted))' />
              <XAxis
                dataKey='day'
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.charAt(0).toUpperCase() + value.slice(1, 3)}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1 }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground font-medium">
                              {payload[0].payload.day}
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center gap-1">
                                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: chartConfig.checkins.color }} />
                                <span className="text-sm font-medium">{payload[0].value} check-ins</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: chartConfig.checkouts.color }} />
                                <span className="text-sm font-medium">{payload[1].value} check-outs</span>
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              Total: {payload[0].payload.total}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="circle"
              />
              <Area 
                type='monotone'
                dataKey='checkins' 
                stroke={chartConfig.checkins.color}
                strokeWidth={2}
                fill='url(#gradientCheckins)'
                name='Check-ins'
              />
              <Area 
                type='monotone'
                dataKey='checkouts' 
                stroke={chartConfig.checkouts.color}
                strokeWidth={2}
                fill='url(#gradientCheckouts)'
                name='Check-outs'
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col items-start gap-2 text-sm'>
        <div className='flex gap-2 font-medium leading-none items-center'>
          {trend === 'positive' ? (
            <>
              Check-ins up by {trendPercentage}% <TrendingUp className='h-4 w-4 text-green-600' />
            </>
          ) : (
            <>
              Check-outs up by {trendPercentage}% <TrendingDown className='h-4 w-4 text-red-600' />
            </>
          )}
        </div>
        <div className='leading-none text-muted-foreground'>
          Total activity: {totalActivity} • Avg daily: {avgDaily}
        </div>
      </CardFooter>
    </Card>
  );
}
