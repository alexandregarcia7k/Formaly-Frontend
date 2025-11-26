"use client";

import { useState } from "react";
import {
  Calendar as CalendarIcon,
  Save,
  Trash2,
  CheckCircle2,
  Power,
  PowerOff,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FormSettingsProps {
  expiresAt: Date | null;
  setExpiresAt: (date: Date | null) => void;
  maxResponses: number | null;
  setMaxResponses: (value: number | null) => void;
  allowMultipleSubmissions: boolean;
  setAllowMultipleSubmissions: (value: boolean) => void;
  isActive: boolean;
  setIsActive: (value: boolean) => void;
}

export function FormSettings({
  expiresAt,
  setExpiresAt,
  maxResponses,
  setMaxResponses,
  allowMultipleSubmissions,
  setAllowMultipleSubmissions,
  isActive,
  setIsActive,
}: FormSettingsProps) {
  const [tempMaxResponses, setTempMaxResponses] = useState(maxResponses ?? "");

  const handleSaveMaxResponses = () => {
    setMaxResponses(
      tempMaxResponses ? parseInt(String(tempMaxResponses)) : null
    );
  };

  const handleClearMaxResponses = () => {
    setTempMaxResponses("");
    setMaxResponses(null);
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Status do Formulário */}
        <div className="space-y-3 p-6 border border-border rounded-xl bg-card shadow-sm">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Status do Formulário
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Ative ou desative o formulário para controlar se ele pode receber
              novas respostas
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isActive ? (
                <Power className="h-5 w-5 text-primary" />
              ) : (
                <PowerOff className="h-5 w-5 text-muted-foreground" />
              )}
              <label
                htmlFor="formStatus"
                className="text-sm font-medium cursor-pointer text-foreground"
              >
                {isActive ? "Formulário ativo" : "Formulário desativado"}
              </label>
            </div>

            <button
              type="button"
              role="switch"
              id="formStatus"
              aria-checked={isActive}
              onClick={() => setIsActive(!isActive)}
              className={cn(
                "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isActive ? "bg-primary" : "bg-input"
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
                  isActive ? "translate-x-5" : "translate-x-0"
                )}
              />
            </button>
          </div>

          {!isActive && (
            <div className="bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg border border-amber-200 dark:border-amber-900/50">
              <p className="text-xs text-amber-800 dark:text-amber-200">
                ⚠️ Formulário desativado. Não será possível receber novas
                respostas até reativá-lo.
              </p>
            </div>
          )}

          {isActive && (
            <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg border border-green-200 dark:border-green-900/50">
              <p className="text-xs text-green-800 dark:text-green-200">
                ✓ Formulário ativo e pronto para receber respostas.
              </p>
            </div>
          )}
        </div>

        {/* Data de Expiração */}
        <div className="space-y-3 p-6 border border-border rounded-xl bg-card shadow-sm">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Data de Expiração
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Define quando o formulário deixará de aceitar respostas
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "flex-1 justify-start text-left font-normal",
                    !expiresAt && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {expiresAt ? (
                    expiresAt.toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })
                  ) : (
                    <span>Selecione uma data</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={expiresAt || undefined}
                  onSelect={(date) => setExpiresAt(date || null)}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Button
              size="icon"
              variant="default"
              onClick={() => {
                // Salvar lógica aqui
              }}
              className="shrink-0"
            >
              <Save className="h-4 w-4" />
            </Button>

            {expiresAt && (
              <Button
                size="icon"
                variant="destructive"
                onClick={() => setExpiresAt(null)}
                className="shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Limite de Respostas */}
        <div className="space-y-3 p-6 border border-border rounded-xl bg-card shadow-sm">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Limite de Respostas
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Define o número máximo de respostas permitidas
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="number"
              min="1"
              placeholder="Ex: 100"
              className="flex h-10 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={tempMaxResponses}
              onChange={(e) => setTempMaxResponses(e.target.value)}
            />

            <Button
              size="icon"
              variant="default"
              onClick={handleSaveMaxResponses}
              className="shrink-0"
            >
              <Save className="h-4 w-4" />
            </Button>

            {maxResponses && (
              <Button
                size="icon"
                variant="destructive"
                onClick={handleClearMaxResponses}
                className="shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>

          {maxResponses && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              Limite configurado: {maxResponses} respostas
            </div>
          )}
        </div>

        {/* Respostas Múltiplas */}
        <div className="space-y-3 p-6 border border-border rounded-xl bg-card shadow-sm">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Respostas Múltiplas
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Permitir que a mesma pessoa responda múltiplas vezes
            </p>
          </div>

          <div className="flex items-center justify-between">
            <label
              htmlFor="allowMultiple"
              className="text-sm font-medium cursor-pointer text-foreground"
            >
              Permitir múltiplas respostas do mesmo usuário
            </label>

            <button
              type="button"
              role="switch"
              aria-checked={allowMultipleSubmissions}
              onClick={() =>
                setAllowMultipleSubmissions(!allowMultipleSubmissions)
              }
              className={cn(
                "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                allowMultipleSubmissions ? "bg-primary" : "bg-input"
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
                  allowMultipleSubmissions ? "translate-x-5" : "translate-x-0"
                )}
              />
            </button>
          </div>

          {!allowMultipleSubmissions && (
            <div className="bg-muted/50 p-3 rounded-lg border border-border/50">
              <p className="text-xs text-muted-foreground">
                ℹ️ O sistema usará fingerprinting (SHA256) para identificar
                duplicatas
              </p>
            </div>
          )}
        </div>


      </div>
    </div>
  );
}
