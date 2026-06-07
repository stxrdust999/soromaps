import type User from "@/types/user";

const API_URL = process.env.API_URL;

export async function getUser(id: number): Promise<User> {
  try {
    const userResponse = await fetch(`${API_URL}/api/users/${id}`);

    if (!userResponse.ok) {
      if (userResponse.status === 404) {
        throw new Error("Usuário não encontrado.");
      }
      throw new Error("Falha ao buscar usuário.");
    }

    const data = await userResponse.json();

    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Falha ao buscar usuário.");
  }
}
