"use client";

import { PlusIcon, SearchIcon, XIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PlacesHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export function PlacesHeader({ search, onSearchChange }: PlacesHeaderProps) {
  return (
    <header className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <h1 className="font-bold text-2xl tracking-tight">
            Explorar Sorocaba
          </h1>
          <p className="text-muted-foreground text-sm">
            O que você tá a fim de encontrar hoje?
          </p>
        </div>

        <Button asChild size="sm" className="shrink-0">
          <Link href="/places/new">
            <PlusIcon className="size-4" />
            Adicionar
          </Link>
        </Button>
      </div>

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
    </header>
  );
}
