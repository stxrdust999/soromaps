import { userShowTag } from "@/constants/users";
import { getUser } from "@/http/users/users";

import { UserFormModal } from "../../_components/user-form-modal";

interface UpdateUserModalPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Intercepted route of the update modal. Fires the user fetch without
 * `await` so the modal frame renders immediately while the form suspends.
 * Uses the same `show-user-<id>` tag `updateUserAction` invalidates.
 */
export default async function UpdateUserModalPage({
  params,
}: UpdateUserModalPageProps) {
  const { id } = await params;
  const userId = Number(id);

  const userPromise = getUser(userId, {
    next: { tags: [userShowTag(userId)] },
  });

  const promises = { userPromise };

  return <UserFormModal promises={promises} isUpdating userId={userId} />;
}
