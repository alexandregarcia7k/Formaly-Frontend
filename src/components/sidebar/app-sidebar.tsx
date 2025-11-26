"use client";

import * as React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

// 🎯 ATENÇÃO: Para modificar links da sidebar, edite o arquivo:
// src/config/sidebar.config.ts
import { mainLinks, secondaryLinks } from "@/config/sidebar.config";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavSecondary } from "@/components/sidebar/nav-secondary";
import { NavUser } from "@/components/sidebar/nav-user";
import { SidebarThemeSwitcher } from "@/components/sidebar/sidebar-theme-switcher";
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

type AppSidebarProps = React.ComponentProps<typeof Sidebar>;

export function AppSidebar({ ...props }: AppSidebarProps) {
  const { data: session } = useSession();

  const user = {
    name: session?.user?.name || "Usuário",
    email: session?.user?.email || "usuario@email.com",
    avatar: session?.user?.image || "",
  };

  return (
    <Sidebar collapsible="icon" {...props}>
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
        {/* 📍 LINKS PRINCIPAIS - Configurados em sidebar.config.ts */}
        <NavMain items={mainLinks} />

        {/* 📍 LINKS SECUNDÁRIOS - Configurados em sidebar.config.ts */}
        <NavSecondary items={secondaryLinks} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <div className="px-3 py-2 flex justify-center">
          <SidebarThemeSwitcher />
        </div>

        {/* 📍 DADOS DO USUÁRIO - Vindos da sessão NextAuth */}
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
