import { connectDb } from "@/lib/db/db";
import { generateTokens } from "@/lib/jwt/jwt";
import { User } from "@/lib/db/models";
import { IUser, userValidation } from "@/validation/user/user.validation";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDb();
    const data = await req.json();
    const parsedData: IUser = userValidation.parse(data);
    const { email, password, phone, name, address } = parsedData;
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 404 },
      );
    }
    const hashedPassword = await hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      role: "SHOP",
    });
    if (!newUser) {
      return NextResponse.json(
        { message: "Failed to create user" },
        { status: 404 },
      );
    }

    const res = NextResponse.json(
      { message: "User created successfully" },
      { status: 201 },
    );
    const { accessToken, refreshToken } = generateTokens(
      newUser._id.toString(),
      newUser.role,
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
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Invalid registration data. Please check all fields." },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { message: "Registration failed" },
      { status: 500 },
    );
  }
}
