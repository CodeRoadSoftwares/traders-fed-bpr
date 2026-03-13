import { getUser } from "@/lib/auth/getUser";
import { connectDb } from "@/lib/db/db";
import User from "@/models/user.model";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    await connectDb();
    const user = await getUser();
    if (user?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ message: "unauthorized" }, { status: 403 });
    }
    const { id } = await req.json();
    const targetUser = await User.findById(new Types.ObjectId(id));
    if (!targetUser) {
      return NextResponse.json({ message: "user not found" }, { status: 404 });
    }
    if (targetUser.role === "SUPER_ADMIN") {
      return NextResponse.json(
        { message: "cannot delete super admin" },
        { status: 403 },
      );
    }
    const deleted = await User.findByIdAndDelete(new Types.ObjectId(id));
    if (!deleted) {
      return NextResponse.json({ message: "user not found" }, { status: 404 });
    }
    return NextResponse.json(
      { message: "admin deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
