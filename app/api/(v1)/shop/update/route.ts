import { getUser } from "@/lib/auth/getUser";
import { connectDb } from "@/lib/db/db";
import { Shop } from "@/lib/db/models";
import { shopSchema } from "@/validation/shop/shop.validation";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    await connectDb();
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ message: "unauthorized" }, { status: 403 });
    }
    const data = await req.json();
    const { id, ...updateData } = data;
    const parsedData = shopSchema.parse(updateData);
    const shop = await Shop.findById(new Types.ObjectId(id));
    if (!shop) {
      return NextResponse.json({ message: "shop not found" }, { status: 404 });
    }
    if (shop.userId.toString() !== user.id && user.role === "SHOP") {
      return NextResponse.json({ message: "unauthorized" }, { status: 403 });
    }
    const updated = await Shop.findByIdAndUpdate(
      new Types.ObjectId(id),
      parsedData,
      { new: true },
    );
    return NextResponse.json(
      { message: "shop updated successfully", data: updated },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
