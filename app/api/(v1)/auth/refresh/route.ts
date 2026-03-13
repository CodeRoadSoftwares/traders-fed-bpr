import { generateTokens, JwtToken, verifyRefresh } from "@/lib/jwt/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("refreshToken")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "refresh token missing" },
        { status: 403 },
      );
    }
    const verifyToken = verifyRefresh(token) as JwtToken;
    const { accessToken, refreshToken } = generateTokens(
      verifyToken.id,
      verifyToken.role,
    );
    const res = NextResponse.json(
      { message: "refreshed token" },
      { status: 200 },
    );
    res.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 15,
    });

    res.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 15,
    });
    return res;
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to refresh" },
      { status: 500 },
    );
  }
}
