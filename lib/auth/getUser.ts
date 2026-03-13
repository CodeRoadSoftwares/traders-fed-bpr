import { cookies } from "next/headers";
import { verifyAccess, JwtToken } from "@/lib/jwt/jwt";

export async function getUser(): Promise<JwtToken | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) return null;

    const decoded = verifyAccess(token) as JwtToken;

    return decoded;
  } catch {
    return null;
  }
}
