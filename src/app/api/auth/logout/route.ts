import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * Encerra a sessão do usuário deletando o cookie de sessão
 * @returns NextResponse com sucesso
 */
export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  return NextResponse.json({ success: true });
}
