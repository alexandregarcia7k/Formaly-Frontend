"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  MoreVertical,
  Eye,
  Edit,
  Copy,
  Trash2,
  Power,
  PowerOff,
  Loader2,
  AlertCircle,
  Link2,
  Check,
  FileQuestion,
} from "lucide-react";
import { toast } from "sonner";
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
import { EmptyState } from "@/components/ui/empty-state";
import { FormPreview } from "@/components/form-builder/FormPreview";
import { FormsService, type FormResponse } from "@/lib/services/forms.service";
import { formatDate, formatDateTime } from "@/lib/utils";

export default function FormsPage() {
  const router = useRouter();
  const [forms, setForms] = useState<FormResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [previewFormId, setPreviewFormId] = useState<string | null>(null);
  const [previewForm, setPreviewForm] = useState<FormResponse | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [deleteFormId, setDeleteFormId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Carregar formulários da API
  useEffect(() => {
    loadForms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const loadForms = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await FormsService.listForms(currentPage);
      setForms(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (error) {
      const errorMessage = "Não foi possível carregar os formulários. Tente novamente.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenPreview = async (formId: string) => {
    setPreviewFormId(formId);
    setIsLoadingPreview(true);
    try {
      const form = await FormsService.getForm(formId);
      setPreviewForm(form);
    } catch (error) {
      toast.error("Erro ao carregar preview do formulário");
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handleClosePreview = () => {
    setPreviewFormId(null);
    setPreviewForm(null);
  };

  const toggleFormStatus = async (formId: string) => {
    const form = forms.find((f) => f.id === formId);
    if (!form) return;

    const newStatus = form.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    try {
      await FormsService.updateForm(formId, {
        status: newStatus,
      });

      // Atualizar estado local
      setForms((prevForms) =>
        prevForms.map((f) =>
          f.id === formId ? { ...f, status: newStatus } : f
        )
      );

      toast.success(`Formulário ${newStatus === "ACTIVE" ? "ativado" : "desativado"} com sucesso`);
    } catch (error) {
      toast.error("Erro ao alterar status do formulário");
    }
  };

  const handleCloneForm = async (formId: string) => {
    try {
      await FormsService.cloneForm(formId);

      // Recarregar lista
      await loadForms();

      toast.success("Formulário duplicado com sucesso");
    } catch (error) {
      toast.error("Erro ao duplicar formulário");
    }
  };

  const handleDeleteForm = async () => {
    if (!deleteFormId) return;

    setIsDeleting(true);

    try {
      await FormsService.deleteForm(deleteFormId);

      // Remover da lista local
      setForms((prevForms) => prevForms.filter((f) => f.id !== deleteFormId));

      toast.success("Formulário deletado com sucesso");
    } catch (error) {
      toast.error("Erro ao deletar formulário");
    } finally {
      setIsDeleting(false);
      setDeleteFormId(null);
    }
  };

  const handleCopyLink = (formId: string) => {
    const link = `${window.location.origin}/f/${formId}`;
    navigator.clipboard.writeText(link);
    setCopiedSlug(formId);
    setTimeout(() => setCopiedSlug(null), 2000);
    toast.success("Link copiado para área de transferência");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Formulários</h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Gerencie e acompanhe seus formulários
          </p>
        </div>
        <Button onClick={() => router.push("/dashboard/forms/new")} className="w-full sm:w-auto">
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
          {isLoading ? (
            <EmptyState
              icon={Loader2}
              title="Carregando formulários..."
              variant="default"
              className="border-0"
            />
          ) : error ? (
            <EmptyState
              icon={AlertCircle}
              title="Erro ao carregar formulários"
              description={error}
              variant="default"
              action={
                <Button onClick={loadForms} variant="outline">
                  Tentar Novamente
                </Button>
              }
              className="border-0"
            />
          ) : forms.length === 0 ? (
            <EmptyState
              icon={FileQuestion}
              title="Nenhum formulário encontrado"
              description="Comece criando seu primeiro formulário"
              variant="dashed"
              action={
                <Button onClick={() => router.push("/dashboard/forms/new")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Primeiro Formulário
                </Button>
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Formulário</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Link</TableHead>
                  <TableHead>Respostas</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead>Atualizado em</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {forms.map((form) => (
                  <TableRow
                    key={form.id}
                    className="hover:bg-muted/50"
                  >
                    <TableCell
                      className="cursor-pointer"
                      onClick={() => router.push(`/dashboard/forms/${form.id}/edit`)}
                    >
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{form.name}</span>
                        </div>
                        {form.description && (
                          <span className="text-xs text-muted-foreground">
                            {form.description}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={form.status === "ACTIVE"}
                          onCheckedChange={() => toggleFormStatus(form.id)}
                          className="data-[state=checked]:bg-primary"
                        />
                        <div className="flex items-center gap-2">
                          {form.status === "ACTIVE" ? (
                            <Power className="h-4 w-4 text-primary" />
                          ) : (
                            <PowerOff className="h-4 w-4 text-muted-foreground" />
                          )}
                          <Badge
                            variant={
                              form.status === "ACTIVE" ? "default" : "secondary"
                            }
                            className={
                              form.status === "ACTIVE"
                                ? "bg-primary hover:bg-green-600"
                                : ""
                            }
                          >
                            {form.status === "ACTIVE" ? "Ativo" : "Inativo"}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-2"
                        onClick={() => handleCopyLink(form.id)}
                      >
                        {copiedSlug === form.id ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-green-500" />
                            <span className="text-xs">Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Link2 className="h-3.5 w-3.5" />
                            <span className="text-xs">/f/{form.id}</span>
                          </>
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">
                        {form._count.submissions}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(new Date(form.createdAt))}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {formatDateTime(new Date(form.updatedAt))}
                      </span>
                    </TableCell>
                    <TableCell
                      className="text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
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
                            onClick={() => handleOpenPreview(form.id)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleCloneForm(form.id)}
                          >
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeleteFormId(form.id)}
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
          )}

          {/* Paginação */}
          {!isLoading && !error && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <span className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                Próxima
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Preview */}
      <Dialog
        open={!!previewFormId}
        onOpenChange={(open) => !open && handleClosePreview()}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Preview do Formulário</DialogTitle>
          </DialogHeader>
          {isLoadingPreview ? (
            <EmptyState
              icon={Loader2}
              title="Carregando preview..."
              variant="default"
              className="border-0"
            />
          ) : previewForm ? (
            <FormPreview
              formName={previewForm.name}
              formDescription={previewForm.description || ""}
              fields={FormsService.mapFieldsToFrontend(previewForm.fields)}
              hasPassword={false}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog
        open={!!deleteFormId}
        onOpenChange={(open: boolean) => !open && setDeleteFormId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Tem certeza que deseja deletar este formulário? Esta ação não pode
            ser desfeita.
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteFormId(null)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteForm}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deletando...
                </>
              ) : (
                "Deletar"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
