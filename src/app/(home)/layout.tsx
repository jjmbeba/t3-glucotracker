import React from 'react'
import UserButton from '~/components/common/user-button'
import { auth } from '~/auth'
import { headers } from 'next/headers'
import { AppSidebar } from "~/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb"
import { Separator } from "~/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar"
import RouteBreadcrumbs from '~/components/common/route-breadcrumbs'

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b">
            <div className="flex items-center gap-2 px-3 w-full">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <RouteBreadcrumbs />
              <div className='flex-1 flex items-center justify-end'>
                <UserButton session={session} />
              </div>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4">
            {children}
            <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}

export default Layout