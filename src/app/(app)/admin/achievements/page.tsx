import { PageBreadcrumb } from "@/components/blocks/page-breadcrumb";

import { AchievementsWorkspace } from "./_components/achievements-workspace";

export default function AdminAchievementsPage() {
  return (
    <>
      <PageBreadcrumb items={[{ label: "Admin" }, { label: "Conquistas" }]} />

      <AchievementsWorkspace />
    </>
  );
}
