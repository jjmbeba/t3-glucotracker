import { TRPCError } from '@trpc/server'
import GlucoseForm from '~/components/logs/forms/glucose'
import GlucoseHistory from '~/components/logs/history/glucose'
import { glucoseLogsColumns } from '~/components/targets/columns/glucose-logs-columns'
import { DataTable } from '~/components/ui/data-table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { api, HydrateClient } from '~/trpc/server'

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

const GlucoseLogsPage = async (props: {
    searchParams: SearchParams
}) => {
    void api.glucose.getLogs.prefetch()

    const { timePeriod, tab, targetId } = await props.searchParams

    let analysis = ""
    let error = ''

    try {
        analysis = await api.glucose.getGlucoseAnalysis() ?? ''
    } catch (e) {
        if (e instanceof TRPCError && e.code === 'TOO_MANY_REQUESTS') {
            error = 'Too many requests. Please try again later for the glucose summary.'
        } else {
            error = 'An unknown error occurred'
        }
    }

    const glucoseLogs = await api.glucose.getLogs()
    const glucoseTargets = await api.glucose.getTargets()

    return (
        <HydrateClient>
            <div>
                <h2 className='page-title'>
                    Glucose
                </h2>
                <Tabs defaultValue={tab as string ?? 'history'}>
                    <TabsList>
                        <TabsTrigger value='history'>History</TabsTrigger>
                        <TabsTrigger value='upload'>Upload</TabsTrigger>
                        <TabsTrigger value='update'>Update</TabsTrigger>
                    </TabsList>
                    <TabsContent value='history'>
                        <GlucoseHistory glucoseLogsData={glucoseLogs} glucoseTargetsData={glucoseTargets} error={error} analysis={analysis ?? ''} timePeriod={timePeriod as string ?? ''} targetId={targetId as string ?? ''} />
                    </TabsContent>
                    <TabsContent value='upload'>
                        <GlucoseForm type='create' />
                    </TabsContent>
                    <TabsContent value='update'>
                        <DataTable columns={glucoseLogsColumns} data={glucoseLogs} searchedColumn="type" searchedColumnLabel="Type" />
                    </TabsContent>
                </Tabs>
            </div>
        </HydrateClient>
    )
}

export default GlucoseLogsPage