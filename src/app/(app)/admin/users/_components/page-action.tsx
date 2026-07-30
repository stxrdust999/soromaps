import { CircleFadingPlusIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

/** Page header's primary action — links to the intercepted create route. */
export function UserPageAction() {
  return (
    <Button type="button" asChild>
      <Link href="/admin/users/create">
        Novo usuário
        <CircleFadingPlusIcon className="size-4" />
      </Link>
    </Button>
  );
}
