import { getUser } from "@/lib/auth/getUser";
import { generateCertificateNumber } from "@/lib/certificate/genCertificate";
import { connectDb } from "@/lib/db/db";
import Shop from "@/models/shop.model";
import { IShop, shopSchema } from "@/validation/shop/shop.validation";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const data = await req.json();
    const user = await getUser();
    const { registrationNumber, licenseNumber, category }: IShop =
      shopSchema.parse(data);
    const shop = await Shop.create({
      registrationNumber,
      licenseNumber,
      category,
      userId: new Types.ObjectId(user?.id),
      certificateNumber: generateCertificateNumber(),
      certificateStatus: "PENDING",
    });
    if (!shop) {
      return NextResponse.json(
        { message: "failed to create shop" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { message: "shop created successfully" },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
