import * as React from "react"
import { GalleryVerticalEnd } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "~/components/ui/sidebar"
import Link from "next/link"
import type { auth } from "~/auth"
import UserButton from "./common/user-button"

type Session = Awaited<ReturnType<typeof auth.api.getSession>>

// This is sample data.
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      items: [
        {
          title: "Glucose Logs",
          url: "/dashboard/logs/glucose",
          isActive: true,
        },
        {
          title: "Meal Logs",
          url: "/dashboard/logs/meal",
        },
        {
          title: "Medication Logs",
          url: "/dashboard/logs/medication",
        },
      ],
    },
    {
      title: "Reports",
      url: "/reports",
      items: [
        {
          title: "Glucose Trends",
          url: "/reports/glucose-trends",
        }
      ]
    },
    {
      title: "Targets",
      url: "/targets",
      items: [
        {
          title: "Glucose",
          url: "/targets/glucose",
        },
        {
          title: "Meal",
          url: "/targets/meal",
        },
      ]
    },
    {
      title: "Settings",
      url: "/settings",
      items: [
        {
          title: "Profile",
          url: "/settings/profile",
        },
        {
          title: "Medication Management",
          url: "/settings/medication-management",
        },
      ]
    },
  ],
}

export function AppSidebar({ session, ...props }: React.ComponentProps<typeof Sidebar> & { session: Session }) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">GlucoTrack</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="flex flex-col justify-between leading-none flex-1">
          <SidebarMenu>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link href={item.url} className="font-medium">
                    {item.title}
                  </Link>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub>
                    {item.items.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton asChild isActive={item.isActive}>
                          <Link href={item.url}>{item.title}</Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
          <UserButton session={session} className="w-full" />
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
