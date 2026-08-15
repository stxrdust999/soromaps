import { PageBreadcrumb } from "@/components/blocks/page-breadcrumb";

import { BusinessesWorkspace } from "./_components/businesses-workspace";

export default function AdminBusinessesPage() {
  return (
    <>
      <PageBreadcrumb items={[{ label: "Admin" }, { label: "Comércios" }]} />

      <BusinessesWorkspace />
    </>
  );
}
