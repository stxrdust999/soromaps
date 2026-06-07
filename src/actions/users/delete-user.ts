const API_URL = process.env.API_URL;

export async function deleteUser(id: number): Promise<void> {
  try {
    const userResponse = await fetch(`${API_URL}/api/users/${id}`, {
      method: "DELETE",
    });

    if (!userResponse.ok) {
      if (userResponse.status === 404) {
        throw new Error("Usuário não encontrado.");
      }
      throw new Error("Falha ao deletar usuário.");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Falha ao deletar usuário.");
  }
}
