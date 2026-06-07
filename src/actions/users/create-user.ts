import type User from "@/types/user";
import { type CreateUserSchema, createUserSchema } from "@/validations/users";

const API_URL = process.env.API_URL;

export async function createUser(data: CreateUserSchema): Promise<User> {
  const result = createUserSchema.safeParse(data);

  if (!result.success) {
    throw new Error(result.error.message);
  }

  try {
    const userResponse = await fetch(`${API_URL}/api/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result.data),
    });

    if (!userResponse.ok) {
      throw new Error("Falha ao criar usuário.");
    }

    const data = await userResponse.json();

    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Falha ao criar usuário.");
  }
}
