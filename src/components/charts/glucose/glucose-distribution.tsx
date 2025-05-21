'use client'

import dayjs from "dayjs"
import { useMemo } from "react"
import { CartesianGrid, Dot, Scatter, ScatterChart, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig, } from "~/components/ui/chart"
import type { GetGlucoseLogsOutput, GetGlucoseTargetsOutput } from "~/trpc/react"

export interface GlucoseDataPoint {
    x: number;
    y: number;
    glucose: number;
    notes?: string;
}

export interface CustomizedDotProps {
    cx?: number;
    cy?: number;
    payload?: GlucoseDataPoint;
    targetLow: number;
    targetHigh: number;
}

export const GlucoseDistributionChart = ({ glucoseLogs, glucoseTarget, chartConfig }: { glucoseLogs: GetGlucoseLogsOutput, glucoseTarget: GetGlucoseTargetsOutput[number] | null, chartConfig: ChartConfig }) => {
    const lowThreshold = glucoseTarget?.lowThreshold ?? 0
    const highThreshold = glucoseTarget?.highThreshold ?? 0

    return (
        <div>
            <Card className="mt-2">
                <CardHeader>
                    <CardTitle>Glucose distribution</CardTitle>
                    <CardDescription>
                        {glucoseLogs.length > 0 ? `${dayjs(glucoseLogs?.[0]?.date).format("MMMM YYYY")} to ${dayjs(glucoseLogs?.[glucoseLogs.length - 1]?.date).format("MMMM YYYY")}` : "No glucose logs found"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {glucoseLogs.length > 0 ? (
                        <ChartContainer config={chartConfig}>
                            <ScatterChart
                                accessibilityLayer
                                data={glucoseLogs}
                                margin={{
                                    left: 12,
                                    right: 12,
                                }}
                            >
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    tickFormatter={(value) => dayjs(value).format("DD MMM")}
                                />
                                <YAxis
                                    dataKey="glucose"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent hideLabel />}
                                />
                                <Scatter
                                    dataKey="glucose"
                                    type="natural"
                                    shape={<CustomizedDot targetLow={lowThreshold} targetHigh={highThreshold} />}
                                />
                            </ScatterChart>
                        </ChartContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-sm text-muted-foreground">No glucose logs found</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

const CustomizedDot: React.FC<CustomizedDotProps> = (props) => {
    const { cx, cy, payload, targetLow, targetHigh } = props;

    if (payload === undefined) return null

    const glucoseValue = payload.glucose;

    if (typeof cx !== 'number' || typeof cy !== 'number') {
        return null;
    }

    const fillColor = useMemo(() => {
        if (glucoseValue < targetLow) return "var(--chart-3)"
        if (glucoseValue > targetHigh) return "var(--chart-1)"
        return "var(--chart-2)"
    }, [glucoseValue, targetLow, targetHigh])

    return <Dot cx={cx} cy={cy} r={6} fill={fillColor} stroke="#fff" strokeWidth={1} />;
};