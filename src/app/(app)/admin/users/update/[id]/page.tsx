import { redirect } from "next/navigation";

/** Real mirror route of the update modal — see `create/page.tsx`. */
export default function UpdateUserPage() {
  redirect("/admin/users");
}
