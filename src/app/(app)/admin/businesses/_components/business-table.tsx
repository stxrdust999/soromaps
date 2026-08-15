"use client";

import type {
  ColumnDef,
  SortingState,
  Table as TableInstance,
} from "@tanstack/react-table";
import type { ReactNode } from "react";

import { ColumnVisibilityFilter } from "@/components/table/column-visibility-filter";
import { FilterChipsScrollArea } from "@/components/table/filter-chips-scroll-area";
import { FilterResetButton } from "@/components/table/filter-reset-button";
import { RowCommon } from "@/components/table/row-common";
import { TableEmptyState } from "@/components/table/table-empty-state";
import { TableFooter } from "@/components/table/table-footer";
import { TableHeaderTemplate } from "@/components/table/table-header-template";
import { Table, TableBody, TableHeader } from "@/components/ui/table";
import { useTableConfig } from "@/hooks/table/use-table-config";
import { hasActiveFilters } from "@/utils/table/has-active-filters";

interface BusinessTableProps<TData> {
  data: TData[];

  /** ⚠️ Precisa chegar memoizado — TanStack compara colunas por referência. */
  columns: ColumnDef<TData>[];

  defaultSorting: SortingState;
  emptyMessage: string;

  /** Chips da toolbar; recebe a instância para ligar cada um à sua coluna. */
  chips: (table: TableInstance<TData>) => ReactNode;

  /** Texto à esquerda do rodapé, no lugar do contador de seleção. */
  footerNote?: string;
  hiddenSelectedRows?: boolean;
}

/**
 * Casca de tabela das três abas de `/admin/businesses`.
 *
 * As abas mostram entidades diferentes — pedido, vínculo concedido e ponto sem
 * dono — mas a moldura é a mesma: chips ligados a filtro de coluna, tabela e
 * rodapé de paginação. Genérica em vez de três cópias porque o que muda é só
 * `columns`, e comportamento novo precisa entrar num lugar só.
 */
export function BusinessTable<TData>({
  data,
  columns,
  defaultSorting,
  emptyMessage,
  chips,
  footerNote,
  hiddenSelectedRows,
}: BusinessTableProps<TData>) {
  const config = useTableConfig({
    data,
    columns,
    defaultSorting,
    getRowId: (row, index) => (row as { id?: string }).id ?? String(index),
  });

  const activeFilters = hasActiveFilters({ table: config.table });

  return (
    <section className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <FilterChipsScrollArea>{chips(config.table)}</FilterChipsScrollArea>

        {activeFilters && (
          <FilterResetButton
            action={() => {
              config.table.resetColumnFilters();
              config.table.resetSorting();
            }}
          />
        )}

        <ColumnVisibilityFilter table={config.table} />
      </div>

      <div className="bg-background">
        <Table>
          <TableHeader>
            <TableHeaderTemplate header={config.header} />
          </TableHeader>

          <TableBody>
            {config.rows.length ? (
              config.rows.map((row) => <RowCommon key={row.id} row={row} />)
            ) : (
              <TableEmptyState columns={columns} message={emptyMessage} />
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-2">
        {footerNote && (
          <p className="text-muted-foreground text-xs">{footerNote}</p>
        )}

        <TableFooter
          table={config.table}
          hiddenSelectedRows={hiddenSelectedRows}
        />
      </div>
    </section>
  );
}
