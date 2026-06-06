"use server";

import { type LoginSchema, loginSchema } from "@/validations/auth";
import { createSession } from "@/lib/session";
import { cookies } from "next/headers";
import { type CreateUserSchema, createUserSchema } from "@/validations/users";

/**
 * Realiza o login do usuário criando um cookie de sessão direto no servidor
 * @param data Dados do usuário (usuário e senha)
 * @returns Um objeto com sucesso ou erro
 */
export async function loginAction(data: LoginSchema) {
  const validation = loginSchema.safeParse(data);
  if (!validation.success) return { error: "Formulário inválido." };

  try {
    const API_URL = process.env.API_URL || "http://localhost:5068";

    const response = await fetch(`${API_URL}/api/auth/Login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validation.data),
    });

    if (!response.ok) {
      const errorMsg = await response.text();
      return { error: errorMsg || "Credenciais inválidas." };
    }

    const user = await response.json();

    const token = await createSession({ id: user.id, userName: user.userName });

    const cookieStore = await cookies();
    cookieStore.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 dias
    });

    return { success: true };
  } catch (error) {
    console.error("Action Error during login:", error);
    return { error: "Erro de conexão com o servidor de autenticação." };
  }
}

/**
 * Realiza o cadastro do usuário criando um cookie de sessão direto no servidor e loga o usuario em seguida
 * @param data Dados do usuário (usuário e senha)
 * @returns Um objeto com sucesso ou erro
 */
export async function registerAction(data: CreateUserSchema) {
  const validation = createUserSchema.safeParse(data);
  if (!validation.success) return { error: "Formulário inválido." };

  try {
    const API_URL = process.env.API_URL || "http://localhost:5068";

    const response = await fetch(`${API_URL}/api/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validation.data),
    });

    if (!response.ok) {
      const errorMsg = await response.text();
      return { error: errorMsg || "Erro ao registrar." };
    }

    const user = await response.json();

    const token = await createSession({ id: user.id, userName: user.userName });

    const cookieStore = await cookies();
    cookieStore.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 dias
    });

    return { success: true };
  } catch (error) {
    console.error("Action Error during register:", error);
    return { error: "Erro de conexão com o servidor de autenticação." };
  }
}

/**
 * Encerra a sessão do usuário deletando o cookie de sessão
 */
export async function logoutAction() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("session");
  } catch (error) {
    console.error("Logout Error:", error);
  }
}
