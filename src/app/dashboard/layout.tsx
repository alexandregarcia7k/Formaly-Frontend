import { DashboardLayoutClient } from "./layout-client";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Modo desenvolvimento - acesso livre ao dashboard
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
