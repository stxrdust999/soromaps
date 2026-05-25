import type User from "@/types/user";

const API_URL = process.env.API_URL;

export async function getUsers(): Promise<User[]> {
  try {
    const usersResponse = await fetch(`${API_URL}/api/users`);

    if (!usersResponse.ok) {
      throw new Error("Falha ao buscar usuários.");
    }

    const data = await usersResponse.json();

    return data;
  } catch (error) {
    console.error(error);
    throw new Error("Falha ao buscar usuários.");
  }
}
