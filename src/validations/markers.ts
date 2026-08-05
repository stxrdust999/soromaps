import z from "zod";

/**
 * Marker creation schema, used on both ends: client (`zodResolver`) and
 * server action (`safeParse`). Browser validation is UX, not security, so
 * the server revalidates with the same schema.
 *
 * Matches what `POST /api/markers` actually accepts — the fields the product
 * still owes (foto, categoria, amenidades) live in the prototype schema of
 * the creation form, not here. See `docs/propostas/`.
 */
const createMarkerSchema = z.object({
  nome: z.string().trim().min(1, "Nome do local obrigatório"),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

/**
 * Update schema. Same shape because `PUT /api/markers/{id}` overwrites the
 * three columns on every call — there is no partial update, so the caller
 * always sends the coordinate back even when only the name changed.
 */
const updateMarkerSchema = createMarkerSchema;

type CreateMarkerSchema = z.infer<typeof createMarkerSchema>;
type UpdateMarkerSchema = z.infer<typeof updateMarkerSchema>;

export {
  createMarkerSchema,
  updateMarkerSchema,
  type CreateMarkerSchema,
  type UpdateMarkerSchema,
};
