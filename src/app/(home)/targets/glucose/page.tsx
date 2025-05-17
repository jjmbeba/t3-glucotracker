import GlucoseTargetForm from "~/components/targets/forms/glucose"
import { HydrateClient } from "~/trpc/server"

const GlucoseTargetsPage = () => {
    return (
        <HydrateClient>
            <div>
                <h1 className="page-title">Glucose Targets</h1>
                <GlucoseTargetForm />
            </div>
        </HydrateClient>
    )
}

export default GlucoseTargetsPage