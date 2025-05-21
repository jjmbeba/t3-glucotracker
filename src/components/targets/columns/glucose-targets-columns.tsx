"use client"

import { useQueryClient } from "@tanstack/react-query"
import { type ColumnDef } from "@tanstack/react-table"
import { getQueryKey } from "@trpc/react-query"
import { ArrowUpDown, Loader2, MoreHorizontal } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "~/components/ui/alert-dialog"
import { Button, buttonVariants } from "~/components/ui/button"
import { Checkbox } from "~/components/ui/checkbox"
import { Dialog, DialogTitle, DialogHeader, DialogContent, DialogTrigger } from "~/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { cn } from "~/lib/utils"
import { api, type GetGlucoseTargetsOutput } from "~/trpc/react"
import GlucoseTargetForm from "../forms/glucose"


export const glucoseTargetsColumns: ColumnDef<GetGlucoseTargetsOutput[number]>[] = [
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
        accessorKey: "targetName",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Target Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "lowThreshold",
        header: "Low Threshold",
    },
    {
        accessorKey: "highThreshold",
        header: "High Threshold",
    },
    {
        accessorKey: "units",
        header: "Units",
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const target = row.original

            const queryClient = useQueryClient()
            const targetsKey = getQueryKey(api.glucose.getTargets, undefined, 'query')
            const router = useRouter()
            const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
            

            const { mutate: deleteTarget, isPending } = api.glucose.deleteTarget.useMutation({
                onSuccess: () => {
                    toast.success("Target deleted successfully")
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
                                    <DropdownMenuItem>Update target</DropdownMenuItem>
                                </DialogTrigger>
                                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                                    <AlertDialogTrigger asChild>
                                        <DropdownMenuItem onSelect={(e) => {
                                            e.preventDefault()
                                            setIsDeleteDialogOpen(true)
                                        }} className="text-destructive">Delete target</DropdownMenuItem>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete the glucose target.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
                                            <AlertDialogAction className={cn(buttonVariants({ variant: "destructive" }))} disabled={isPending} onClick={() =>{
                                                 deleteTarget(target.id)
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
                            <GlucoseTargetForm defaultValues={
                                {
                                    ...target,
                                    units: target.units as 'mg/dL' | 'mmol/L'
                                }
                            } type="update" id={target.id} />
                        </DialogContent>
                    </Dialog>
                </div>
            )
        },
    },
]
