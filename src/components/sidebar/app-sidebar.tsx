"use client";

import * as React from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user: authUser } = useAuth();

  // TODO: Buscar dados do usuário da API GET /auth/me
  const user = {
    name: authUser?.name || "Usuário",
    email: authUser?.email || "usuario@email.com",
    avatar: authUser?.image || "",
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
