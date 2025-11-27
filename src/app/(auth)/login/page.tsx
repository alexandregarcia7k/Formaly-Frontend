"use client";

import { Logo } from "@/components/landing/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeSwitcher } from "@/components/shared/theme-switcher";
import { SocialLoginButtons } from "@/components/auth/social-login-buttons";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import { AuthService } from "@/lib/services/auth.service";
import { signIn } from "next-auth/react";
import { loginSchema, registerSchema } from "@/schemas";
import { tokenManager } from "@/lib/token-manager";
import type { AxiosError } from "axios";

interface BackendError {
  statusCode: number;
  message: string;
  error: string;
}

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  
  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // Register state
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = loginSchema.safeParse({
      email: loginEmail,
      password: loginPassword,
    });
    
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email: validation.data.email,
        password: validation.data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error === "CredentialsSignin" ? "Email ou senha inválidos" : result.error);
        return;
      }

      await tokenManager.getToken(true);
      toast.success("Login realizado com sucesso!");
      window.location.href = "/dashboard";
    } catch {
      toast.error("Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = registerSchema.safeParse({
      name: registerName,
      email: registerEmail,
      password: registerPassword,
      confirmPassword: registerConfirmPassword,
    });
    
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }
    
    setIsLoading(true);
    try {
      await AuthService.register({
        name: validation.data.name,
        email: validation.data.email,
        password: validation.data.password,
      });
      
      toast.success("Cadastro realizado com sucesso!");
      
      const result = await signIn("credentials", {
        email: validation.data.email,
        password: validation.data.password,
        redirect: false,
      });
      
      if (result?.error) {
        toast.error("Erro ao fazer login automático. Tente fazer login manualmente.");
        return;
      }

      await tokenManager.getToken(true);
      window.location.href = "/dashboard";
    } catch (error) {
      const axiosError = error as AxiosError<BackendError>;
      const message = axiosError.response?.data?.message || "Erro ao fazer cadastro";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <section className="flex min-h-screen items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" aria-label="Voltar para home" className="inline-block">
            <Logo />
          </Link>
          <h1 className="mt-8 text-3xl font-bold tracking-tight">
            Bem-vindo ao Formaly
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            Crie formulários incríveis de forma simples e rápida
          </p>
        </div>

        {/* Theme Toggle - Centralizado acima dos tabs */}
        <div className="mb-4 flex justify-center">
          <ThemeSwitcher />
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="register">Cadastrar</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-6">
            <form onSubmit={handleLogin} className="space-y-6">
              <SocialLoginButtons />

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-background px-4 text-muted-foreground">
                    Ou continue com email
                  </span>
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-base font-medium">
                    Email
                  </Label>
                  <Input
                    type="email"
                    required
                    id="email"
                    placeholder="seu@email.com"
                    className="h-12 text-base"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-base font-medium">
                    Senha
                  </Label>
                  <Input
                    type="password"
                    required
                    id="password"
                    placeholder="••••••••"
                    className="h-12 text-base"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <Button className="h-12 w-full text-base font-semibold" disabled={isLoading}>
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="register" className="mt-6">
            <form onSubmit={handleRegister} className="space-y-6">
              <SocialLoginButtons />

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-background px-4 text-muted-foreground">
                    Ou cadastre-se com email
                  </span>
                </div>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <Label
                    htmlFor="register-name"
                    className="text-base font-medium"
                  >
                    Nome completo
                  </Label>
                  <Input
                    type="text"
                    required
                    id="register-name"
                    placeholder="Seu nome"
                    className="h-12 text-base"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="register-email"
                    className="text-base font-medium"
                  >
                    Email
                  </Label>
                  <Input
                    type="email"
                    required
                    id="register-email"
                    placeholder="seu@email.com"
                    className="h-12 text-base"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="register-password"
                    className="text-base font-medium"
                  >
                    Senha
                  </Label>
                  <Input
                    type="password"
                    required
                    id="register-password"
                    placeholder="••••••••"
                    className="h-12 text-base"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="register-confirm-password"
                    className="text-base font-medium"
                  >
                    Confirmar senha
                  </Label>
                  <Input
                    type="password"
                    required
                    id="register-confirm-password"
                    placeholder="••••••••"
                    className="h-12 text-base"
                    value={registerConfirmPassword}
                    onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    required
                    id="terms"
                    className="mt-1 h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="terms" className="text-sm leading-relaxed">
                    Aceito os{" "}
                    <Link href="/terms" className="text-primary hover:underline">
                      termos de uso
                    </Link>{" "}
                    e{" "}
                    <Link href="/privacy" className="text-primary hover:underline">
                      política de privacidade
                    </Link>
                  </Label>
                </div>

                <Button className="h-12 w-full text-base font-semibold" disabled={isLoading}>
                  {isLoading ? "Criando conta..." : "Criar conta"}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Já tem uma conta?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      const loginTab = document.querySelector('[value="login"]') as HTMLElement;
                      loginTab?.click();
                    }}
                    className="text-primary hover:underline font-medium"
                  >
                    Entrar
                  </button>
                </p>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
