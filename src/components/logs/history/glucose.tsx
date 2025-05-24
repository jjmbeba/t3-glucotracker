"use client"

import { type GetGlucoseLogsOutput, type GetGlucoseTargetsOutput } from '~/trpc/react'

import dayjs from "dayjs"
import { MessageSquareWarningIcon, PlusIcon } from 'lucide-react'
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { GlucoseDistributionChart } from "~/components/charts/glucose/glucose-distribution"
import { GlucoseHistoryChart } from "~/components/charts/glucose/glucose-history"
import GlucosePieChart from '~/components/charts/glucose/glucose-pie'
import {
    type ChartConfig
} from "~/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Skeleton } from "~/components/ui/skeleton"
import { cn, constructNewUrl } from "~/lib/utils"
import FilterLabels from "../common/filter-labels"
import FilterGlucoseLogs from "../common/filter-logs"

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

type Props = {
    glucoseLogsData: GetGlucoseLogsOutput
    error: string
    analysis: string
    timePeriod: string
    targetId: string
    glucoseTargetsData: GetGlucoseTargetsOutput
}

const GlucoseHistory = ({ glucoseLogsData, glucoseTargetsData, error, analysis, timePeriod, targetId }: Props) => {
    const pathname = usePathname()
    const router = useRouter()

    const [glucoseLogs, setGlucoseLogs] = useState<GetGlucoseLogsOutput>(glucoseLogsData)
    const [selectedTarget, setSelectedTarget] = useState<GetGlucoseTargetsOutput[number] | null>(null)

    useEffect(() => {
        if (!glucoseLogsData) return

        if (timePeriod === "lastWeek") {
            setGlucoseLogs(glucoseLogsData.filter((log) => dayjs(log.date).isSame(dayjs(), "week")))
        } else if (timePeriod === "lastMonth") {
            setGlucoseLogs(glucoseLogsData.filter((log) => dayjs(log.date).isSame(dayjs(), "month")))
        } else {
            setGlucoseLogs(glucoseLogsData)
        }
    }, [timePeriod, glucoseLogsData])

    useEffect(() => {
        if (!glucoseTargetsData) return

        setSelectedTarget(glucoseTargetsData.find((target) => target.id.toString() === targetId) ?? null)
    }, [glucoseTargetsData, targetId])

    const timePeriodLabel = timePeriod === "lastWeek" ? "Last week" : timePeriod === "lastMonth" ? "Last month" : null

    if (glucoseLogs.length === 0) {
        return (
            <div className="flex flex-col">
                <div className='flex items-center justify-end'>
                    <FilterGlucoseLogs tooltipContent="Filter glucose levels" timePeriod={timePeriod} />
                </div>
                <div className="flex flex-col min-h-[calc(100vh-10rem)] justify-center items-center">
                    <div className="flex flex-col items-center gap-2">
                        <p className="text-sm text-muted-foreground">
                            Start tracking your glucose levels to see them here.
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col">
            <div className={cn("flex flex-col sm:flex-row items-start sm:items-center gap-2", {
                "justify-end": !!!timePeriodLabel,
                "justify-between": !!timePeriodLabel,
            })}>
                {timePeriodLabel && <FilterLabels timePeriodLabel={timePeriodLabel} pathname={pathname} />}
                <div className="flex items-center gap-2">
                    <FilterGlucoseLogs tooltipContent="Filter glucose levels" />
                    {glucoseTargetsData && glucoseTargetsData.length > 0 && <Select defaultValue={targetId === "" ? constructNewUrl(pathname, {}) : constructNewUrl(pathname, { targetId })} onValueChange={(value) => {
                        router.push(value)
                    }}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="No target selected" className='placeholder:text-xs' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={constructNewUrl(pathname, {})}>
                                None
                            </SelectItem>
                            {glucoseTargetsData?.map((target) => (
                                <SelectItem key={target.id} value={constructNewUrl(pathname, { targetId: target.id.toString() })}>
                                    {target.targetName}
                                </SelectItem>
                            ))}
                            <SelectItem value={constructNewUrl('/targets/glucose', {})}>
                                <PlusIcon className="w-4 h-4 mr-2" />
                                Add more glucose targets
                            </SelectItem>
                        </SelectContent>
                    </Select>}
                </div>
            </div>
            <div className="mt-4">
                <p className="text-sm text-muted-foreground">
                    {error ? (
                        <span className="text-red-500 flex items-center gap-2">
                            <MessageSquareWarningIcon className='size-4' />
                            {error}
                        </span>
                    ) : analysis}
                </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                <div className="lg:col-span-1">
                    <GlucoseHistoryChart className="mt-2" glucoseLogs={glucoseLogs ?? []} glucoseTarget={selectedTarget} chartConfig={chartConfig} />
                </div>
                <div className="lg:col-span-1">
                    <GlucoseDistributionChart glucoseLogs={glucoseLogs ?? []} glucoseTarget={selectedTarget} chartConfig={chartConfig} />
                </div>
                <div className="lg:col-span-1">
                    <GlucosePieChart glucoseLogs={glucoseLogs ?? []} />
                </div>
            </div>
        </div>
    )
}

export default GlucoseHistory