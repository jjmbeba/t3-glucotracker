import React from 'react'
import MedicationSetup from '~/components/logs/forms/medication-setup'
import MedicationUploadForm from '~/components/logs/forms/medication-upload'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { api, HydrateClient } from '~/trpc/server'


const MedicationPage = async () => {
    void api.medication.getMedicationSetup.prefetch({
        namesOnly: true
    })

    return (
        <HydrateClient>
            <main>
                <h1 className='page-title'>Medication</h1>
                <Tabs defaultValue="history">
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
            </main >
        </HydrateClient>
    )
}

export default MedicationPage