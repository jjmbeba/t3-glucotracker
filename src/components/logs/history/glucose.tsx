"use client"

import { api } from '~/trpc/react'

import dayjs from "dayjs"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { GlucoseDistributionChart } from "~/components/charts/glucose/glucose-distribution"
import { GlucoseHistoryChart } from "~/components/charts/glucose/glucose-history"
import {
    type ChartConfig
} from "~/components/ui/chart"
import { cn } from "~/lib/utils"
import FilterLabels from "../common/filter-labels"
import FilterGlucoseLogs from "../common/filter-logs"
import GlucosePieChart from '~/components/charts/glucose/glucose-pie'
import { Skeleton } from "~/components/ui/skeleton"

const chartConfig = {
    glucose: {
        label: "Glucose",
        color: "hsl(var(--chart-5))",
    }
} satisfies ChartConfig

const GlucoseHistorySkeleton = () => {
    return (
        <div className="flex flex-col">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-8 w-8" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                <div className="lg:col-span-2">
                    <div className="mt-2">
                        <Skeleton className="h-8 w-48 mb-4" />
                        <Skeleton className="h-[300px] w-full" />
                    </div>
                </div>
                <div className="lg:col-span-1">
                    <div className="mt-2">
                        <Skeleton className="h-8 w-48 mb-4" />
                        <Skeleton className="h-[300px] w-full" />
                    </div>
                </div>
                <div className="lg:col-span-1">
                    <div className="mt-2">
                        <Skeleton className="h-8 w-48 mb-4" />
                        <Skeleton className="h-[300px] w-full" />
                    </div>
                </div>
            </div>
        </div>
    )
}

const GlucoseHistory = ({ timePeriod }: { timePeriod: string }) => {
    const { data, isLoading: isGlucoseLogsLoading } = api.glucose.getLogs.useQuery()

    const [glucoseLogs, setGlucoseLogs] = useState(data)
    const pathname = usePathname()

    useEffect(() => {
        if (timePeriod === "lastWeek") {
            setGlucoseLogs(data?.filter((log) => dayjs(log.date).isSame(dayjs(), "week")))
        } else if (timePeriod === "lastMonth") {
            setGlucoseLogs(data?.filter((log) => dayjs(log.date).isSame(dayjs(), "month")))
        } else {
            setGlucoseLogs(data)
        }
    }, [timePeriod, data])

    const timePeriodLabel = timePeriod === "lastWeek" ? "Last week" : timePeriod === "lastMonth" ? "Last month" : null

    if (isGlucoseLogsLoading) {
        return <GlucoseHistorySkeleton />
    }

    return (
        <div className="flex flex-col">
            <div className={cn("flex flex-col sm:flex-row items-start sm:items-center gap-2", {
                "justify-end": !!!timePeriodLabel,
                "justify-between": !!timePeriodLabel,
            })}>
                {timePeriodLabel && <FilterLabels timePeriodLabel={timePeriodLabel} pathname={pathname} />}
                <FilterGlucoseLogs tooltipContent="Filter glucose levels" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                <div className="lg:col-span-1">
                    <GlucoseHistoryChart glucoseLogs={glucoseLogs ?? []} chartConfig={chartConfig} />
                </div>
                <div className="lg:col-span-1">
                    <GlucoseDistributionChart glucoseLogs={glucoseLogs ?? []} chartConfig={chartConfig} />
                </div>
                <div className="lg:col-span-1">
                    <GlucosePieChart glucoseLogs={glucoseLogs ?? []} />
                </div>
            </div>
        </div>
    )
}

export default GlucoseHistory