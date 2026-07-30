import { redirect } from "next/navigation";

/**
 * Real mirror route of the create modal — direct URL access or F5 renders
 * this instead of the intercepted `@modals` route, so it just redirects
 * back to the listing.
 */
export default function CreateUserPage() {
  redirect("/admin/users");
}
