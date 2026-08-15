import { PageBreadcrumb } from "@/components/blocks/page-breadcrumb";

import { ReviewsWorkspace } from "./_components/reviews-workspace";

export default function AdminReviewsPage() {
  return (
    <>
      <PageBreadcrumb items={[{ label: "Admin" }, { label: "Avaliações" }]} />

      <ReviewsWorkspace />
    </>
  );
}
