import { Suspense } from "react";

import { PageSection } from "@/components/blocks/page-section";
import { SiteFooter } from "@/components/blocks/site-footer";
import { TableSkeletonState } from "@/components/table/table-skeleton-state";
import { USERS_LIST_TAG } from "@/constants/users";
import { getUsers } from "@/http/users/users";

import { UsersTable } from "./_components/table";
import { Badge } from "@/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar";
import { ShieldUser, ShieldUserIcon, StoreIcon, UsersIcon } from "lucide-react";

interface InformationBadgeProps {
  icon: React.ReactNode;
  value: string;
  label: string;
}

function InformationBadge({ icon, value, label }: InformationBadgeProps) {
  return (
    <Badge
      variant="default"
      className="px-3 py-4 items-center flex flex-row gap-2 bg-black"
    >
      {icon}

      <div className="flex flex-row gap-1 items-center">
        <span className="text-xs text-white font-semibold">{value}</span>
        <span className="text-xs text-white/75">{label}</span>
      </div>
    </Badge>
  );
}

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

  const subitem = (
    <div className="flex flex-row gap-2 items-center mt-1">
      <Badge
        variant="default"
        className="bg-black px-2 py-4 flex flex-row gap-2"
      >
        <AvatarGroup>
          <Avatar className="size-4">
            <AvatarImage
              src="https://github.com/maxleiter.png"
              alt="@maxleiter"
            />
            <AvatarFallback>LR</AvatarFallback>
          </Avatar>
          <Avatar className="size-4">
            <AvatarImage
              src="https://github.com/evilrabbit.png"
              alt="@evilrabbit"
            />
            <AvatarFallback>ER</AvatarFallback>
          </Avatar>
          <Avatar className="size-4">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </AvatarGroup>

        <span className="text-xs text-white">184 Usuários Cadastrados</span>
      </Badge>

      <InformationBadge
        icon={<UsersIcon size={16} className="text-white/75" />}
        value="144"
        label="exploradores"
      />

      <InformationBadge
        icon={<ShieldUserIcon size={16} className="text-white/75" />}
        value="5"
        label="administradores"
      />

      <InformationBadge
        icon={<StoreIcon size={14} className="text-white/75" />}
        value="35"
        label="comércios"
      />
    </div>
  );

  return (
    <main className="flex flex-1 flex-col">
      <PageSection
        title="Gerenciamento de Usuários"
        description="Gerencie os usuários cadastrados na plataforma."
        subitems={subitem}
      >
        <Suspense fallback={<TableSkeletonState columns={6} />}>
          <UsersTable promises={promises} />
        </Suspense>
      </PageSection>

      <SiteFooter />
    </main>
  );
}
