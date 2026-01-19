'use client';

import { TrendingUp, BarChart3 } from 'lucide-react';
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
import { SpherexStatsEntry } from '@/types';
import { useMemo } from 'react';

export function ActivityChart({
    chartData,
}: {
    chartData: SpherexStatsEntry[] | undefined;
}) {
    // Transform data for chart display
    const transformedData = useMemo(() => {
        if (!chartData || chartData.length === 0) return [];
        
        return chartData.map((entry) => ({
            day: entry.day,
            checkins: entry.checkins,
            checkouts: entry.checkouts,
            total: entry.total,
        }));
    }, [chartData]);

    const chartConfig = {
        checkins: {
            label: 'Check-ins',
            color: 'hsl(142, 76%, 36%)', // Green for check-ins
        },
        checkouts: {
            label: 'Check-outs',
            color: 'hsl(0, 84%, 60%)', // Red for check-outs
        },
        total: {
            label: 'Total Activity',
            color: 'hsl(217, 91%, 60%)', // Blue for total
        },
    } satisfies ChartConfig;

    // Calculate trend if we have data
    const calculateTrend = () => {
        if (!transformedData || transformedData.length < 2) return null;
        
        const recent = transformedData.slice(-2);
        const current = recent[1]?.total || 0;
        const previous = recent[0]?.total || 0;
        
        if (previous === 0) return null;
        
        const change = ((current - previous) / previous) * 100;
        return change.toFixed(1);
    };

    const trend = calculateTrend();

    // Handle undefined or empty chartData
    if (!chartData || chartData.length === 0) {
        return (
            <Card className='w-full'>
                <CardHeader>
                    <CardTitle>Activity Chart</CardTitle>
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

    return (
        <Card className='w-full'>
            <CardHeader>
                <CardTitle>SphereX Activity Chart</CardTitle>
            </CardHeader>
            <CardContent className='h-[400px] p-6'>
                <ChartContainer config={chartConfig} className='h-full w-full'>
                    <ResponsiveContainer width='100%' height='100%'>
                        <AreaChart 
                            data={transformedData} 
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <defs>
                                <linearGradient id='gradientCheckins' x1='0' y1='0' x2='0' y2='1'>
                                    <stop offset='5%' stopColor='var(--color-checkins)' stopOpacity={0.8} />
                                    <stop offset='95%' stopColor='var(--color-checkins)' stopOpacity={0.1} />
                                </linearGradient>
                                <linearGradient id='gradientCheckouts' x1='0' y1='0' x2='0' y2='1'>
                                    <stop offset='5%' stopColor='var(--color-checkouts)' stopOpacity={0.8} />
                                    <stop offset='95%' stopColor='var(--color-checkouts)' stopOpacity={0.1} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray='3 3' vertical={false} stroke='hsl(var(--muted))' />
                            <XAxis
                                dataKey='day'
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => {
                                    // Format day name (e.g., "monday" -> "Mon")
                                    return value ? value.slice(0, 3).charAt(0).toUpperCase() + value.slice(1, 3) : value;
                                }}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tickMargin={10}
                            />
                            <ChartTooltip
                                cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1 }}
                                content={<ChartTooltipContent 
                                    indicator='line'
                                    labelFormatter={(value) => `Day: ${value}`}
                                />}
                            />
                            <Area 
                                type='monotone'
                                dataKey='checkins' 
                                stroke='var(--color-checkins)'
                                strokeWidth={2}
                                fill='url(#gradientCheckins)'
                                name='Check-ins'
                            />
                            <Area 
                                type='monotone'
                                dataKey='checkouts' 
                                stroke='var(--color-checkouts)'
                                strokeWidth={2}
                                fill='url(#gradientCheckouts)'
                                name='Check-outs'
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
            <CardFooter className='flex-col items-start gap-2 text-sm'>
                {trend && (
                    <div className='flex gap-2 font-medium leading-none'>
                        {parseFloat(trend) >= 0 ? (
                            <>
                                Trending up by {Math.abs(parseFloat(trend))}% this week 
                                <TrendingUp className='h-4 w-4 text-green-600' />
                            </>
                        ) : (
                            <>
                                Trending down by {Math.abs(parseFloat(trend))}% this week 
                                <TrendingUp className='h-4 w-4 text-red-600 rotate-180' />
                            </>
                        )}
                    </div>
                )}
                <div className='leading-none text-muted-foreground'>
                    Showing check-ins and check-outs activity for the last {transformedData.length} day{transformedData.length !== 1 ? 's' : ''}
                </div>
            </CardFooter>
        </Card>
    );
}
