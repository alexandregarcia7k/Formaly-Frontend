import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardLayoutClient } from "./layout-client";

/**
 * Dashboard Layout - Server Component
 * Proteção no servidor ANTES de renderizar cliente
 * @see https://nextjs.org/docs/app/building-your-application/routing/layouts-and-templates
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Proteção: redireciona se não autenticado
  if (!session?.user) {
    redirect("/login");
  }

  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
