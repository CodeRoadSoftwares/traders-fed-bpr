import { connectDb } from "@/lib/db/db";
import { generateCertificateNumber } from "@/lib/certificate/genCertificate";
import { generateTokens } from "@/lib/jwt/jwt";
import { User, Shop } from "@/lib/db/models";
import { IUser, userValidation } from "@/validation/user/user.validation";
import { IShop, shopSchema } from "@/validation/shop/shop.validation";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

export async function POST(req: Request) {
  try {
    await connectDb();
    const data = await req.json();

    const parsedUser: IUser = userValidation.parse(data);
    const parsedShop: IShop = shopSchema.parse(data);

    const { email, password, phone, name, fatherName, aadharNumber, address } =
      parsedUser;
    const {
      shopName,
      registrationNumber,
      licenseNumber,
      category,
      primaryPhoto,
      photos,
    } = parsedShop;

    const existingUser = await User.findOne({
      $or: [{ email }, { phone }, { aadharNumber }],
    });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 409 },
      );
    }

    const existingShop = await Shop.findOne({
      $or: [{ registrationNumber }, { licenseNumber }],
    });
    if (existingShop) {
      return NextResponse.json(
        {
          message:
            "Shop with this registration or license number already exists",
        },
        { status: 409 },
      );
    }

    const hashedPassword = await hash(password, 10);

    const newUser = await User.create({
      name,
      fatherName,
      aadharNumber,
      email,
      phone,
      address,
      password: hashedPassword,
      role: "SHOP",
    });

    await Shop.create({
      userId: new Types.ObjectId(newUser._id),
      shopName,
      registrationNumber,
      licenseNumber,
      category,
      primaryPhoto,
      photos: photos?.length ? photos : [primaryPhoto],
      certificateNumber: generateCertificateNumber(),
      certificateStatus: "PENDING",
    });

    const res = NextResponse.json(
      { message: "Registration successful. Awaiting admin approval." },
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
