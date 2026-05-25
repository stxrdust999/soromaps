import z from "zod";

/**
 * Validações de login
 */
export const loginSchema = z.object({
  userName: z.string().min(1, "Nome de usuário é obrigatório"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

/**
 * Validações de cadastro
 */
export const registerSchema = z
  .object({
    userName: z.string().min(3, "O usuário deve conter no mínimo 3 caracteres"),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
