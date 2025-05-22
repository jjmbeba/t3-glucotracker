"use client"

import { useQueryClient } from "@tanstack/react-query"
import { type ColumnDef } from "@tanstack/react-table"
import { getQueryKey } from "@trpc/react-query"
import dayjs from "dayjs"
import { ArrowUpDown, Loader2, MoreHorizontal } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "~/components/ui/alert-dialog"
import { Button, buttonVariants } from "~/components/ui/button"
import { Checkbox } from "~/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { capitalize, cn } from "~/lib/utils"
import { api, type GetMealLogsOutput } from "~/trpc/react"


export const mealLogColumns: ColumnDef<GetMealLogsOutput[number]>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "mealType",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Meal Type
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            return (
                <div>
                    {capitalize(row.original.mealType)}
                </div>
            )
        }
    },
    {
        accessorKey: "mealDescription",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Meal Description
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "estimatedCarbs",
        header: "Estimated Carbs (g)",
    },
    {
        accessorKey: "mealDate",
        header: "Meal Date",
        cell: ({ row }) => {
            return (
                <div>
                    {dayjs(row.original.mealDate).format("DD MMM YYYY")}
                </div>
            )
        }
    },
    {
        accessorKey: "notes",
        header: "Notes",
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const target = row.original

            const queryClient = useQueryClient()
            const targetsKey = getQueryKey(api.meal.getLogs, undefined, 'query')
            const router = useRouter()
            const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)


            const { mutate: deleteMealLog, isPending } = api.meal.deleteLog.useMutation({
                onSuccess: () => {
                    toast.success("Meal log deleted successfully")
                },
                onError: (error) => {
                    toast.error(error.message)
                    console.error(error)
                },
                onSettled: () => {
                    queryClient.invalidateQueries({ queryKey: targetsKey })
                    router.refresh()
                }
            })

            return (
                <div>
                    <Dialog>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DialogTrigger asChild>
                                    <DropdownMenuItem>Update Meal Log</DropdownMenuItem>
                                </DialogTrigger>
                                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                                    <AlertDialogTrigger asChild>
                                        <DropdownMenuItem onSelect={(e) => {
                                            e.preventDefault()
                                            setIsDeleteDialogOpen(true)
                                        }} className="text-destructive">Delete Meal Log</DropdownMenuItem>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete the meal log.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
                                            <AlertDialogAction className={cn(buttonVariants({ variant: "destructive" }))} disabled={isPending} onClick={() =>{
                                                 deleteMealLog({id: target.id})
                                                 setIsDeleteDialogOpen(false)
                                            }}>
                                                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Update target</DialogTitle>
                            </DialogHeader>
                            {/* <GlucoseTargetForm defaultValues={
                                {
                                    ...target,
                                    units: target.units as 'mg/dL' | 'mmol/L'
                                }
                            } type="update" id={target.id} /> */}
                        </DialogContent>
                    </Dialog>
                </div>
            )
        },
    },
]
