"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import {
  SystemIcon,
  LightIcon,
  DarkIcon,
} from "@/components/shared/theme-icons";
import { useSidebar } from "@/components/ui/sidebar";

// ThemeSwitcher adaptado para a Sidebar
// - Modo expandido: horizontal (padrão)
// - Modo collapsed: vertical com ícones menores
export const SidebarThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const { state } = useSidebar();
  const [mounted, setMounted] = useState(false);

  const isCollapsed = state === "collapsed";

  // Necessário para evitar erro de hidratação com next-themes
  // React 19 warning é esperado aqui - padrão oficial do next-themes
  useEffect(() => {
    setMounted(true);
  }, []);

  const themes = [
    { value: "system", label: "System", Icon: SystemIcon },
    { value: "light", label: "Light", Icon: LightIcon },
    { value: "dark", label: "Dark", Icon: DarkIcon },
  ];

  return (
    <div
      suppressHydrationWarning
      className={`flex items-center justify-center rounded-md border border-sidebar-border bg-sidebar transition-all ${
        isCollapsed
          ? "h-auto w-8 flex-col gap-0.5 p-1"
          : "h-8 w-auto gap-0 p-0.5"
      }`}
    >
      {themes.map(({ value, label, Icon }) => {
        const isActive = mounted && theme === value;

        return (
          <button
            key={value}
            onClick={() => setTheme(value)}
            className={`flex items-center justify-center rounded-sm transition-all ${
              isCollapsed ? "h-6 w-6" : "h-6 w-6"
            } ${
              isActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
            }`}
            aria-label={label}
            title={label}
          >
            <Icon className={isCollapsed ? "h-3.5 w-3.5" : "h-4 w-4"} />
          </button>
        );
      })}
    </div>
  );
};
