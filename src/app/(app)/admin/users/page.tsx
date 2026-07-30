import { Suspense } from "react";

import { PageSection } from "@/components/blocks/page-section";
import { TableSkeletonState } from "@/components/table/table-skeleton-state";
import { USERS_LIST_TAG } from "@/constants/users";
import { getUsers } from "@/http/users/users";

import { UserPageAction } from "./_components/page-action";
import { UsersTable } from "./_components/table";

/**
 * Server Component — data orchestration only: fires promises without
 * `await` (so the header ships on first byte and the table streams in),
 * groups them into `promises`, and sets up the layout and `Suspense`.
 *
 * `next.tags` names this read's cache — the same string server actions
 * pass to `updateTag()` after writing.
 */
export default function ManageUsersPage() {
  const usersPromise = getUsers({ next: { tags: [USERS_LIST_TAG] } });

  const promises = { usersPromise };

  return (
    <main className="flex flex-1 flex-col">
      <PageSection
        title="Gerenciar Usuários"
        description="Visualize, pesquise e gerencie os usuários cadastrados na plataforma."
        actions={<UserPageAction />}
      >
        <Suspense fallback={<TableSkeletonState />}>
          <UsersTable promises={promises} />
        </Suspense>
      </PageSection>
    </main>
  );
}
