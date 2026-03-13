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
    const reject = await Shop.findByIdAndUpdate(
      new Types.ObjectId(id),
      {
        certificateStatus: "REJECTED",
        actionBy: new Types.ObjectId(user.id),
      },
      { new: true },
    );
    if (!reject) {
      return NextResponse.json(
        { message: "failed to update certificate" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { message: "Certificate rejected" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
