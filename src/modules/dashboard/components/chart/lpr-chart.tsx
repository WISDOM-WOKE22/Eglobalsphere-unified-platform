'use client';

import { ShieldCheck, ShieldAlert } from 'lucide-react';
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
import { LPRStatsEntry } from '@/types';

export function LPRChart({
    chartData,
}: {
    chartData: LPRStatsEntry[] | undefined;
}) {
    const chartConfig = {
        authorized: {
            label: 'Authorized',
            color: 'hsl(142, 76%, 36%)',
        },
        unauthorized: {
            label: 'Unauthorized',
            color: 'hsl(0, 84%, 60%)',
        },
    } satisfies ChartConfig;

    // Handle undefined or empty chartData
    if (!chartData || chartData.length === 0) {
        return (
            <Card className='w-full'>
                <CardHeader>
                    <CardTitle>LPR Weekly Access</CardTitle>
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
    const totalAuthorized = chartData.reduce((sum, entry) => sum + entry.authorized, 0);
    const totalUnauthorized = chartData.reduce((sum, entry) => sum + entry.unauthorized, 0);
    const totalAccess = totalAuthorized + totalUnauthorized;
    const authorizationRate = totalAccess > 0 
        ? ((totalAuthorized / totalAccess) * 100).toFixed(1)
        : '0.0';

    return (
        <Card className='w-full'>
            <CardHeader>
                <CardTitle>LPR Weekly Access</CardTitle>
                <p className="text-sm text-muted-foreground">License plate recognition activity this week</p>
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
                                                                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: chartConfig.authorized.color }} />
                                                                <span className="text-sm font-medium">{payload[0].value} authorized</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex items-center gap-1">
                                                                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: chartConfig.unauthorized.color }} />
                                                                <span className="text-sm font-medium">{payload[1].value} unauthorized</span>
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
                            <Bar dataKey='authorized' fill={chartConfig.authorized.color} radius={[4, 4, 0, 0]} />
                            <Bar dataKey='unauthorized' fill={chartConfig.unauthorized.color} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
            <CardFooter className='flex-col items-start gap-2 text-sm'>
                <div className='flex gap-2 font-medium leading-none items-center'>
                    <ShieldCheck className='h-4 w-4 text-green-600' />
                    Authorization rate: {authorizationRate}%
                </div>
                <div className='flex items-center gap-4 text-muted-foreground'>
                    <span>✓ {totalAuthorized} authorized</span>
                    <span className="text-red-600">✗ {totalUnauthorized} unauthorized</span>
                </div>
            </CardFooter>
        </Card>
    );
}
