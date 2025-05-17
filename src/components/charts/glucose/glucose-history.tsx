'use client'

import dayjs from "dayjs"
import { CartesianGrid, Line, LineChart, XAxis, ReferenceLine } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "~/components/ui/chart"
import { cn } from "~/lib/utils"
import type { GetGlucoseLogsOutput, GetGlucoseTargetsOutput } from "~/trpc/react"

type GlucoseHistoryChartProps = {
    glucoseLogs: GetGlucoseLogsOutput,
    glucoseTargets: GetGlucoseTargetsOutput,
    chartConfig: ChartConfig,
    className?: string
}

export const GlucoseHistoryChart = ({ glucoseLogs, chartConfig, glucoseTargets, className }: GlucoseHistoryChartProps) => {
    return (
        <Card className={cn(className)}>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>
                        Glucose levels
                    </span>
                </CardTitle>
                <CardDescription>
                    {glucoseLogs.length > 0 ? `${dayjs(glucoseLogs?.[0]?.date).format("MMMM YYYY")} to ${dayjs(glucoseLogs?.[glucoseLogs.length - 1]?.date).format("MMMM YYYY")}` : "No glucose logs found"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {glucoseLogs.length > 0 ? (
                    <ChartContainer config={chartConfig}>
                        <LineChart
                            accessibilityLayer
                            data={glucoseLogs}
                            margin={{
                                left: 12,
                                right: 12,
                            }}
                        >
                            <CartesianGrid vertical={false} />
                            {glucoseTargets.map(target => (
                                <ReferenceLine y={target.lowThreshold} stroke="var(--chart-3)" strokeDasharray={"3 3"} strokeWidth={2} label={{ value: "Low threshold", position: "top" }} />
                            ))}
                            {glucoseTargets.map(target => (
                                <ReferenceLine y={target.highThreshold} stroke="var(--chart-1)" strokeDasharray={"3 3"} strokeWidth={2} label={{ value: "High threshold", position: "top" }} />
                            ))}
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tickFormatter={(value) => dayjs(value).format("DD MMM")}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Line
                                dataKey="glucose"
                                type="natural"
                                stroke="var(--chart-5)"
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ChartContainer>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-sm text-muted-foreground">No glucose logs found</p>
                    </div>
                )}
            </CardContent>
        </Card >
    )
}

