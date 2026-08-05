"use server";

import { updateTag } from "next/cache";

import { MARKERS_LIST_TAG, markerShowTag } from "@/constants/markers";
import { deleteMarker, postMarker, putMarker } from "@/http/markers/markers";
import type { FormState } from "@/types/form";
import { createMarkerSchema, updateMarkerSchema } from "@/validations/markers";

/**
 * Marker Server Actions — the screen's only write path, replacing the raw
 * client `fetch` + `alert()` the map used to run.
 *
 * Each one revalidates `FormData` with the form's own Zod schema, calls
 * `src/http`, then `updateTag()`s every affected tag.
 */

const INVALID_PAYLOAD_MESSAGE =
  "Algo de errado aconteceu, por favor tente novamente.";
const REQUEST_FAILED_MESSAGE =
  "Um erro ocorreu, por favor tente novamente em alguns minutos.";

/**
 * `FormData` só carrega string, e a coordenada é numérica — a conversão fica
 * aqui, na borda de transporte, para o schema continuar declarando `number`
 * e servir ao `zodResolver` do formulário sem cast.
 *
 * @param data Form data do formulário de local.
 * @returns Objeto com `lat`/`lng` numéricos, pronto para o `safeParse`.
 */
function toMarkerInput(data: FormData) {
  return {
    nome: data.get("nome"),
    lat: Number(data.get("lat")),
    lng: Number(data.get("lng")),
  };
}

/**
 * Creates a marker.
 *
 * Only `nome`, `lat` and `lng` are accepted — the creation form already
 * collects photo, category and amenities, but the API has no columns for
 * them yet, so they stop at the browser. See `docs/propostas/`.
 *
 * @param data Form data matching `createMarkerSchema`.
 * @returns Result with message and field errors, if any.
 */
async function createMarkerAction(data: FormData): Promise<FormState> {
  const result = createMarkerSchema.safeParse(toMarkerInput(data));

  if (!result.success) {
    return {
      success: false,
      message: INVALID_PAYLOAD_MESSAGE,
      errors: result.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const response = await postMarker(result.data);

    if (!response.ok) {
      throw new Error(`POST /api/markers respondeu ${response.status}`);
    }

    updateTag(MARKERS_LIST_TAG);
  } catch (error) {
    console.error("create marker failed:", error);

    return {
      success: false,
      message: REQUEST_FAILED_MESSAGE,
      errors: null,
    };
  }

  return {
    success: true,
    message: "Local criado com sucesso.",
    errors: null,
  };
}

/**
 * Updates a marker. Signature mirrors the create action plus the id, so one
 * form component can serve both modes.
 *
 * @param data Form data matching `updateMarkerSchema`.
 * @param id Marker id; rejected when not a number.
 * @returns Result with message and field errors, if any.
 */
async function updateMarkerAction(
  data: FormData,
  id?: number,
): Promise<FormState> {
  const result = updateMarkerSchema.safeParse(toMarkerInput(data));

  if (!result.success) {
    return {
      success: false,
      message: INVALID_PAYLOAD_MESSAGE,
      errors: result.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const markerId = Number(id);

    if (Number.isNaN(markerId)) {
      throw new Error("id de local inválido");
    }

    const response = await putMarker(markerId, result.data);

    if (!response.ok) {
      throw new Error(
        `PUT /api/markers/${markerId} respondeu ${response.status}`,
      );
    }

    updateTag(MARKERS_LIST_TAG);
    updateTag(markerShowTag(markerId));
  } catch (error) {
    console.error("update marker failed:", error);

    return {
      success: false,
      message: REQUEST_FAILED_MESSAGE,
      errors: null,
    };
  }

  return {
    success: true,
    message: "Local atualizado com sucesso.",
    errors: null,
  };
}

/**
 * Deletes a marker. No form involved — the popup fires it with the id alone.
 *
 * @param id Marker id.
 * @returns Result with message; `errors` is always `null`.
 */
async function deleteMarkerAction(id: number): Promise<FormState> {
  try {
    const response = await deleteMarker(id);

    if (!response.ok) {
      throw new Error(`DELETE /api/markers/${id} respondeu ${response.status}`);
    }

    updateTag(MARKERS_LIST_TAG);
    updateTag(markerShowTag(id));
  } catch (error) {
    console.error("delete marker failed:", error);

    return {
      success: false,
      message: REQUEST_FAILED_MESSAGE,
      errors: null,
    };
  }

  return {
    success: true,
    message: "Local excluído com sucesso.",
    errors: null,
  };
}

export { createMarkerAction, deleteMarkerAction, updateMarkerAction };
