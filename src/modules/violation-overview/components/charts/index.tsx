'use client';

import { TrendingUp } from 'lucide-react';
import {
    Bar,
    BarChart,
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
import { ViolationStatsEntry } from '@/types';

export function ViolationChart({
    chartData,
}: {
    chartData: ViolationStatsEntry[] | undefined;
}) {
    const chartConfig = {
        speed: {
            label: 'Speed Violations',
            color: 'hsl(var(--chart-1))',
        },
        oneway: {
            label: 'Oneway Violations',
            color: 'hsl(var(--chart-2))',
        },
        total: {
            label: 'Total',
            color: 'hsl(var(--chart-3))',
        },
    } satisfies ChartConfig;

    // Handle undefined or empty chartData
    if (!chartData || chartData.length === 0) {
        return (
            <Card className='w-full'>
                <CardHeader>
                    <CardTitle>Violation Statistics</CardTitle>
                    <CardDescription>Weekly breakdown of traffic violations</CardDescription>
                </CardHeader>
                <CardContent className='h-[400px] p-6'>
                    <div className='flex items-center justify-center h-full text-muted-foreground'>
                        No violation data available
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Calculate total violations across all days
    const totalViolations = chartData.reduce((sum, day) => sum + day.total, 0);
    const totalSpeed = chartData.reduce((sum, day) => sum + day.speed, 0);
    const totalOneway = chartData.reduce((sum, day) => sum + day.oneway, 0);

    return (
        <Card className='w-full'>
            <CardHeader>
                <CardTitle>Violation Statistics</CardTitle>
                <CardDescription>
                    Weekly breakdown of speed and oneway violations
                </CardDescription>
            </CardHeader>
            <CardContent className='h-[450px] p-6'>
                <ChartContainer config={chartConfig} className='h-full w-full'>
                    <ResponsiveContainer width='100%' height='100%'>
                        <BarChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                            <CartesianGrid strokeDasharray='3 3' vertical={false} opacity={0.3} />
                            <XAxis
                                dataKey='day'
                                tickLine={false}
                                axisLine={false}
                                tickMargin={10}
                                tickFormatter={(value) => value.charAt(0).toUpperCase() + value.slice(1, 3)}
                                style={{ fontSize: '12px' }}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tickMargin={10}
                                style={{ fontSize: '12px' }}
                            />
                            <ChartTooltip
                                cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                                content={<ChartTooltipContent />}
                            />
                            <ChartLegend content={<ChartLegendContent />} />
                            <Bar 
                                dataKey='speed' 
                                fill='var(--color-speed)' 
                                radius={[8, 8, 0, 0]}
                                maxBarSize={60}
                            />
                            <Bar 
                                dataKey='oneway' 
                                fill='var(--color-oneway)' 
                                radius={[8, 8, 0, 0]}
                                maxBarSize={60}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
            <CardFooter className='flex-col items-start gap-2 text-sm'>
                <div className='flex gap-2 font-medium leading-none'>
                    {totalViolations > 0 ? (
                        <>
                            Total violations this week: {totalViolations}
                            {totalSpeed > totalOneway ? (
                                <TrendingUp className='h-4 w-4 text-destructive' />
                            ) : null}
                        </>
                    ) : (
                        'No violations recorded this week'
                    )}
                </div>
                <div className='leading-none text-muted-foreground'>
                    {totalSpeed} speed violations, {totalOneway} oneway violations
                </div>
            </CardFooter>
        </Card>
    );
}
