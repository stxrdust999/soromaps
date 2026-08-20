"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarRouteButtonProps {
  name: string;
  url: string;
  icon?: ReactNode;
}

/**
 * Item de navegação da sidebar. A rota atual fica com o mesmo visual do
 * hover (persistente); passar o mouse por cima dela clareia um pouco o
 * fundo em vez de repetir o mesmo tom.
 */
export function SidebarRouteButton({
  name,
  url,
  icon,
}: SidebarRouteButtonProps) {
  const pathname = usePathname();
  const active = pathname === url || pathname.startsWith(`${url}/`);

  return (
    <Link href={url} className="w-full">
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-2 text-sm h-9 px-2 rounded-sm transition-all duration-200",
          active
            ? "bg-foreground text-background hover:bg-foreground/90 hover:text-background"
            : "hover:bg-foreground hover:text-background",
        )}
      >
        {icon}
        <span className="font-medium">{name}</span>
      </Button>
    </Link>
  );
}
