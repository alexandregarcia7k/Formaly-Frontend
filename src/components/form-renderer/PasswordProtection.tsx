"use client";

import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IconBadge } from "@/components/ui/icon-badge";
import { CenteredCard } from "@/components/ui/centered-card";
import { Lock } from "lucide-react";

interface PasswordProtectionProps {
  onPasswordSubmit: (password: string) => void;
  maxLength?: number;
}

export function PasswordProtection({
  onPasswordSubmit,
  maxLength = 8,
}: PasswordProtectionProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const passwordSchema = z.string().min(4, "Senha deve ter no mínimo 4 caracteres").max(maxLength, `Senha deve ter no máximo ${maxLength} caracteres`);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = passwordSchema.safeParse(password);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    try {
      await onPasswordSubmit(password);
      setPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Senha incorreta");
      toast.error("Senha incorreta");
    }
  };

  return (
    <CenteredCard maxWidth="md">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <IconBadge icon={Lock} variant="primary" size="md" />
          </div>
          <CardTitle>Formulário Protegido</CardTitle>
          <CardDescription>
            Este formulário requer uma senha para acesso
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite a senha"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                required
                maxLength={maxLength}
                className={error ? "border-red-500" : ""}
              />
              {error && <p className="text-xs text-red-600">{error}</p>}
            </div>
            <Button type="submit" className="w-full">
              Acessar Formulário
            </Button>
          </form>
        </CardContent>
      </Card>
    </CenteredCard>
  );
}
