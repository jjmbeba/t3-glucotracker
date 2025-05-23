import { TRPCError } from '@trpc/server'
import GlucoseForm from '~/components/logs/forms/glucose'
import GlucoseHistory from '~/components/logs/history/glucose'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { api, HydrateClient } from '~/trpc/server'

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

const GlucoseLogsPage = async (props : {
    searchParams: SearchParams
}) => {
    void api.glucose.getLogs.prefetch()

    const searchParams = await props.searchParams
    const timePeriod = searchParams.timePeriod
    const tab = searchParams.tab
    const targetId = searchParams.targetId

    let analysis = ""
    let error = ''

    try {
        analysis = await api.glucose.getGlucoseAnalysis() ?? ''
    } catch (e) {
        if(e instanceof TRPCError && e.code === 'TOO_MANY_REQUESTS') {
            error = 'Too many requests. Please try again later for the glucose summary.'
        } else {
            error = 'An unknown error occurred'
        }
    }

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
                    </TabsList>
                    <TabsContent value='history'>
                        <GlucoseHistory error={error} analysis={analysis ?? ''} timePeriod={timePeriod as string ?? ''} targetId={targetId as string ?? ''} />
                    </TabsContent>
                    <TabsContent value='upload'>
                        <GlucoseForm />
                    </TabsContent>
                </Tabs>
            </div>
        </HydrateClient>
    )
}

export default GlucoseLogsPage