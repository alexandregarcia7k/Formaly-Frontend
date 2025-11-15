"use client";

import { ThemeProvider, useTheme } from "next-themes";
import { Toaster } from "sonner";
import { ReactNode } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

/**
 * Providers Component - Modo Desenvolvimento UI/UX
 * ThemeProvider para dark/light mode + Toaster para notificações
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
      <ToasterWrapper />
    </ThemeProvider>
  );
}

function ToasterWrapper() {
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  
  return (
    <Toaster 
      position={isMobile ? "bottom-center" : "bottom-right"}
      theme={theme as "light" | "dark" | "system"}
      closeButton
      toastOptions={{
        style: {
          marginBottom: isMobile ? '1rem' : '0',
          background: 'hsl(var(--background))',
          color: 'hsl(var(--foreground))',
          border: '1px solid hsl(var(--border))',
        },
        className: 'toast-custom',
      }}
    />
  );
}
