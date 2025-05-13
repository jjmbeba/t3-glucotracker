'use client'

import React from 'react'
import { SidebarMenuSubButton } from './sidebar'
import { SidebarMenuSubItem } from './sidebar'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Props = {
    item: {
        title: string
        url: string
    }
}
const SidebarLink = ({ item }: Props) => {
    const pathname = usePathname()

    return (
        <SidebarMenuSubItem key={item.title}>
            <SidebarMenuSubButton asChild isActive={pathname.split('?')[0] === item.url}>
                <Link href={item.url}>{item.title}</Link>
            </SidebarMenuSubButton>
        </SidebarMenuSubItem>
    )
}

export default SidebarLink