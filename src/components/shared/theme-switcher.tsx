"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { SystemIcon, LightIcon, DarkIcon } from "./theme-icons";

// Desabilita o React Compiler para este componente devido ao padrão de hidratação necessário
export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Necessário para evitar erro de hidratação com next-themes
  // O tema só está disponível no cliente, não no servidor
  useEffect(() => {
    setMounted(true);
  }, []);
  const themes = [
    { value: "system", label: "System", Icon: SystemIcon },
    { value: "light", label: "Light", Icon: LightIcon },
    { value: "dark", label: "Dark", Icon: DarkIcon },
  ];

  return (
    <div className="flex h-8 items-center justify-center rounded-full border border-border bg-background">
      {themes.map(({ value, label, Icon }) => {
        // Evita mismatch: só ativa após montar no cliente
        const isActive = mounted && theme === value;

        return (
          <button
            key={value}
            onClick={() => setTheme(value)}
            className={`flex h-7 w-7 items-center justify-center rounded-full transition-all ${
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            aria-label={label}
            title={label}
          >
            <Icon />
          </button>
        );
      })}
    </div>
  );
};
