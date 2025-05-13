'use client'

import type { GetGlucoseLogsOutput } from '~/trpc/react'

import { Pie, PieChart } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "~/components/ui/card"

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig
} from "~/components/ui/chart"
import dayjs from 'dayjs'

type Props = {
    glucoseLogs: GetGlucoseLogsOutput
}

const chartConfig = {
    value: {
        label: "Value"
    },
    high: {
        color: "hsl(var(--chart-1))",
        label: "High"
    },
    low: {
        color: "hsl(var(--chart-2))",
        label: "Low"
    }
} satisfies ChartConfig

const GlucosePieChart = ({ glucoseLogs }: Props) => {
    const highVLows = glucoseLogs.reduce((acc, log) => {
        if (log.glucose > 144) {
            acc.high += 1
        } else if (log.glucose < 72) {
            acc.low += 1
        }
        return acc
    }, { high: 0, low: 0 })

    const chartData = [
        { name: "high", value: highVLows.high },
        { name: "low", value: highVLows.low },
    ]

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>
                    Glucose high & low distribution
                </CardTitle>
                <CardDescription>
                    {glucoseLogs.length > 0 ? `${dayjs(glucoseLogs?.[0]?.date).format("MMMM YYYY")} to ${dayjs(glucoseLogs?.[glucoseLogs.length - 1]?.date).format("MMMM YYYY")}` : "No glucose logs found"}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                {glucoseLogs.length > 0 ? (
                    <ChartContainer
                        config={chartConfig}
                        className="mx-auto aspect-square max-h-[250px]"
                    >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie data={chartData} dataKey="value" nameKey="name" />
                    </PieChart>
                    </ChartContainer>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-sm text-muted-foreground">No glucose logs found</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default GlucosePieChart