import { PageBreadcrumb } from "@/components/blocks/page-breadcrumb";

import { ReportsWorkspace } from "./_components/reports-workspace";

/**
 * Caixa de entrada do admin. `h-dvh` pela mesma razão de `/admin/moderation`:
 * a aba de denúncias é mestre-detalhe e cada coluna rola por conta própria —
 * sem altura fechada, o `overflow-hidden` do `main` cortaria a fila.
 */
export default function AdminReportsPage() {
  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <PageBreadcrumb
        items={[{ label: "Admin" }, { label: "Denúncias e Feedback" }]}
      />

      <ReportsWorkspace />
    </div>
  );
}
