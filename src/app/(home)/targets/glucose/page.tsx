import { glucoseTargetsColumns } from "~/components/targets/columns/glucose-targets-columns"
import GlucoseTargetForm from "~/components/targets/forms/glucose"
import { DataTable } from "~/components/ui/data-table"
import { api, HydrateClient } from "~/trpc/server"

const GlucoseTargetsPage = async () => {
    const targets = await api.glucose.getTargets()

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