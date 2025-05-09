"use client"

import React from 'react'
import { Breadcrumb, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbLink, BreadcrumbItem, BreadcrumbList } from '../ui/breadcrumb'
import { usePathname } from 'next/navigation'
import { capitalize } from '~/lib/utils'

const RouteBreadcrumbs = () => {
    const pathname = usePathname()
    const pathnames = pathname.split('/').filter(Boolean)

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href={`/${pathnames[0]}`}>
                        {capitalize(pathnames[0] ?? '')}
                    </BreadcrumbLink>
                </BreadcrumbItem>
                {pathnames.slice(1).map((pathname) => (
                    <div key={pathname} className='flex items-center gap-2'>
                        <BreadcrumbSeparator className="hidden md:block" />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{capitalize(pathname)}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </div>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    )
}

export default RouteBreadcrumbs