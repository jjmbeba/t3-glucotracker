import React from 'react'
import { HydrateClient } from '~/trpc/server'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import MealUpload from '~/components/logs/forms/meal-upload'

const Page = () => {
  return (
    <HydrateClient>
        <div>
            <h1 className='page-title'>Meal</h1>
            <Tabs defaultValue="history">
                <TabsList>
                    <TabsTrigger value="history">History</TabsTrigger>
                    <TabsTrigger value="upload">Upload</TabsTrigger>
                </TabsList>
                <TabsContent value="history">
                    {/* <MealHistory /> */}
                    Meal history will be displayed here.
                </TabsContent>
                <TabsContent value="upload">
                    <MealUpload />
                </TabsContent>
            </Tabs>
        </div>
    </HydrateClient>
  )
}

export default Page