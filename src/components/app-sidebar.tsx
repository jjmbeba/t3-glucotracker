import { Droplet } from "lucide-react"
import * as React from "react"

import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarRail
} from "~/components/ui/sidebar"
import UserButton from "./common/user-button"
import SidebarLink from "./ui/sidebar-link"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      items: [
        {
          title: "Glucose Logs",
          url: "/dashboard/glucose",
        },
        {
          title: "Meal Logs",
          url: "/dashboard/meal",
        },
        {
          title: "Medication Logs",
          url: "/dashboard/medication",
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Droplet className="size-4" />
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
                      <SidebarLink key={item.title} item={item} />
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
          <UserButton showLogout={true} className="w-full" />
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
