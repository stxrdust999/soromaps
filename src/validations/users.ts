import z from "zod";

const createUserSchema = z.object({
  userName: z.string().min(1, "Nome de usuário obrigatório"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

type CreateUserSchema = z.infer<typeof createUserSchema>;

export { createUserSchema, type CreateUserSchema };
