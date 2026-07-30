import { Suspense } from "react";

import { userShowTag } from "@/constants/users";
import { getUser } from "@/http/users/users";

import { DeleteUserModal } from "../../_components/delete-user-modal";

interface DeleteUserModalPageProps {
  params: Promise<{ id: string }>;
}

/**
 * Intercepted route of the delete confirmation modal. Fetches the user only
 * to name them in the confirmation copy.
 */
export default async function DeleteUserModalPage({
  params,
}: DeleteUserModalPageProps) {
  const { id } = await params;
  const userId = Number(id);

  const userPromise = getUser(userId, {
    next: { tags: [userShowTag(userId)] },
  });

  const promises = { userPromise };

  return (
    <Suspense fallback={null}>
      <DeleteUserModal promises={promises} userId={userId} />
    </Suspense>
  );
}
