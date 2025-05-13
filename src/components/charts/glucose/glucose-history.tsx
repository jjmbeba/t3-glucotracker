'use client'

import dayjs from "dayjs"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "~/components/ui/chart"
import type { GetGlucoseLogsOutput } from "~/trpc/react"

export const GlucoseHistoryChart = ({ glucoseLogs, chartConfig }: { glucoseLogs: GetGlucoseLogsOutput, chartConfig: ChartConfig }) => {
    return (
        <div>
            <Card className="mt-2">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>
                            Glucose levels
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
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
                </CardContent>
            </Card >
        </div>
    )
}

