"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon, SaveIcon } from "lucide-react";
import { useForm } from "react-hook-form";

import { updateMarkerAction } from "@/actions/markers";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { responseToast } from "@/lib/toaster";
import type { MarkerResource } from "@/types/marker";
import {
  type UpdateMarkerSchema,
  updateMarkerSchema,
} from "@/validations/markers";

interface MarkerEditFormProps {
  marker: MarkerResource;
}

/**
 * Edição dos campos que a API persiste. Só o nome é editável: `PUT
 * /api/markers/{id}` sobrescreve as três colunas de uma vez, e a coordenada
 * se muda arrastando o pin, não digitando.
 */
export function MarkerEditForm({ marker }: MarkerEditFormProps) {
  const form = useForm<UpdateMarkerSchema>({
    resolver: zodResolver(updateMarkerSchema),
    defaultValues: { nome: marker.nome, lat: marker.lat, lng: marker.lng },
  });

  const { isSubmitting, isDirty } = form.formState;

  async function onSubmitForm(data: UpdateMarkerSchema) {
    const formData = new FormData();
    formData.set("nome", data.nome);
    formData.set("lat", String(data.lat));
    formData.set("lng", String(data.lng));

    const state = await updateMarkerAction(formData, marker.id);

    if (!state.success) {
      responseToast.error({
        title: "Erro ao editar local",
        description: state.message,
      });
      return;
    }

    responseToast.success({
      title: state.message,
      description: `${data.nome} foi atualizado.`,
    });

    form.reset(data);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitForm)}
        className="flex flex-col gap-4 sm:flex-row sm:items-end"
      >
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Nome do local</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Como chamam esse lugar?" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting || !isDirty}>
          {isSubmitting ? (
            <Loader2Icon className="size-4 animate-spin" />
          ) : (
            <SaveIcon className="size-4" />
          )}
          Salvar
        </Button>
      </form>
    </Form>
  );
}
