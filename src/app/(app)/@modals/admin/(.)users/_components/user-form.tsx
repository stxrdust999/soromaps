"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon, SaveIcon } from "lucide-react";
import { use, useMemo } from "react";
import { useForm } from "react-hook-form";

import { createUserAction, updateUserAction } from "@/actions/users";
import { PasswordInput } from "@/components/blocks/password-input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { getUserResponse } from "@/http/users/users";
import { responseToast } from "@/lib/toaster";
import { type CreateUserSchema, createUserSchema } from "@/validations/users";

interface UserFormProps {
  promises: {
    userPromise: Promise<getUserResponse>;
  };

  /** `true` = update; `false`/absent = create. */
  isUpdating?: boolean;
  userId?: number;

  onSuccess: () => void;
  onCancel: () => void;
}

/**
 * Form shared by create and update flows — the difference is small (which
 * action to call, which initial values) so one component avoids the two
 * copies drifting apart. Suspends via `use()`; the modal wrapper's
 * `<Suspense>` shows the fallback.
 *
 * @param props Data promise, create/update mode, and success/cancel callbacks.
 */
export function UserForm({
  promises,
  isUpdating = false,
  userId,
  onSuccess,
  onCancel,
}: UserFormProps) {
  const userResponse = use(promises.userPromise);

  const defaultValues = useMemo<CreateUserSchema>(() => {
    const user = userResponse.status === 200 ? userResponse.data : undefined;

    return {
      userName: user?.userName ?? "",
      email: user?.email ?? "",
      password: "",
    };
  }, [userResponse]);

  const form = useForm<CreateUserSchema>({
    resolver: zodResolver(createUserSchema),
    defaultValues,
  });

  const { isSubmitting } = form.formState;

  /**
   * Picks create or update action by their shared `(data, id?)` signature.
   *
   * @param data Validated form values.
   */
  async function onSubmitForm(data: CreateUserSchema) {
    const formData = new FormData();
    formData.set("userName", data.userName);
    formData.set("email", data.email);
    formData.set("password", data.password);

    const state = isUpdating
      ? await updateUserAction(formData, userId)
      : await createUserAction(formData);

    if (!state.success) {
      responseToast.error({
        title: isUpdating ? "Erro ao editar usuário" : "Erro ao criar usuário",
        description: state.message,
      });
      return;
    }

    responseToast.success({
      title: state.message,
      description: `O usuário ${data.userName} foi salvo.`,
    });

    form.reset();
    onSuccess();
  }

  return (
    <Form {...form}>
      <form
        id="form:submit"
        onSubmit={form.handleSubmit(onSubmitForm)}
        className="space-y-4"
      >
        {/* userName - field */}
        <FormField
          control={form.control}
          name="userName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Digite um nome..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* email - field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="Digite um e-mail..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* password - field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <PasswordInput {...field} placeholder="Digite uma senha..." />
              </FormControl>

              {isUpdating && (
                <FormDescription>
                  A senha será redefinida com o valor digitado aqui.
                </FormDescription>
              )}

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-row justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <SaveIcon className="size-4" />
            )}
            Salvar
          </Button>
        </div>
      </form>
    </Form>
  );
}
