"use client";

import { SearchIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DiscoverSearchProps {
  search: string;
  onSearchChange: (value: string) => void;
}

/** Busca por nome do lugar, com botão de limpar quando há termo. */
export function DiscoverSearch({
  search,
  onSearchChange,
}: DiscoverSearchProps) {
  return (
    <div className="relative">
      <SearchIcon className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3 size-4 text-muted-foreground" />

      <Input
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Buscar por nome do lugar"
        className="pr-9 pl-9"
      />

      {search && (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={() => onSearchChange("")}
          className="-translate-y-1/2 absolute top-1/2 right-2"
        >
          <XIcon className="size-3" />
          <span className="sr-only">Limpar busca</span>
        </Button>
      )}
    </div>
  );
}
