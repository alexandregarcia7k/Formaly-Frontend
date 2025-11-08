/**
 * 🎯 SIDEBAR CONFIGURATION
 *
 * Este arquivo centraliza TODOS os dados da sidebar.
 * Para modificar links, ícones ou informações do usuário, edite apenas aqui!
 *
 * Como usar:
 * - Para adicionar um link: adicione um objeto em mainLinks ou secondaryLinks
 * - Para remover um link: delete o objeto correspondente
 * - Para alterar a ordem: reordene os itens no array
 * - Para mudar ícones: importe o ícone desejado e substitua
 */

import {
  IconLayoutDashboard,
  IconForms,
  IconChartBar,
  IconCloudDataConnection,
  IconUsers,
  IconFileText,
  IconSearch,
  IconSettings,
  IconHelp,
} from "@tabler/icons-react";

// ============================================
// 📍 USER DATA
// ============================================
export const sidebarUser = {
  name: "shadcn",
  email: "m@example.com",
  avatar: "/avatars/shadcn.jpg",
};

// ============================================
// 📍 MAIN NAVIGATION LINKS
// ============================================
export const mainLinks = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: IconLayoutDashboard,
  },
  {
    title: "Formulários",
    url: "/dashboard/forms",
    icon: IconForms,
  },
  {
    title: "Respostas",
    url: "/dashboard/responses",
    icon: IconFileText,
  },
  {
    title: "Analytics",
    url: "/dashboard/analytics",
    icon: IconChartBar,
  },
  {
    title: "Integrações",
    url: "/dashboard/integrations",
    icon: IconCloudDataConnection,
  },
];

// ============================================
// 📍 SECONDARY NAVIGATION LINKS
// ============================================
export const secondaryLinks = [
  {
    title: "Team",
    url: "/dashboard/team",
    icon: IconUsers,
  },
  {
    title: "Templates",
    url: "/dashboard/templates",
    icon: IconFileText,
  },
  {
    title: "Search",
    url: "/dashboard/search",
    icon: IconSearch,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: IconSettings,
  },
  {
    title: "Help",
    url: "/help",
    icon: IconHelp,
  },
];

// ============================================
// 📍 TYPE DEFINITIONS (para TypeScript)
// ============================================
export type SidebarLink = {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
};

export type SidebarUser = {
  name: string;
  email: string;
  avatar: string;
};
