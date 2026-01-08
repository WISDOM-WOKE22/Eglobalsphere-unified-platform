'use client';

import { TrendingUp, Activity } from 'lucide-react';
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    XAxis,
    YAxis,
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
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import { FarouqStatsEntry } from '@/types';

export function FarouqAttendanceChart({
    chartData,
}: {
    chartData: FarouqStatsEntry[] | undefined;
}) {
    const chartConfig = {
        total: {
            label: 'Total Activity',
            color: '#3b82f6',
        },
    } satisfies ChartConfig;

    // Handle undefined or empty chartData
    if (!chartData || chartData.length === 0) {
        return (
            <Card className='w-full'>
                <CardHeader>
                    <CardTitle>Daily Activity Overview</CardTitle>
                </CardHeader>
                <CardContent className='h-[400px] p-6'>
                    <div className='flex items-center justify-center h-full text-muted-foreground'>
                        No data available
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Calculate statistics
    const totalActivity = chartData.reduce((sum, entry) => sum + entry.total, 0);
    const avgActivity = (totalActivity / chartData.length).toFixed(1);
    const peakDay = chartData.reduce((max, entry) => 
        entry.total > max.total ? entry : max, chartData[0]
    );

    return (
        <Card className='w-full'>
            <CardHeader>
                <CardTitle>Daily Activity Overview</CardTitle>
            </CardHeader>
            <CardContent className='h-[400px] p-6'>
                <ChartContainer config={chartConfig} className='h-full w-full'>
                    <ResponsiveContainer width='100%' height='100%'>
                        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-total)" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="var(--color-total)" stopOpacity={0.1}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
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
                                tickMargin={8}
                            />
                            <ChartTooltip
                                content={<ChartTooltipContent 
                                    indicator="line"
                                    labelFormatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
                                />}
                            />
                            <Area 
                                type="monotone" 
                                dataKey='total' 
                                stroke='var(--color-total)' 
                                fill='url(#totalGradient)'
                                strokeWidth={2}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
            <CardFooter className='flex-col items-start gap-2 text-sm'>
                <div className='flex gap-2 font-medium leading-none'>
                    Peak activity on {peakDay.day.charAt(0).toUpperCase() + peakDay.day.slice(1)} 
                    <Activity className='h-4 w-4' />
                </div>
                <div className='leading-none text-muted-foreground'>
                    Average {avgActivity} activities per day | Total: {totalActivity} activities
                </div>
            </CardFooter>
        </Card>
    );
}
