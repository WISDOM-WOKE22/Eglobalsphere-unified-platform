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
    ChartLegend,
    ChartLegendContent,
} from '@/components/ui/chart';
import { FarouqStatsEntry } from '@/types';

export function FarouqOverviewChart({
    chartData,
}: {
    chartData: FarouqStatsEntry[] | undefined;
}) {
    const chartConfig = {
        checkins: {
            label: 'Check-ins',
            color: '#10b981',
        },
        checkouts: {
            label: 'Check-outs',
            color: '#ef4444',
        },
    } satisfies ChartConfig;

    // Handle undefined or empty chartData
    if (!chartData || chartData.length === 0) {
        return (
            <Card className='w-full'>
                <CardHeader>
                    <CardTitle>Check-ins vs Check-outs</CardTitle>
                </CardHeader>
                <CardContent className='h-[400px] p-6'>
                    <div className='flex items-center justify-center h-full text-muted-foreground'>
                        No data available
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Calculate trends
    const totalCheckins = chartData.reduce((sum, entry) => sum + entry.checkins, 0);
    const totalCheckouts = chartData.reduce((sum, entry) => sum + entry.checkouts, 0);
    const avgCheckins = (totalCheckins / chartData.length).toFixed(1);
    const avgCheckouts = (totalCheckouts / chartData.length).toFixed(1);
    const trend = totalCheckins > totalCheckouts;

    return (
        <Card className='w-full'>
            <CardHeader>
                <CardTitle>Check-ins vs Check-outs Overview</CardTitle>
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
                                tickMargin={8}
                            />
                            <ChartTooltip
                                content={<ChartTooltipContent />}
                            />
                            <ChartLegend content={<ChartLegendContent />} />
                            <Bar 
                                dataKey='checkins' 
                                fill='var(--color-checkins)' 
                                radius={[8, 8, 0, 0]}
                            />
                            <Bar 
                                dataKey='checkouts' 
                                fill='var(--color-checkouts)' 
                                radius={[8, 8, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
            <CardFooter className='flex-col items-start gap-2 text-sm'>
                <div className='flex gap-2 font-medium leading-none'>
                    {trend ? (
                        <>
                            More check-ins than check-outs <TrendingUp className='h-4 w-4 text-green-500' />
                        </>
                    ) : (
                        <>
                            More check-outs than check-ins <TrendingDown className='h-4 w-4 text-red-500' />
                        </>
                    )}
                </div>
                <div className='leading-none text-muted-foreground'>
                    Average: {avgCheckins} check-ins, {avgCheckouts} check-outs per day
                </div>
            </CardFooter>
        </Card>
    );
}
