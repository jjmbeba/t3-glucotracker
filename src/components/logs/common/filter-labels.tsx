import { cn, removeSearchParam } from "~/lib/utils"

import { Badge } from "~/components/ui/badge"
import { XIcon } from "lucide-react"
import { buttonVariants } from "~/components/ui/button"
import Link from "next/link"

const FilterLabels = ({ timePeriodLabel, pathname }: { timePeriodLabel: string, pathname: string }) => {
    return (
        <div className="flex items-center gap-2 flex-wrap">
            <Badge asChild variant="outline">
                <div className="flex items-center gap-2">
                    <span>{timePeriodLabel}</span>
                    <Link href={removeSearchParam(pathname, "timePeriod")} className={cn(buttonVariants({
                        variant: "outline",
                    }), "size-1")}>
                        <XIcon className="size-3" />
                    </Link>
                </div>
            </Badge>
        </div>
    )
}

export default FilterLabels