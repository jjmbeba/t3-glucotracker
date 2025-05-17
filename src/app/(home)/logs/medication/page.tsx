import MedicationSetup from '~/components/logs/forms/medication-setup'
import MedicationUploadForm from '~/components/logs/forms/medication-upload'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { HydrateClient } from '~/trpc/server'

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

const MedicationPage = async (props: {
    searchParams: SearchParams
}) => {
    const searchParams = await props.searchParams
    const tab = searchParams.tab

    return (
        <HydrateClient>
            <main>
                <h1 className='page-title'>Medication</h1>
                <Tabs defaultValue={tab as string ?? 'history'}>
                    <TabsList>
                        <TabsTrigger value="history">
                            History
                        </TabsTrigger>
                        <TabsTrigger value="upload">
                            Upload
                        </TabsTrigger>
                        <TabsTrigger value="setup">
                            Setup
                        </TabsTrigger>
                    </TabsList>
                    <div className='mt-8'>
                        <TabsContent value="history">
                            {/* <MedicationHistory /> */}
                            Medication history will be displayed here.
                        </TabsContent>
                        <TabsContent value="upload">
                            <MedicationUploadForm />
                        </TabsContent>
                        <TabsContent value="setup">
                            <MedicationSetup />
                        </TabsContent>
                    </div>
                </Tabs>
            </main>
        </HydrateClient>
    )
}

export default MedicationPage