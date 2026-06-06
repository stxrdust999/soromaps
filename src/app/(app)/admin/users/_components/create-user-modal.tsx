"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import UserForm from "./user-form";
import { UserPlusIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createUser } from "@/actions/users/create-user";
import type { CreateUserSchema } from "@/validations/users";
import { responseToast } from "@/lib/toaster";

export default function CreateUserModal() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleCreateUser = async (data: CreateUserSchema) => {
    startTransition(async () => {
      try {
        await createUser(data);
        setOpen(false);
        router.refresh();

        responseToast.success({
          title: "Usuário criado com sucesso!",
          description: `O usuário ${data.userName} foi adicionado ao sistema.`,
        });
      } catch (error) {
        responseToast.error({
          title: "Erro ao criar usuário",
          description: "Ocorreu um problema ao tentar salvar os dados.",
        });
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex flex-row gap-3">
          <span>Novo Usuário</span>
          <UserPlusIcon size={4} />
        </Button>
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="py-6 px-0 border border-black/20"
      >
        <UserForm onSubmit={handleCreateUser} />
      </DialogContent>
    </Dialog>
  );
}
