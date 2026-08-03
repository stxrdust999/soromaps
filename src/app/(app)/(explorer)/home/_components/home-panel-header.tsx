import Link from "next/link";

import { MapDrawerViewToggle } from "@/components/blocks/map-drawer-layout";
import { Button } from "@/components/ui/button";
import { DrawerTitle } from "@/components/ui/drawer";

export function HomePanelHeader() {
  return (
    <header className="sticky top-0 z-10 flex flex-col gap-4 bg-popover px-8 pt-2 pb-4">
      <div className="flex items-center justify-between">
        <DrawerTitle className="text-2xl font-bold tracking-tight">
          Explorar Sorocaba
        </DrawerTitle>

        <MapDrawerViewToggle />
      </div>

      <Button asChild className="w-full">
        <Link href="/places/new">+ Adicionar Novo Local</Link>
      </Button>
    </header>
  );
}
