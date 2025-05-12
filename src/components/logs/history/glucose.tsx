"use client"

import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import { api } from '~/trpc/react'

import dayjs from "dayjs"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "~/components/ui/card"
import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "~/components/ui/chart"

const chartConfig = {
    glucose: {
        label: "Glucose",
        color: "hsl(var(--chart-5))",
    }
} satisfies ChartConfig


const GlucoseHistory = () => {
    return (
        <div className="grid grid-cols-2 gap-4">
            <GlucoseHistoryChart />
            
        </div>
    )
}

export default GlucoseHistory

export const GlucoseHistoryChart = () => {
    const { data: glucoseLogs, isLoading: isGlucoseLogsLoading } = api.glucose.getLogs.useQuery()

    return (
        <Card>
            <CardHeader>
                <CardTitle>Glucose levels</CardTitle>
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
        </Card>
    )
}
