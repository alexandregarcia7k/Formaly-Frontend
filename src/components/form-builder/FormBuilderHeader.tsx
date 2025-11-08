"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Copy,
  Eye,
  EyeOff,
  Hammer,
  Monitor,
  BarChart3,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FormBuilderHeaderProps {
  formName: string;
  formDescription: string;
  formPassword: string;
  showPassword: boolean;
  formLink: string;
  activeTab: "builder" | "preview" | "responses";
  onFormNameChange: (value: string) => void;
  onFormDescriptionChange: (value: string) => void;
  onFormPasswordChange: (value: string) => void;
  onShowPasswordToggle: () => void;
  onClearPassword: () => void;
  onCopyLink: () => void;
  onTabChange: (tab: "builder" | "preview" | "responses") => void;
  onBack: () => void;
  onCancel: () => void;
  onSave: () => void;
  isLoading?: boolean;
}

export function FormBuilderHeader({
  formName,
  formDescription,
  formPassword,
  showPassword,
  formLink,
  activeTab,
  onFormNameChange,
  onFormDescriptionChange,
  onFormPasswordChange,
  onShowPasswordToggle,
  onClearPassword,
  onCopyLink,
  onTabChange,
  onBack,
  onCancel,
  onSave,
  isLoading = false,
}: FormBuilderHeaderProps) {
  return (
    <>
      {/* Header */}
      <div className="border-b bg-background px-6 py-4">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel} disabled={isLoading}>
              Cancelar
            </Button>
            <Button onClick={onSave} disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Nome do formulário */}
          <div className="space-y-2">
            <Label htmlFor="form-name" className="text-sm font-medium">
              Nome do Formulário *
            </Label>
            <Input
              id="form-name"
              placeholder="Ex: Cadastro de Clientes"
              value={formName}
              onChange={(e) => onFormNameChange(e.target.value)}
            />
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="form-description" className="text-sm font-medium">
              Descrição
            </Label>
            <Input
              id="form-description"
              placeholder="Descrição opcional"
              value={formDescription}
              onChange={(e) => onFormDescriptionChange(e.target.value)}
            />
          </div>

          {/* Link gerado */}
          <div className="space-y-2">
            <Label htmlFor="form-link" className="text-sm font-medium">
              Link Público
            </Label>
            <div className="flex gap-2">
              <Input
                id="form-link"
                value={formLink}
                readOnly
                placeholder="Salve o formulário para gerar o link"
                className="bg-muted/50 font-mono text-xs"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={onCopyLink}
                title="Copiar link"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Senha (opcional) */}
          <div className="space-y-2">
            <Label htmlFor="form-password" className="text-sm font-medium">
              Senha de Acesso
            </Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="form-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Máximo 8 caracteres"
                  value={formPassword}
                  onChange={(e) => onFormPasswordChange(e.target.value)}
                  maxLength={8}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onShowPasswordToggle}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                  title={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {formPassword.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={onClearPassword}
                  className="hover:bg-red-50 shrink-0"
                  title="Excluir senha"
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-500" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs flutuantes */}
      <div className="flex justify-center py-4 border-b">
        <div className="inline-flex items-center gap-1 p-1 bg-muted/50 rounded-lg">
          <button
            onClick={() => onTabChange("builder")}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
              activeTab === "builder"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Hammer className="h-4 w-4" />
            Construtor
          </button>
          <button
            onClick={() => onTabChange("preview")}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
              activeTab === "preview"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Monitor className="h-4 w-4" />
            Preview
          </button>
          <button
            onClick={() => onTabChange("responses")}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
              activeTab === "responses"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <BarChart3 className="h-4 w-4" />
            Respostas
          </button>
        </div>
      </div>
    </>
  );
}
