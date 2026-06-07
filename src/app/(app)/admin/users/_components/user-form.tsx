"use client";

import { PasswordInput } from "@/components/blocks/password-input";
import { Button } from "@/components/ui/button";
import { DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { CreateUserSchema } from "@/validations/users";
import { SaveIcon } from "lucide-react";
import { useState } from "react";

interface UserFormProps {
  user?: {
    userName: string;
    email: string;
    userPassword: string;
  };
  isEditing?: boolean;
  onSubmit: (data: CreateUserSchema) => void;
}

/**
 * User form fields used to create or edit an user's info.
 * @param user User data to edit. If not provided, form will be in create mode.
 * @param onSubmit Callback function to handle form submission.
 * @param isEditing Boolean to determine if form is in edit mode.
 */
export default function UserForm({
  user,
  onSubmit,
  isEditing = false,
}: UserFormProps) {
  const [username, setUsername] = useState(user?.userName || "");
  const [email, setEmail] = useState(user?.email || "");

  const [userPassword, setUserPassword] = useState("");

  const title = isEditing ? "Editar usuário" : "Criar usuário";
  const description = isEditing
    ? "Edite os campos abaixo para editar o usuário."
    : "Preencha os campos abaixo para criar um novo usuário.";

  const handleSave = () => {
    onSubmit({
      userName: username,
      email: email,
      password: userPassword,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* titulo e sub */}
      <div className="flex flex-col gap-1  px-6">
        <DialogTitle className="font-semibold text-lg">{title}</DialogTitle>
        <span className="font-light text-sm text-muted-foreground">
          {description}
        </span>
      </div>

      <Separator className="bg-black/20" />

      {/* conteudo */}
      <div className="flex flex-col gap-4  px-6">
        {/* input com label */}
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-md">Nome</span>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="shadow-none"
            placeholder="Digite um nome..."
          />
        </div>

        {/* input com label */}
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-md">Email</span>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow-none"
            placeholder="Digite um email..."
            type="email"
          />
        </div>

        {/* input com label */}
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-md">Senha</span>
          <PasswordInput
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
            className="shadow-none"
            placeholder="Digite uma senha..."
            type="password"
          />
        </div>
      </div>

      <Separator className="bg-black/20" />

      <div className="flex flex-row justify-end gap-3 w-full  px-6">
        <Button variant={"secondary"} className="flex flex-row gap-2">
          <span>Cancelar</span>
        </Button>
        <Button className="flex flex-row gap-2.5" onClick={handleSave}>
          <span>Salvar</span>
          <SaveIcon size={4} />
        </Button>
      </div>
    </div>
  );
}
