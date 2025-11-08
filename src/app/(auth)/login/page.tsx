"use client";

import { Logo } from "@/components/landing/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeSwitcher } from "@/components/theme-switcher-1";
import { SocialLoginButtons } from "@/components/auth/social-login-buttons";
import Link from "next/link";

export default function LoginPage() {
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
            <form action="" className="space-y-6">
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
                    name="email"
                    id="email"
                    placeholder="seu@email.com"
                    className="h-12 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-base font-medium">
                    Senha
                  </Label>
                  <Input
                    type="password"
                    required
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="h-12 text-base"
                  />
                </div>

                <Button className="h-12 w-full text-base font-semibold">
                  Entrar
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="register" className="mt-6">
            <form action="" className="space-y-6">
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
                    name="name"
                    id="register-name"
                    placeholder="Seu nome"
                    className="h-12 text-base"
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
                    name="email"
                    id="register-email"
                    placeholder="seu@email.com"
                    className="h-12 text-base"
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
                    name="password"
                    id="register-password"
                    placeholder="••••••••"
                    className="h-12 text-base"
                  />
                </div>

                <Button className="h-12 w-full text-base font-semibold">
                  Criar conta
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
