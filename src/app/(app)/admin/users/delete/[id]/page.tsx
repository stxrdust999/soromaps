import { redirect } from "next/navigation";

/** Real mirror route of the delete modal — see `create/page.tsx`. */
export default function DeleteUserPage() {
  redirect("/admin/users");
}
