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

const chartConfig = {
    glucose: {
        label: "Glucose",
        color: "hsl(var(--chart-5))",
    }
} satisfies ChartConfig


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
    }, [timePeriod])

    const timePeriodLabel = timePeriod === "lastWeek" ? "Last week" : timePeriod === "lastMonth" ? "Last month" : null

    return (
        <div className="flex flex-col">
            <div className={cn("flex items-center", {
                "justify-end": !!!timePeriodLabel,
                "justify-between": !!timePeriodLabel,
            })}>
                {timePeriodLabel && <FilterLabels timePeriodLabel={timePeriodLabel} pathname={pathname} />}
                <FilterGlucoseLogs tooltipContent="Filter glucose levels" />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
                <GlucoseHistoryChart glucoseLogs={glucoseLogs ?? []} chartConfig={chartConfig} />
                <GlucoseDistributionChart glucoseLogs={glucoseLogs ?? []} chartConfig={chartConfig} />
            </div>
        </div>
    )
}

export default GlucoseHistory