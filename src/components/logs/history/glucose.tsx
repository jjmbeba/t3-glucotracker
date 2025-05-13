"use client"

import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import { api } from '~/trpc/react'

import dayjs from "dayjs"
import { FilterIcon, XIcon } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Badge } from "~/components/ui/badge"
import { Button, buttonVariants } from "~/components/ui/button"
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
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "~/components/ui/sheet"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "~/components/ui/tooltip"
import { cn } from "~/lib/utils"

const chartConfig = {
    glucose: {
        label: "Glucose",
        color: "hsl(var(--chart-5))",
    }
} satisfies ChartConfig


const GlucoseHistory = ({ timePeriod }: { timePeriod: string }) => {
    return (
        <div className="grid grid-cols-2 gap-4 mt-4">
            <GlucoseHistoryChart timePeriod={timePeriod} />

        </div>
    )
}

export default GlucoseHistory

export const GlucoseHistoryChart = ({ timePeriod }: { timePeriod: string }) => {
    const { data, isLoading: isGlucoseLogsLoading } = api.glucose.getLogs.useQuery()
    const [glucoseLogs, setGlucoseLogs] = useState(data)

    useEffect(() => {
        if (timePeriod === "lastWeek") {
            setGlucoseLogs(data?.filter((log) => dayjs(log.date).isSame(dayjs(), "week")))
        } else if (timePeriod === "lastMonth") {
            setGlucoseLogs(data?.filter((log) => dayjs(log.date).isSame(dayjs(), "month")))
        } else {
            setGlucoseLogs(data)
        }
    }, [timePeriod])

    return (
        <div>
            <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline">
                    <p>
                        Last week
                    </p>
                    <Button variant="outline" className="size-1">
                        <XIcon className="size-3" />
                    </Button>
                </Badge>
            </div>
            <Card className="mt-2">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>
                            Glucose levels
                        </span>
                        <Sheet>
                            <Tooltip>
                                <SheetTrigger asChild>
                                    <TooltipTrigger asChild>
                                        <Button variant="outline" size="icon">
                                            <FilterIcon className="size-4" />
                                        </Button>
                                    </TooltipTrigger>
                                </SheetTrigger>
                                <TooltipContent>
                                    <p>Filter glucose levels</p>
                                </TooltipContent>
                            </Tooltip>
                            <SheetContent>
                                <SheetHeader>
                                    <SheetTitle>Filter glucose levels</SheetTitle>
                                    <SheetDescription>
                                        <div>
                                            <p className="text-sm font-medium">
                                                Time period
                                            </p>
                                            <div className="grid grid-cols-3 gap-2 mt-2">
                                                <Link href={`/logs/glucose`} className={cn(buttonVariants({
                                                    variant: "outline",
                                                    size: 'sm'
                                                }), "size-full")}>
                                                    <p>
                                                        All
                                                    </p>
                                                </Link>
                                                <Link href={`/logs/glucose?timePeriod=lastWeek`} className={cn(buttonVariants({
                                                    variant: "outline",
                                                    size: 'sm'
                                                }), "size-full")}>
                                                    <p>Last week</p>
                                                </Link>
                                                <Link href={`/logs/glucose?timePeriod=lastMonth`} className={cn(buttonVariants({
                                                    variant: "outline",
                                                    size: 'sm'
                                                }), "size-full")}>
                                                    <p>Last month</p>
                                                </Link>
                                            </div>
                                        </div>
                                    </SheetDescription>
                                </SheetHeader>
                            </SheetContent>
                        </Sheet>
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
