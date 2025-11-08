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
    <div className="h-full overflow-y-auto p-6 bg-muted/20">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-primary" />
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
      </div>
    </div>
  );
}
