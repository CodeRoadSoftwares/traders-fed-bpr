import { getUser } from "@/lib/auth/getUser";
import { connectDb } from "@/lib/db/db";
import Shop from "@/models/shop.model";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDb();
    const user = await getUser();
    const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
    if (!isAdmin) {
      return NextResponse.json({ message: "unauthorized" }, { status: 403 });
    }
    const { id } = await req.json();
    const shop = await Shop.findById(new Types.ObjectId(id));
    if (!shop) {
      return NextResponse.json({ message: "shop not found" }, { status: 404 });
    }
    const issuedAt = new Date();
    const expiryDate = new Date(
      new Date().getFullYear() + 1,
      2,
      31,
      23,
      59,
      59,
    );
    const renewed = await Shop.findByIdAndUpdate(
      new Types.ObjectId(id),
      {
        certificateIssuedAt: issuedAt,
        certificateExpiryDate: expiryDate,
        certificateStatus: "ACTIVE",
        actionBy: new Types.ObjectId(user.id),
      },
      { new: true },
    );
    return NextResponse.json(
      { message: "certificate renewed successfully", data: renewed },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
