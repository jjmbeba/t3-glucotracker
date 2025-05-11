import GlucoseForm from '~/components/logs/forms/glucose'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
const GlucoseLogsPage = () => {
    return (
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
                    <div>
                        <h3>History</h3>
                    </div>
                </TabsContent>
                <TabsContent value='upload'>
                    <GlucoseForm />
                </TabsContent>
                
            </Tabs>
        </div>
    )
}

export default GlucoseLogsPage