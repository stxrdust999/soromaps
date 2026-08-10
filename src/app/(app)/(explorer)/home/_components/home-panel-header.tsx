import { PlusIcon } from "lucide-react";
import Link from "next/link";

import { MapDrawerViewToggle } from "@/components/blocks/map-drawer-layout";
import { Button } from "@/components/ui/button";
import { DrawerTitle } from "@/components/ui/drawer";

export function HomePanelHeader() {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-2 bg-popover px-8 pt-2 pb-4">
      <DrawerTitle className="truncate font-bold text-2xl tracking-tight">
        Explorar Sorocaba
      </DrawerTitle>

      <div className="flex shrink-0 items-center gap-2">
        <Button asChild variant="default" size="sm">
          <Link href="/places/new">
            <PlusIcon className="size-4" />
            Adicionar local
          </Link>
        </Button>

        <MapDrawerViewToggle />
      </div>
    </header>
  );
}
