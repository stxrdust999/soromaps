import { z } from "zod";

export const reviewFormSchema = z.object({
  userId: z.string(),
  username: z.string(),
  content: z.string().min(1, "Escreva uma avaliação"),
  rating: z.number().min(1, "Avalie o local").max(5),
});
