import { connectDb } from "@/lib/db/db";
import { generateTokens } from "@/lib/jwt/jwt";
import User from "@/models/user.model";
import { ISignin, signinValidation } from "@/validation/user/user.validation";
import { compare } from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDb();
    const data = await req.json();
    const parsedData: ISignin = signinValidation.parse(data);
    const { email, password } = parsedData;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return NextResponse.json({ message: "User not found" }, { status: 401 });
    }
    const verify = await compare(password, existingUser.password);
    if (!verify) {
      return NextResponse.json(
        { message: "Invalid Password" },
        { status: 400 },
      );
    }

    const res = NextResponse.json(
      { message: "logged in  successfully" },
      { status: 201 },
    );
    const { accessToken, refreshToken } = generateTokens(
      existingUser._id.toString(),
      existingUser.role,
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
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
