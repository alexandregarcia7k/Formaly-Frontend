"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { tokenManager } from "@/lib/token-manager";

export function LogoutButton() {
  const handleLogout = async () => {
    tokenManager.clearToken();
    await signOut({ callbackUrl: "/" });
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      title="Sair"
      onClick={handleLogout}
    >
      <LogOut className="h-4 w-4" />
    </Button>
  );
}
