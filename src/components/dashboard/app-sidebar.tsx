"use client";

import * as React from "react";
import Link from "next/link";
import {
  IconChartBar,
  IconDashboard,
  IconFileAnalytics,
  IconForms,
  IconLayoutGrid,
  IconSettings,
  IconTemplate,
  IconUsers,
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/dashboard/nav-documents";
import { NavMain } from "@/components/dashboard/nav-main";
import { NavSecondary } from "@/components/dashboard/nav-secondary";
import { NavUser } from "@/components/dashboard/nav-user";
import { ThemeSwitcher } from "@/components/shared/theme-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/landing/logo";

const data = {
  user: {
    name: "Alexandre Garcia",
    email: "alexandre@formaly.com",
    avatar: "/avatars/user.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Meus Formulários",
      url: "/dashboard/forms",
      icon: IconForms,
    },
    {
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: IconChartBar,
    },
    {
      title: "Respostas",
      url: "/dashboard/responses",
      icon: IconFileAnalytics,
    },
    {
      title: "Equipe",
      url: "/dashboard/team",
      icon: IconUsers,
    },
  ],
  navClouds: [
    {
      title: "Templates",
      icon: IconTemplate,
      isActive: true,
      url: "/dashboard/templates",
      items: [
        {
          title: "Meus Templates",
          url: "/dashboard/templates/my",
        },
        {
          title: "Templates Públicos",
          url: "/dashboard/templates/public",
        },
        {
          title: "Favoritos",
          url: "/dashboard/templates/favorites",
        },
      ],
    },
    {
      title: "Integrações",
      icon: IconLayoutGrid,
      url: "/dashboard/integrations",
      items: [
        {
          title: "Ativas",
          url: "/dashboard/integrations/active",
        },
        {
          title: "Disponíveis",
          url: "/dashboard/integrations/available",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Configurações",
      url: "/dashboard/settings",
      icon: IconSettings,
    },
  ],
  documents: [],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/dashboard" className="flex items-center gap-2">
                <Logo className="size-6!" />
                <span className="text-lg font-bold">Formaly</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {data.documents.length > 0 && <NavDocuments items={data.documents} />}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <div className="px-3 py-2 flex justify-center">
          <ThemeSwitcher />
        </div>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
