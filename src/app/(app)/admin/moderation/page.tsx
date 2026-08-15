import { PageBreadcrumb } from "@/components/blocks/page-breadcrumb";

import { ModerationWorkspace } from "./_components/moderation-workspace";

/**
 * Fila de moderação. `h-dvh` em vez de deixar a página crescer: o layout é
 * mestre-detalhe, e cada coluna rola por conta própria — sem altura fechada,
 * o `overflow-hidden` do `main` cortaria a lista em vez de rolá-la.
 */
export default function AdminModerationPage() {
  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <PageBreadcrumb items={[{ label: "Admin" }, { label: "Moderação" }]} />

      <ModerationWorkspace />
    </div>
  );
}
