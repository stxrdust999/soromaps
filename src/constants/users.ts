import type { UserFilterFormSchema } from "@/validations/users";

/**
 * Default values of the user filter form. Lives outside the component so
 * `useForm({ defaultValues })` and the "clear filters" `form.reset()` share
 * one stable reference.
 *
 * Text fields use `""` (controlled inputs need a value from the first
 * render); date fields use `undefined`, what the date picker expects.
 */
export const userListFilterDefaultValues: UserFilterFormSchema = {
  userName: "",
  email: "",
  createdAt: undefined,
  updatedAt: undefined,
};

/**
 * Cache tags of this resource's reads — the same strings passed to
 * `next: { tags: [...] }` and to `updateTag()`. Centralized so a typo cannot
 * make the two sides diverge and silently leave the table stale.
 */
export const USERS_LIST_TAG = "list-users";

/**
 * Cache tag of a single user's read.
 *
 * @param id User id.
 * @returns Tag string for that user.
 */
export const userShowTag = (id: number) => `show-user-${id}`;

/** Modal close animation time before `router.back()`. */
export const MODAL_CLOSE_DELAY_MS = 150;
