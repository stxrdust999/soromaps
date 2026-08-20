"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CopyIcon,
  Loader2Icon,
  SparklesIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { generateStoryDraftAction } from "@/actions/stories";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { responseToast } from "@/lib/toaster";
import { cn } from "@/lib/utils";
import { markerCatalogMock } from "@/mocks/markers";
import type { StoryDraftSchema } from "@/validations/stories";
import {
  type GenerateStorySchema,
  generateStorySchema,
  MAX_PLACES,
} from "@/validations/stories";

/**
 * Gerador de rascunho de pauta.
 *
 * A tela **não publica nada**: ela devolve texto para alguém ler, corrigir e
 * decidir. Por isso o resultado aparece aqui dentro com aviso e botão de
 * copiar, em vez de virar uma pauta na vitrine — o dia em que existir tabela
 * de pauta, este mesmo fluxo grava com `status: "rascunho"`.
 *
 * A lista de lugares é fechada de propósito: o modelo escreve **sobre o que a
 * redação escolheu**, com os fatos que o mapa tem. Ver `src/actions/stories.ts`.
 */
export function StoryGeneratorDialog() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<StoryDraftSchema | null>(null);
  const [modelo, setModelo] = useState<string | null>(null);

  const form = useForm<GenerateStorySchema>({
    resolver: zodResolver(generateStorySchema),
    defaultValues: { tema: "", localIds: [] },
  });

  const { isSubmitting } = form.formState;
  const selected = form.watch("localIds");

  async function onSubmitForm(data: GenerateStorySchema) {
    const formData = new FormData();
    formData.set("tema", data.tema);
    for (const id of data.localIds) formData.append("localIds", String(id));

    const state = await generateStoryDraftAction(formData);

    if (!state.success || !state.draft) {
      responseToast.error({
        title: "Não deu para gerar o rascunho",
        description: state.message,
      });
      return;
    }

    setDraft(state.draft);
    setModelo(state.modelo ?? null);
  }

  function toggle(id: number) {
    const current = form.getValues("localIds");

    if (current.includes(id)) {
      form.setValue(
        "localIds",
        current.filter((item) => item !== id),
        { shouldValidate: true },
      );
      return;
    }

    if (current.length >= MAX_PLACES) return;

    form.setValue("localIds", [...current, id], { shouldValidate: true });
  }

  async function copyDraft() {
    if (!draft) return;

    await navigator.clipboard.writeText(
      [draft.chapeu, draft.titulo, draft.chamada, ...draft.corpo].join("\n\n"),
    );

    responseToast.success({ title: "Rascunho copiado" });
  }

  function reset() {
    setDraft(null);
    setModelo(null);
    form.reset();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">
          <SparklesIcon />
          Gerar pauta
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Gerar rascunho de pauta</DialogTitle>
          <DialogDescription>
            O modelo escreve a partir dos dados que o mapa tem sobre os lugares
            escolhidos. O texto sai como rascunho — publicar continua sendo
            decisão de gente.
          </DialogDescription>
        </DialogHeader>

        {draft ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-2 rounded-lg bg-warning/10 p-3 text-warning text-xs">
              <TriangleAlertIcon className="mt-0.5 size-4 shrink-0" />
              <span>
                Rascunho não revisado{modelo ? `, escrito por ${modelo}` : ""}.
                Confira estrutura, horário e qualquer afirmação sobre o
                estabelecimento antes de publicar.
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <Badge variant="outline" className="w-fit">
                {draft.chapeu}
              </Badge>

              <h3 className="text-balance font-semibold text-xl leading-tight">
                {draft.titulo}
              </h3>

              <p className="text-muted-foreground text-sm">{draft.chamada}</p>

              {draft.corpo.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 32)}
                  className="text-pretty text-sm leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={reset}>
                Gerar outro
              </Button>

              <Button onClick={copyDraft}>
                <CopyIcon />
                Copiar texto
              </Button>
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmitForm)}
              className="flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="tema"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tema</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={2}
                        placeholder="Ex.: onde trabalhar fora de casa sem gastar o dia inteiro"
                      />
                    </FormControl>
                    <FormDescription>
                      Uma linha. O recorte é seu; os fatos são do mapa.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="localIds"
                render={() => (
                  <FormItem>
                    <FormLabel>
                      Lugares ({selected.length} de {MAX_PLACES})
                    </FormLabel>

                    <div className="grid max-h-56 gap-1 overflow-y-auto rounded-lg border border-border p-2 sm:grid-cols-2">
                      {markerCatalogMock.map((place) => {
                        const checked = selected.includes(place.id);
                        const blocked =
                          !checked && selected.length >= MAX_PLACES;

                        return (
                          <label
                            key={place.id}
                            htmlFor={`local-${place.id}`}
                            className={cn(
                              "flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted",
                              blocked && "cursor-not-allowed opacity-40",
                            )}
                          >
                            <Checkbox
                              id={`local-${place.id}`}
                              checked={checked}
                              disabled={blocked}
                              onCheckedChange={() => toggle(place.id)}
                            />

                            <span className="flex min-w-0 flex-col">
                              <span className="truncate">{place.nome}</span>
                              <span className="truncate text-muted-foreground text-xs">
                                {place.categoria} · {place.bairro}
                              </span>
                            </span>
                          </label>
                        );
                      })}
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2Icon className="animate-spin" />
                  ) : (
                    <SparklesIcon />
                  )}
                  Gerar rascunho
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
