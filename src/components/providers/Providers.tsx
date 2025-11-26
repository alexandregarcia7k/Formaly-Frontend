"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider, useTheme } from "next-themes";
import { Toaster } from "sonner";
import { ReactNode } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

/**
 * Providers Component
 * Agrupa todos os providers da aplicação:
 * - SessionProvider: Auth.js session management
 * - ThemeProvider: Dark/light mode
 * - Toaster: Notificações
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
        <ToasterWrapper />
      </ThemeProvider>
    </SessionProvider>
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
