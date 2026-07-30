import z from "zod";

/**
 * User creation form schema, used on both ends: client (`zodResolver`) and
 * server action (`safeParse`). Browser validation is UX, not security, so
 * the server revalidates with the same schema.
 */
const createUserSchema = z.object({
  userName: z.string().trim().min(1, "Nome de usuário obrigatório"),
  email: z.email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

/**
 * Update form schema. Password stays required on purpose: `PUT
 * /api/users/{id}` re-hashes whatever it receives, so an empty field would
 * store the hash of an empty string and lock the user out. Until the API
 * accepts partial updates, editing a user means resetting their password.
 */
const updateUserSchema = createUserSchema;

/**
 * Table filter form schema. Two rules: every field is `optional()`, and each
 * key matches the `id`/`accessorKey` of its column in `columns.tsx` — that
 * naming match is what lets `resolveFilters` turn the form object into
 * `ColumnFiltersState` with no manual mapping.
 *
 * Date fields use `z.date()` because the picker works with `Date | undefined`.
 */
const userFilterFormSchema = z.object({
  userName: z.string().optional(),
  email: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

type CreateUserSchema = z.infer<typeof createUserSchema>;
type UpdateUserSchema = z.infer<typeof updateUserSchema>;
type UserFilterFormSchema = z.infer<typeof userFilterFormSchema>;

export {
  createUserSchema,
  updateUserSchema,
  userFilterFormSchema,
  type CreateUserSchema,
  type UpdateUserSchema,
  type UserFilterFormSchema,
};
