import { FilterIcon } from "lucide-react"
import Link from "next/link"

import { Button, buttonVariants } from "~/components/ui/button"

import { Sheet, SheetDescription, SheetTitle, SheetHeader, SheetContent, SheetTrigger } from "~/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip"
import { cn } from "~/lib/utils"

type Props = {
    tooltipContent: string
}

const FilterLogs = ({ tooltipContent }: Props) => {
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
                                <Link href={`/logs/glucose`} className={cn(buttonVariants({
                                    variant: "outline",
                                    size: 'sm'
                                }), "size-full")}>
                                    <p>
                                        All
                                    </p>
                                </Link>
                                <Link href={`/logs/glucose?timePeriod=lastWeek`} className={cn(buttonVariants({
                                    variant: "outline",
                                    size: 'sm'
                                }), "size-full")}>
                                    <p>Last week</p>
                                </Link>
                                <Link href={`/logs/glucose?timePeriod=lastMonth`} className={cn(buttonVariants({
                                    variant: "outline",
                                    size: 'sm'
                                }), "size-full")}>
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