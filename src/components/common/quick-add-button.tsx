'use client'

import { PlusIcon } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'
import { useSidebar } from '../ui/sidebar'
import { cn } from '~/lib/utils'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"


const QuickAddButton = () => {
    const { isMobile } = useSidebar()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant='outline' size={isMobile ? 'icon' : 'default'}>
                    <PlusIcon className='size-4' />
                    <span className={cn("hidden", isMobile ? "ml-2" : "sm:block")}>Quick add</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Add</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Glucose Log</DropdownMenuItem>
                <DropdownMenuItem>Medication Log</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

    )
}

export default QuickAddButton