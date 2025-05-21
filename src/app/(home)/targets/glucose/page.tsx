import { glucoseTargetsColumns } from "~/components/targets/columns/glucose-targets-columns"
import GlucoseTargetForm from "~/components/targets/forms/glucose"
import { DataTable } from "~/components/ui/data-table"
import type { GetGlucoseTargetsOutput } from "~/trpc/react"
import { api, HydrateClient } from "~/trpc/server"

const GlucoseTargetsPage = async () => {
    let targets: GetGlucoseTargetsOutput = []

    try {
        targets = await api.glucose.getTargets()
    } catch (error) {
        console.error(error)
    }

    return (
        <HydrateClient>
            <div>
                <h1 className="page-title">Glucose Targets</h1>
                <GlucoseTargetForm />
                <div className="mt-10">
                    <DataTable columns={glucoseTargetsColumns} data={targets} />
                </div>
            </div>
        </HydrateClient>
    )
}

export default GlucoseTargetsPage