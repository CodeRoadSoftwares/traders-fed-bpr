import { connectDb } from "@/lib/db/db";
import { Shop } from "@/lib/db/models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const certificateNumber = req.nextUrl.searchParams.get("cert");
    if (!certificateNumber) {
      return NextResponse.json(
        { message: "certificate number required" },
        { status: 400 },
      );
    }
    const shop = await Shop.findOne({ certificateNumber })
      .populate("userId", "name phone address")
      .lean();
    if (!shop) {
      return NextResponse.json(
        { message: "certificate not found", valid: false },
        { status: 404 },
      );
    }
    const isValid =
      shop.certificateStatus === "ACTIVE" &&
      shop.certificateExpiryDate &&
      new Date(shop.certificateExpiryDate) > new Date();

    const userData = shop.userId as unknown as {
      name: string;
      phone: number;
      address: unknown;
    };
    return NextResponse.json({
      valid: isValid,
      shop: {
        name: userData.name,
        category: shop.category,
        certificateNumber: shop.certificateNumber,
        issuedAt: shop.certificateIssuedAt,
        expiryDate: shop.certificateExpiryDate,
        status: shop.certificateStatus,
      },
    });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
