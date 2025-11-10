"use client";

import { ThemeProvider } from "next-themes";
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
  
  return (
    <Toaster 
      position={isMobile ? "bottom-center" : "bottom-right"}
      richColors 
      closeButton
      toastOptions={{
        style: {
          marginBottom: isMobile ? '1rem' : '0',
        },
      }}
    />
  );
}
