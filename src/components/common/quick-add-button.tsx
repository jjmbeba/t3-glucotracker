'use client'

import { PlusIcon } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'
import { useSidebar } from '../ui/sidebar'
import { cn } from '~/lib/utils'

const QuickAddButton = () => {
    const { isMobile, state } = useSidebar()

    return (
        <Button variant='outline' size={isMobile ? 'icon' : 'default'}>
            <PlusIcon className='size-4' />
            <span className={cn("hidden", isMobile ? "ml-2" : "sm:block")}>Quick add</span>
        </Button>
    )
}

export default QuickAddButton