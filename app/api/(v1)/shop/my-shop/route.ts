import { getUser } from "@/lib/auth/getUser";
import { connectDb } from "@/lib/db/db";
import { Shop } from "@/lib/db/models";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ message: "unauthorized" }, { status: 403 });
    }
    const shop = await Shop.findOne({
      userId: new Types.ObjectId(user.id),
    })
      .populate("userId", "name email phone address fatherName")
      .lean();

    if (!shop) {
      return NextResponse.json({ message: "shop not found" }, { status: 404 });
    }

    // Transform userId to user for frontend compatibility
    const shopData = {
      ...shop,
      user: shop.userId,
      userId: shop.userId._id,
    };

    return NextResponse.json(shopData, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
