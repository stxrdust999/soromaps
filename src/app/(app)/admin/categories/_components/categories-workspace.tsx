"use client";

import { PlusIcon } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import { PageSection } from "@/components/blocks/page-section";
import { SiteFooter } from "@/components/blocks/site-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { CategoryMock } from "@/mocks/admin-categories";
import type { CategoryFormSchema } from "@/validations/categories";

import { CategoriesTable } from "./categories-table";
import { CategoryFormDialog } from "./category-form-dialog";
import { DeleteCategoryDialog } from "./delete-category-dialog";
import { MapPreviewStrip } from "./map-preview-strip";
import type { CategoryRowActions } from "./row-action";
import { useCategories } from "./use-categories";

/**
 * Tela de categorias inteira. É client porque o catálogo vive em memória —
 * não existe tabela `Categoria` nem `CategoriesController`, então cada
 * operação mexe no array de `src/mocks/admin-categories.ts`.
 *
 * Quando a API existir, a listagem volta a ser Server Component com
 * `src/http/categories`, as mutações viram Server Actions e os diálogos migram
 * para rotas do slot `(app)/@modals`, como em `/admin/users`.
 */
export function CategoriesWorkspace() {
  const { categories, stats, save, duplicate, toggleActive, move, remove } =
    useCategories();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryMock | null>(null);
  const [deleting, setDeleting] = useState<CategoryMock | null>(null);

  const openCreate = useCallback(() => {
    setEditing(null);
    setFormOpen(true);
  }, []);

  const actions = useMemo<CategoryRowActions>(
    () => ({
      onEdit: (category) => {
        setEditing(category);
        setFormOpen(true);
      },
      onDuplicate: (id) => {
        duplicate(id);
        toast.success("Categoria duplicada", {
          description: "A cópia nasce inativa — ajuste cor e ícone antes.",
        });
      },
      onToggleActive: (id) => {
        toggleActive(id);
        toast.success("Status atualizado");
      },
      onMove: move,
      onDelete: setDeleting,
    }),
    [duplicate, toggleActive, move],
  );

  function handleSubmit(values: CategoryFormSchema) {
    save(values, editing?.id ?? null);
    setFormOpen(false);
    toast.success(editing ? "Categoria salva" : "Categoria criada");
  }

  function handleDelete(targetId?: string) {
    if (!deleting) return;

    const destination = categories.find((c) => c.id === targetId);
    remove(deleting.id, targetId);
    setDeleting(null);

    toast.success(`Categoria excluída: ${deleting.nome}`, {
      description: destination
        ? `${deleting.pontos.toLocaleString("pt-BR")} pontos foram para ${destination.nome}.`
        : undefined,
    });
  }

  return (
    <main className="flex flex-1 flex-col">
      <PageSection
        title="Categorias"
        description="Catálogo que define ícone, cor e ordem dos pins no mapa"
        className="gap-6"
        actions={
          <Button onClick={openCreate}>
            <PlusIcon />
            Nova categoria
          </Button>
        }
        subitems={
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge>{stats.total} categorias</Badge>
            <Badge>{stats.ativas} ativas</Badge>
            <Badge>{stats.vazias} sem nenhum ponto</Badge>
            <Badge>
              {stats.pontos.toLocaleString("pt-BR")} pontos categorizados
            </Badge>
          </div>
        }
      >
        {categories.length === 0 ? (
          <div className="flex flex-col items-center gap-1.5 rounded-xl border px-6 py-22 text-center">
            <p className="font-heading font-semibold">
              Nenhuma categoria cadastrada
            </p>
            <p className="text-muted-foreground mb-2 text-sm">
              Sem categoria, todo ponto novo entra sem pin próprio no mapa.
            </p>

            <Button onClick={openCreate}>
              <PlusIcon />
              Nova categoria
            </Button>
          </div>
        ) : (
          <>
            <MapPreviewStrip categories={categories} />
            <CategoriesTable categories={categories} actions={actions} />
          </>
        )}
      </PageSection>

      <SiteFooter />

      <CategoryFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        category={editing}
        categories={categories}
        onSubmit={handleSubmit}
      />

      {deleting && (
        <DeleteCategoryDialog
          open
          onOpenChange={(open) => !open && setDeleting(null)}
          category={deleting}
          categories={categories}
          onConfirm={handleDelete}
          onDeactivate={() => {
            toggleActive(deleting.id);
            setDeleting(null);
            toast.success(`Categoria desativada: ${deleting.nome}`);
          }}
        />
      )}
    </main>
  );
}
