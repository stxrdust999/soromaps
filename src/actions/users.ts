"use server";

import { updateTag } from "next/cache";

import { USERS_LIST_TAG, userShowTag } from "@/constants/users";
import { deleteUser, postUser, putUser } from "@/http/users/users";
import type { FormState } from "@/types/form";
import { createUserSchema, updateUserSchema } from "@/validations/users";

/**
 * User Server Actions — the screen's only write path.
 *
 * Each one revalidates `FormData` with the form's own Zod schema, calls
 * `src/http`, then `updateTag()`s every affected tag. `updateTag` (not
 * `revalidateTag`) is what gives read-your-own-writes inside an action, so
 * the table arrives fresh when the modal closes, with no `router.refresh()`.
 *
 * The success `return` sits outside the `try` on purpose: `redirect()` works
 * by throwing in Next, and a broad `catch` would swallow that control flow.
 */

const INVALID_PAYLOAD_MESSAGE =
  "Algo de errado aconteceu, por favor tente novamente.";
const REQUEST_FAILED_MESSAGE =
  "Um erro ocorreu, por favor tente novamente em alguns minutos.";

/**
 * Creates a user.
 *
 * @param data Form data matching `createUserSchema`.
 * @returns Result with message and field errors, if any.
 */
async function createUserAction(data: FormData): Promise<FormState> {
  const result = createUserSchema.safeParse(Object.fromEntries(data));

  if (!result.success) {
    return {
      success: false,
      message: INVALID_PAYLOAD_MESSAGE,
      errors: result.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const response = await postUser(result.data);

    if (!response.ok) {
      throw new Error(`POST /api/users respondeu ${response.status}`);
    }

    updateTag(USERS_LIST_TAG);
  } catch (error) {
    console.error("create user failed:", error);

    return {
      success: false,
      message: REQUEST_FAILED_MESSAGE,
      errors: null,
    };
  }

  return {
    success: true,
    message: "Usuário criado com sucesso.",
    errors: null,
  };
}

/**
 * Updates a user. Signature mirrors the create action plus the id, so the
 * form can pick one of the two and serve both modes with one component.
 *
 * @param data Form data matching `updateUserSchema`.
 * @param id User id; rejected when not a number.
 * @returns Result with message and field errors, if any.
 */
async function updateUserAction(
  data: FormData,
  id?: number,
): Promise<FormState> {
  const result = updateUserSchema.safeParse(Object.fromEntries(data));

  if (!result.success) {
    return {
      success: false,
      message: INVALID_PAYLOAD_MESSAGE,
      errors: result.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const userId = Number(id);

    if (Number.isNaN(userId)) {
      throw new Error("id de usuário inválido");
    }

    const response = await putUser(userId, result.data);

    if (!response.ok) {
      throw new Error(`PUT /api/users/${userId} respondeu ${response.status}`);
    }

    updateTag(USERS_LIST_TAG);
    updateTag(userShowTag(userId));
  } catch (error) {
    console.error("update user failed:", error);

    return {
      success: false,
      message: REQUEST_FAILED_MESSAGE,
      errors: null,
    };
  }

  return {
    success: true,
    message: "Usuário atualizado com sucesso.",
    errors: null,
  };
}

/**
 * Deletes a user. No form involved — the confirmation modal fires it with
 * the id alone.
 *
 * @param id User id.
 * @returns Result with message; `errors` is always `null`.
 */
async function deleteUserAction(id: number): Promise<FormState> {
  try {
    const response = await deleteUser(id);

    if (!response.ok) {
      throw new Error(`DELETE /api/users/${id} respondeu ${response.status}`);
    }

    updateTag(USERS_LIST_TAG);
    updateTag(userShowTag(id));
  } catch (error) {
    console.error("delete user failed:", error);

    return {
      success: false,
      message: REQUEST_FAILED_MESSAGE,
      errors: null,
    };
  }

  return {
    success: true,
    message: "Usuário excluído com sucesso.",
    errors: null,
  };
}

export { createUserAction, deleteUserAction, updateUserAction };
