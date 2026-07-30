import type { getUserResponse } from "@/http/users/users";
import { createFallbackPromise } from "@/utils/http/create-fallback-promise";

import { UserFormModal } from "../_components/user-form-modal";

/**
 * Intercepted route of the create modal. No resource to load, so the
 * promise comes from `createFallbackPromise` to match the update flow's
 * prop shape.
 */
export default function CreateUserModalPage() {
  const userPromise = createFallbackPromise<getUserResponse>(undefined);

  const promises = { userPromise };

  return <UserFormModal promises={promises} />;
}
