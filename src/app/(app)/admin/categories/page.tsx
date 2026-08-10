import { PageBreadcrumb } from "@/components/blocks/page-breadcrumb";

import { CategoriesWorkspace } from "./_components/categories-workspace";

export default function AdminCategoriesPage() {
  return (
    <>
      <PageBreadcrumb items={[{ label: "Admin" }, { label: "Categorias" }]} />

      <CategoriesWorkspace />
    </>
  );
}
