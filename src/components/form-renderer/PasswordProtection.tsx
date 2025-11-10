"use client";

import { useState } from "react";
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPasswordSubmit(password);
    setPassword(""); // Limpa a senha após submissão
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
                onChange={(e) => setPassword(e.target.value)}
                required
                maxLength={maxLength}
              />
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
