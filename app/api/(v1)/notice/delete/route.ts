import { getUser } from "@/lib/auth/getUser";
import { connectDb } from "@/lib/db/db";
import { Notice } from "@/lib/db/models";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    await connectDb();
    const user = await getUser();
    const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
    if (!isAdmin) {
      return NextResponse.json({ message: "unauthorized" }, { status: 403 });
    }
    const { id } = await req.json();
    const deleted = await Notice.findByIdAndDelete(new Types.ObjectId(id));
    if (!deleted) {
      return NextResponse.json(
        { message: "notice not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { message: "notice deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
