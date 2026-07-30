"use client";

import type { Row } from "@tanstack/react-table";
import { EllipsisVerticalIcon, PencilIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { UserResource } from "@/types/user";

interface UserListRowActionProps {
  row: Row<UserResource>;
}

/**
 * Row actions (`actions` column). Each is a link into a route intercepted
 * by the `@modals` slot and rendered as a modal over the listing.
 *
 * @param props Row instance the actions target.
 */
export function UserListRowAction({ row }: UserListRowActionProps) {
  const id = row.original.id;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" variant="ghost" size="icon">
          <EllipsisVerticalIcon className="size-4" />
          <span className="sr-only">Abrir ações</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Opções</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link href={`/admin/users/update/${id}`}>
              <PencilIcon className="size-4" />
              Editar
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem variant="destructive" asChild>
            <Link href={`/admin/users/delete/${id}`}>
              <Trash2Icon className="size-4" />
              Excluir
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
