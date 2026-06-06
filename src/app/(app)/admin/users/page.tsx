import { Suspense } from "react";
import { getUsers } from "@/actions/users/get-users";
import { Button } from "@/components/ui/button";
import { SaveIcon, TrashIcon, UserPlusIcon } from "lucide-react";
import { UsersTableSkeleton } from "@/components/skeletons/users-table-skeleton";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { UsersTable } from "./table";
import PageTitle from "@/components/blocks/page-section";

export default function ManageUsersPage() {
  const usersPromise = getUsers();

  const testeDialog = (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"destructive"} className="flex flex-row gap-3">
          <span>Excluir usuário</span>
          <UserPlusIcon size={4} />
        </Button>
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="py-6 px-0 border border-black/20"
      >
        <div className="flex flex-col gap-4">
          {/* titulo e sub */}
          <div className="flex flex-col gap-1  px-6">
            <DialogTitle className="font-semibold text-lg">
              Excluir usuário
            </DialogTitle>
          </div>

          <Separator className="bg-black/20" />

          {/* conteudo */}
          <div className="flex flex-col gap-4 px-6">
            <div className="flex flex-col gap-0.5">
              <span>Tem certeza que deseja excluir esse usuário?</span>
              <span>
                Esta ação é <span className="font-semibold">irreversível</span>!
              </span>
            </div>
            {/* input com label */}
            <div className="flex flex-col gap-1">
              <Input className="shadow-none" placeholder="Ex.: Usuário 1" />
            </div>
          </div>

          <Separator className="bg-black/20" />

          <div className="flex flex-row justify-end gap-3 w-full  px-6">
            <Button variant={"secondary"} className="flex flex-row gap-2">
              <span>Cancelar</span>
            </Button>
            <Button className="flex flex-row gap-2.5 bg-red-500 items-center hover:bg-red-600">
              <span>Excluir</span>
              <TrashIcon size={4} />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div>
      <PageTitle
        title="Gerenciar Usuários"
        description="Gerencie os usuários do sistema"
        actions={testeDialog}
      />
      <div className="p-8">
        <Suspense fallback={<UsersTableSkeleton />}>
          <UsersTable usersPromise={usersPromise} />
        </Suspense>
      </div>
    </div>
  );
}
