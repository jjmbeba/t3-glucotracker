import MealLogForm from '~/components/logs/forms/meal-upload'
import { mealLogColumns } from '~/components/targets/columns/meal-logs-columns'
import { DataTable } from '~/components/ui/data-table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import type { GetMealLogsOutput } from '~/trpc/react'
import { api, HydrateClient } from '~/trpc/server'

const Page = async () => {
    let mealLogs: GetMealLogsOutput = []

    try {
        mealLogs = await api.meal.getLogs()
    } catch (error) {
        console.error(error)
    }

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
                        <div className="mt-10">
                            <DataTable columns={mealLogColumns} data={mealLogs} searchedColumn="mealType" searchedColumnLabel="Meal Type" />
                        </div>
                    </TabsContent>
                    <TabsContent value="upload">
                        <MealLogForm type="create" />
                    </TabsContent>
                </Tabs>
            </div>
        </HydrateClient>
    )
}

export default Page