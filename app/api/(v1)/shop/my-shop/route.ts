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
    }).populate("userId", "-password");
    if (!shop) {
      return NextResponse.json({ message: "shop not found" }, { status: 404 });
    }
    return NextResponse.json(shop, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
