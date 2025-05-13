import React from 'react'
import { AppSidebar } from "~/components/app-sidebar"
import RouteBreadcrumbs from '~/components/common/route-breadcrumbs'
import UserButton from '~/components/common/user-button'
import { Separator } from "~/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar"

const Layout = ({ children }: { children: React.ReactNode }) => {
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
                <UserButton />
              </div>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4">
            {children}
            {/* <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" /> */}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}

export default Layout