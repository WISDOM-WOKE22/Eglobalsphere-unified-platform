'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';
import {
    Bar,
    BarChart,
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
import { FarouqStatsEntry } from '@/types';

export function FarouqChart({
    chartData,
}: {
    chartData: FarouqStatsEntry[] | undefined;
}) {
    const chartConfig = {
        checkins: {
            label: 'Check-ins',
            color: 'hsl(217, 91%, 60%)',
        },
        checkouts: {
            label: 'Check-outs',
            color: 'hsl(280, 100%, 70%)',
        },
    } satisfies ChartConfig;

    // Handle undefined or empty chartData
    if (!chartData || chartData.length === 0) {
        return (
            <Card className='w-full'>
                <CardHeader>
                    <CardTitle>Farouq Weekly Activity</CardTitle>
                </CardHeader>
                <CardContent className='h-[400px] p-6'>
                    <div className='flex items-center justify-center h-full text-muted-foreground'>
                        No data available
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
                <CardTitle>Farouq Weekly Activity</CardTitle>
                <p className="text-sm text-muted-foreground">FMS employee check-ins and check-outs this week</p>
            </CardHeader>
            <CardContent className='h-[400px] p-6'>
                <ChartContainer config={chartConfig} className='h-full w-full'>
                    <ResponsiveContainer width='100%' height='100%'>
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
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
                                tickFormatter={(value) => `${value}`}
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
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
                            <Bar dataKey='checkins' fill={chartConfig.checkins.color} radius={[4, 4, 0, 0]} />
                            <Bar dataKey='checkouts' fill={chartConfig.checkouts.color} radius={[4, 4, 0, 0]} />
                        </BarChart>
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
