import { NextRequest, NextResponse } from "next/server";

const publicPaths = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/refresh",
  "/api/shop/search",
  "/api/shop/get",
  "/api/shop/categories",
  "/api/districts",
  "/api/certificate/verify",
  "/api/notice/get",
  "/api/fund/get",
  "/api/cron",
];

const adminPaths = [
  "/api/admin",
  "/api/certificate/approve",
  "/api/certificate/reject",
  "/api/certificate/renew",
  "/api/certificate/expiring",
  "/api/notice/create",
  "/api/notice/update",
  "/api/notice/delete",
  "/api/fund/create",
  "/api/fund/update",
  "/api/fund/delete",
  "/api/fund/report",
  "/api/stats",
  "/api/shop/delete",
];

const superAdminPaths = [
  "/api/admin/create",
  "/api/admin/delete",
  "/api/admin/update",
];

function decodeJWT(token: string): { id: string; role: string } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = JSON.parse(
      Buffer.from(parts[1], "base64url").toString("utf-8"),
    );
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return null;
    }

    return { id: payload.id, role: payload.role };
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  if (!accessToken && !refreshToken) {
    return NextResponse.json({ message: "unauthorized" }, { status: 401 });
  }

  if (accessToken) {
    const decoded = decodeJWT(accessToken);

    if (decoded) {
      if (superAdminPaths.some((path) => pathname.startsWith(path))) {
        if (decoded.role !== "SUPER_ADMIN") {
          return NextResponse.json({ message: "forbidden" }, { status: 403 });
        }
      }

      if (adminPaths.some((path) => pathname.startsWith(path))) {
        if (decoded.role !== "ADMIN" && decoded.role !== "SUPER_ADMIN") {
          return NextResponse.json({ message: "forbidden" }, { status: 403 });
        }
      }

      return NextResponse.next();
    }
  }

  if (refreshToken) {
    return NextResponse.json(
      { message: "token expired", code: "TOKEN_EXPIRED" },
      { status: 401 },
    );
  }

  return NextResponse.json({ message: "unauthorized" }, { status: 401 });
}

export const config = {
  matcher: ["/api/:path*"],
};
