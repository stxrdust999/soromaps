import { cookies } from "next/headers";

const encoder = new TextEncoder();

// Import process.env.SESSION_SECRET into a Cryptographic Key format
async function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "SESSION_SECRET must be defined in your environment variables",
    );
  }
  const keyData = encoder.encode(secret);
  return crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

// Helper to convert Uint8Array bytes to URL-safe Base64
function uint8ArrayToBase64Url(uint8Array: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < uint8Array.byteLength; i++) {
    binary += String.fromCharCode(uint8Array[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

// Helper to convert URL-safe Base64 to Uint8Array bytes
function base64UrlToUint8Array(base64Url: string): Uint8Array {
  const base64 = base64Url
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .padEnd(base64Url.length + ((4 - (base64Url.length % 4)) % 4), "=");
  const binary = atob(base64);
  const uint8Array = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    uint8Array[i] = binary.charCodeAt(i);
  }
  return uint8Array;
}

export interface SessionPayload {
  id: number;
  userName: string;
  userEmail: string;
  exp?: number;
}

/**
 * Signs and creates a valid Session JWT cookie string
 */
async function createSession(
  payload: Omit<SessionPayload, "exp">,
  durationInMs = 7 * 24 * 60 * 60 * 1000, // 7 Days default duration
): Promise<string> {
  const key = await getSecretKey();
  const header = { alg: "HS256", typ: "JWT" };
  const exp = Date.now() + durationInMs;
  const fullPayload: SessionPayload = { ...payload, exp };

  const headerB64 = uint8ArrayToBase64Url(
    encoder.encode(JSON.stringify(header)),
  );
  const payloadB64 = uint8ArrayToBase64Url(
    encoder.encode(JSON.stringify(fullPayload)),
  );

  const dataToSign = encoder.encode(`${headerB64}.${payloadB64}`);
  const signature = await crypto.subtle.sign("HMAC", key, dataToSign);
  const signatureB64 = uint8ArrayToBase64Url(new Uint8Array(signature));

  return `${headerB64}.${payloadB64}.${signatureB64}`;
}

/**
 * Decrypts, verifies, and returns valid payload. Returns null if invalid or expired.
 */
async function decryptSession(token: string): Promise<SessionPayload | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, signatureB64] = parts;
    const key = await getSecretKey();
    const dataToVerify = encoder.encode(`${headerB64}.${payloadB64}`);
    const signature = base64UrlToUint8Array(signatureB64);

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signature as BufferSource,
      dataToVerify as BufferSource,
    );
    if (!isValid) return null;

    const payloadStr = new TextDecoder().decode(
      base64UrlToUint8Array(payloadB64),
    );
    const payload: SessionPayload = JSON.parse(payloadStr);

    if (payload.exp && Date.now() > payload.exp) {
      return null; // Token has expired
    }

    return payload;
  } catch (error) {
    return null; // Invalid token format or parsing error
  }
}

async function getSession() {
  const cookieStore = await cookies();

  const token = cookieStore.get("session")?.value;

  if (!token) return null;

  return await decryptSession(token);
}

export { getSession, createSession, decryptSession };
