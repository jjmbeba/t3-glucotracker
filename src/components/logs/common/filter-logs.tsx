import { FilterIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Button, buttonVariants } from "~/components/ui/button"

import { Sheet, SheetDescription, SheetTitle, SheetHeader, SheetContent, SheetTrigger } from "~/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip"
import { cn, constructNewUrl } from "~/lib/utils"

type Props = {
    tooltipContent: string
    timePeriod?: string
}

const FilterLogs = ({ tooltipContent, timePeriod }: Props) => {
    const pathname = usePathname()

    return (
        <Sheet  >
            <Tooltip>
                <SheetTrigger asChild>
                    <TooltipTrigger asChild>
                        <Button variant="outline" size="icon">
                            <FilterIcon className="size-4" />
                        </Button>
                    </TooltipTrigger>
                </SheetTrigger>
                <TooltipContent>
                    <p>{tooltipContent}</p>
                </TooltipContent>
            </Tooltip>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Filter glucose levels</SheetTitle>
                    <SheetDescription>
                        <div>
                            <p className="text-sm font-medium">
                                Time period
                            </p>
                            <div className="grid grid-cols-3 gap-2 mt-2">
                                <Link href={constructNewUrl(pathname, {})} className={cn(buttonVariants({
                                    variant: "outline",
                                    size: 'sm'
                                }), "size-full", {
                                    "bg-primary text-primary-foreground": timePeriod === ""
                                })}>
                                    <p>
                                        All
                                    </p>
                                </Link>
                                <Link href={timePeriod === "lastWeek" ? constructNewUrl(pathname, {}) : constructNewUrl(pathname, { timePeriod: "lastWeek" })} className={cn(buttonVariants({
                                    variant: "outline",
                                    size: 'sm'
                                }), "size-full", {
                                    "bg-primary text-primary-foreground": timePeriod === "lastWeek"
                                })}>
                                    <p>Last week</p>
                                </Link>
                                <Link href={timePeriod === "lastMonth" ? constructNewUrl(pathname, {}) : constructNewUrl(pathname, { timePeriod: "lastMonth" })} className={cn(buttonVariants({
                                    variant: "outline",
                                    size: 'sm'
                                }), "size-full", {
                                    "bg-primary text-primary-foreground": timePeriod === "lastMonth"
                                })}>
                                    <p>Last month</p>
                                </Link>
                            </div>
                        </div>
                    </SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    )
}

export default FilterLogs