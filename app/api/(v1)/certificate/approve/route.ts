import { getUser } from "@/lib/auth/getUser";
import { connectDb } from "@/lib/db/db";
import { Shop } from "@/lib/db/models";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDb();
    const data = await req.json();
    const user = await getUser();
    const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
    if (!isAdmin) {
      return NextResponse.json({ message: "unauthorized" }, { status: 403 });
    }
    const { id } = data;
    const issuedAt = new Date();
    const expiryDate = new Date(
      new Date().getFullYear() + 1,
      2,
      31,
      23,
      59,
      59,
    );
    const approve = await Shop.findByIdAndUpdate(
      new Types.ObjectId(id),
      {
        certificateStatus: "ACTIVE",
        certificateIssuedAt: issuedAt,
        certificateExpiryDate: expiryDate,
        actionBy: new Types.ObjectId(user.id),
      },
      { new: true },
    );
    if (!approve) {
      return NextResponse.json(
        { message: "failed to update certificate" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { message: "Certificate approved" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
