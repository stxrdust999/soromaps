import { redirect } from "next/navigation";

// A sidebar não expõe mais /business; a área do estabelecimento começa no dashboard.
export default function Page() {
  redirect("/business/dashboard");
}
