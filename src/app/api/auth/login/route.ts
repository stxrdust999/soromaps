import { createSession } from "@/lib/session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * Realiza o login do usuário criando um cookie de sessão
 * @param request Requisição contendo o usuário e senha
 * @returns NextResponse com sucesso
 */
export async function POST(request: Request) {
  try {
    const { userName, password } = await request.json();
    const API_URL = process.env.API_URL || "http://localhost:5068";

    // Call ASP.NET C# Auth Login endpoint
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userName, password }),
    });

    if (!response.ok) {
      const errorMsg = await response.text();
      return NextResponse.json(
        { error: errorMsg || "Credenciais inválidas" },
        { status: response.status }
      );
    }

    // Since Option B is set, C# returns { id, userName }
    const user = await response.json();

    // Create signed JWT
    const token = await createSession({ id: user.id, userName: user.userName });

    // Set secure cookie
    const cookieStore = await cookies();
    cookieStore.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json({ error: "Erro interno de autenticação" }, { status: 500 });
  }
}
