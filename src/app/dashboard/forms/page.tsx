"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  MoreVertical,
  Eye,
  Edit,
  Copy,
  Trash2,
  Lock,
  Power,
  PowerOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { FormPreview } from "@/components/form-builder/FormPreview";
import { FormField } from "@/components/form-builder/FormFieldEditor";

const mockForms = [
  {
    id: "1",
    name: "Cadastro de Clientes",
    description: "Formulário para novos clientes",
    status: "ACTIVE",
    submissions: 342,
    views: 1250,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-03-20T14:30:00"),
    hasPassword: true,
    expiresAt: null,
    maxResponses: null,
    allowMultipleSubmissions: true,
    successMessage: "Obrigado por se cadastrar!",
    fields: [
      {
        id: "field-1",
        type: "text" as const,
        label: "Nome Completo",
        placeholder: "Digite seu nome",
        required: true,
      },
      {
        id: "field-2",
        type: "email" as const,
        label: "E-mail",
        placeholder: "seu@email.com",
        required: true,
      },
      {
        id: "field-3",
        type: "phone" as const,
        label: "Telefone",
        placeholder: "(00) 00000-0000",
        required: false,
      },
      {
        id: "field-4",
        type: "select" as const,
        label: "Como nos conheceu?",
        placeholder: "Selecione uma opção",
        required: true,
        options: ["Google", "Redes Sociais", "Indicação", "Outro"],
      },
    ] as FormField[],
  },
];

function formatDate(date: Date): string {
  return date.toLocaleDateString("pt-BR");
}

function formatDateTime(date: Date): string {
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function FormsPage() {
  const router = useRouter();
  const [previewFormId, setPreviewFormId] = useState<string | null>(null);
  const [forms, setForms] = useState(mockForms);

  const previewForm = forms.find((f) => f.id === previewFormId);

  const toggleFormStatus = (formId: string) => {
    setForms((prevForms) =>
      prevForms.map((form) =>
        form.id === formId
          ? {
              ...form,
              status: form.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
            }
          : form
      )
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Formulários</h1>
          <p className="text-muted-foreground">
            Gerencie e acompanhe seus formulários
          </p>
        </div>
        <Button onClick={() => router.push("/dashboard/forms/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Formulário
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Seus Formulários</CardTitle>
          <CardDescription>
            Lista completa de todos os formulários criados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Formulário</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Respostas</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Taxa</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead>Atualizado em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {forms.map((form) => (
                <TableRow key={form.id}>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{form.name}</span>
                        {form.hasPassword && (
                          <Lock className="h-3 w-3 text-muted-foreground" />
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {form.description}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={form.status === "ACTIVE"}
                        onCheckedChange={() => toggleFormStatus(form.id)}
                        className="data-[state=checked]:bg-green-500"
                      />
                      <div className="flex items-center gap-2">
                        {form.status === "ACTIVE" ? (
                          <Power className="h-4 w-4 text-green-500" />
                        ) : (
                          <PowerOff className="h-4 w-4 text-muted-foreground" />
                        )}
                        <Badge
                          variant={
                            form.status === "ACTIVE" ? "default" : "secondary"
                          }
                          className={
                            form.status === "ACTIVE"
                              ? "bg-green-500 hover:bg-green-600"
                              : ""
                          }
                        >
                          {form.status === "ACTIVE" ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{form.submissions}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-foreground">{form.views}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      {((form.submissions / form.views) * 100).toFixed(1)}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(form.createdAt)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {formatDateTime(form.updatedAt)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/dashboard/forms/${form.id}/edit`)
                          }
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setPreviewFormId(form.id)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => console.log("Clonar", form.id)}
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => console.log("Deletar", form.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Deletar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal de Preview */}
      <Dialog
        open={!!previewFormId}
        onOpenChange={(open) => !open && setPreviewFormId(null)}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Preview do Formulário</DialogTitle>
          </DialogHeader>
          {previewForm && (
            <FormPreview
              formName={previewForm.name}
              formDescription={previewForm.description}
              fields={previewForm.fields}
              hasPassword={previewForm.hasPassword}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
