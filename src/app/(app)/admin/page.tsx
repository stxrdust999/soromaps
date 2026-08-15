import { redirect } from "next/navigation";

// A sidebar não expõe mais /admin; a área administrativa começa no dashboard.
export default function Page() {
  redirect("/admin/dashboard");
}
