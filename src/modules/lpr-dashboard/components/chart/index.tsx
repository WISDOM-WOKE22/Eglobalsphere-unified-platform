'use client';
import { LPRStatsEntry } from '@/types';
import { useMemo } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
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
    CardDescription,
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

export function LPRChart({
    chartData,
}: {
    chartData: LPRStatsEntry[] | undefined;
}) {
    const chartConfig = {
        authorized: {
            label: 'Authorized',
            color: 'oklch(0.6 0.118 184.704)',
        },
        unauthorized: {
            label: 'Unauthorized',
            color: 'oklch(0.646 0.222 41.116)',
        },
        total: {
            label: 'Total',
            color: 'hsl(var(--chart-3))',
        },
    } satisfies ChartConfig;

    // Calculate statistics
    const stats = useMemo(() => {
        if (!chartData || chartData.length === 0) {
            return { totalAuthorized: 0, totalUnauthorized: 0, trend: 0, isPositive: false };
        }

        const totalAuthorized = chartData.reduce((sum, entry) => sum + entry.authorized, 0);
        const totalUnauthorized = chartData.reduce((sum, entry) => sum + entry.unauthorized, 0);

        // Calculate trend (comparing first half vs second half)
        const midPoint = Math.floor(chartData.length / 2);
        const firstHalf = chartData.slice(0, midPoint);
        const secondHalf = chartData.slice(midPoint);

        const firstHalfAvg = firstHalf.reduce((sum, entry) => sum + entry.total, 0) / firstHalf.length;
        const secondHalfAvg = secondHalf.reduce((sum, entry) => sum + entry.total, 0) / secondHalf.length;

        const trend = firstHalfAvg > 0 ? ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100 : 0;

        return {
            totalAuthorized,
            totalUnauthorized,
            trend: Math.abs(trend),
            isPositive: trend > 0,
        };
    }, [chartData]);

    // Handle undefined or empty chartData
    if (!chartData || chartData.length === 0) {
        return (
            <Card className='w-full'>
                <CardHeader>
                    <CardTitle>Access Control Overview</CardTitle>
                    <CardDescription>License plate recognition activity</CardDescription>
                </CardHeader>
                <CardContent className='h-[400px] p-6'>
                    <div className='flex items-center justify-center h-full text-muted-foreground'>
                        No data available
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className='w-full'>
            <CardHeader>
                <CardTitle>Access Control Overview</CardTitle>
                <CardDescription>
                    Authorized vs Unauthorized access trends over time
                </CardDescription>
            </CardHeader>
            <CardContent className='h-[450px] p-6'>
                <ChartContainer config={chartConfig} className='h-full w-full'>
                    <ResponsiveContainer width='100%' height='100%'>
                        <AreaChart
                            data={chartData}
                            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id='fillAuthorized' x1='0' y1='0' x2='0' y2='1'>
                                    <stop
                                        offset='5%'
                                        stopColor='var(--color-authorized)'
                                        stopOpacity={0.8}
                                    />
                                    <stop
                                        offset='95%'
                                        stopColor='var(--color-authorized)'
                                        stopOpacity={0.1}
                                    />
                                </linearGradient>
                                <linearGradient id='fillUnauthorized' x1='0' y1='0' x2='0' y2='1'>
                                    <stop
                                        offset='5%'
                                        stopColor='var(--color-unauthorized)'
                                        stopOpacity={0.8}
                                    />
                                    <stop
                                        offset='95%'
                                        stopColor='var(--color-unauthorized)'
                                        stopOpacity={0.1}
                                    />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray='3 3' vertical={false} opacity={0.3} />
                            <XAxis
                                dataKey='day'
                                tickLine={false}
                                axisLine={false}
                                tickMargin={10}
                                minTickGap={32}
                                // tickFormatter={formatDate}
                                style={{ fontSize: '12px' }}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tickMargin={10}
                                style={{ fontSize: '12px' }}
                            />
                            <ChartTooltip
                                cursor={{ strokeDasharray: '3 3' }}
                                content={
                                    <ChartTooltipContent
                                        labelFormatter={(value: string) => value}
                                        indicator='dot'
                                    />
                                }
                            />
                            <Area
                                dataKey='authorized'
                                type='monotone'
                                fill='url(#fillAuthorized)'
                                stroke='var(--color-authorized)'
                                strokeWidth={2}
                                fillOpacity={0.6}
                                dot={false}
                                activeDot={{ r: 6, strokeWidth: 2 }}
                            />
                            <Area
                                dataKey='unauthorized'
                                type='monotone'
                                fill='url(#fillUnauthorized)'
                                stroke='var(--color-unauthorized)'
                                strokeWidth={2}
                                fillOpacity={0.6}
                                dot={false}
                                activeDot={{ r: 6, strokeWidth: 2 }}
                            />
                            <ChartLegend content={<ChartLegendContent />} />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
            <CardFooter className='flex-col items-start gap-2 text-sm'>
                <div className='flex gap-2 font-medium leading-none'>
                    {stats.isPositive ? (
                        <>
                            Trending up by {stats.trend.toFixed(1)}% this period{' '}
                            <TrendingUp className='h-4 w-4 text-green-500' />
                        </>
                    ) : (
                        <>
                            Trending down by {stats.trend.toFixed(1)}% this period{' '}
                            <TrendingDown className='h-4 w-4 text-red-500' />
                        </>
                    )}
                </div>
                <div className='leading-none text-muted-foreground'>
                    Total: {stats.totalAuthorized.toLocaleString()} authorized,{' '}
                    {stats.totalUnauthorized.toLocaleString()} unauthorized access attempts
                </div>
            </CardFooter>
        </Card>
    );
}
