import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json(
    { message: "logged out successfuly" },
    { status: 200 },
  );
  res.cookies.delete("accessToken");
  res.cookies.delete("refreshToken");
  return res;
}
