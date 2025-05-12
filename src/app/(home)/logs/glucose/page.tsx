import GlucoseForm from '~/components/logs/forms/glucose'
import GlucoseHistory from '~/components/logs/history/glucose'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { api, HydrateClient } from '~/trpc/server'

const GlucoseLogsPage = () => {
    void api.glucose.getLogs.prefetch()

    return (
        <HydrateClient>
            <div>
                <h2 className='page-title'>
                    Glucose Logs
                </h2>
                <Tabs defaultValue='upload'>
                    <TabsList>
                        <TabsTrigger value='history'>History</TabsTrigger>
                        <TabsTrigger value='upload'>Upload</TabsTrigger>
                    </TabsList>
                    <TabsContent value='history'>
                        <GlucoseHistory />
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