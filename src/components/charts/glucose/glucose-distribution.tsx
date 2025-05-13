import { ChartTooltipContent, ChartTooltip, type ChartConfig, } from "~/components/ui/chart"
import { CartesianGrid, Scatter, ScatterChart, XAxis, YAxis } from "recharts"
import { ChartContainer } from "~/components/ui/chart"
import { CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Card } from "~/components/ui/card"
import type { GetGlucoseLogsOutput } from "~/trpc/react"
import dayjs from "dayjs"

export const GlucoseDistributionChart = ({ glucoseLogs, chartConfig }: { glucoseLogs: GetGlucoseLogsOutput, chartConfig: ChartConfig }) => {
    return (
        <div>
            <Card className="mt-2">
                <CardHeader>
                    <CardTitle>Glucose distribution</CardTitle>
                </CardHeader>
                <CardContent>
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
                                fill="var(--chart-5)"
                            />
                        </ScatterChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    )
}