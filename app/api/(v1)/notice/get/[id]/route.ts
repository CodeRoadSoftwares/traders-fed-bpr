import { connectDb } from "@/lib/db/db";
import { Notice, User } from "@/lib/db/models";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDb();
    const { id } = await params;
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid notice id" },
        { status: 400 },
      );
    }
    const notice = await Notice.findById(new Types.ObjectId(id)).populate(
      "createdBy",
      "name",
    );
    if (!notice) {
      return NextResponse.json(
        { message: "notice not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(notice, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
