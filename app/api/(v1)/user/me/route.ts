import { getUser } from "@/lib/auth/getUser";
import { connectDb } from "@/lib/db/db";
import { User } from "@/lib/db/models";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ message: "unauthorized" }, { status: 403 });
    }
    const userData = await User.findById(new Types.ObjectId(user.id)).select(
      "-password",
    );
    if (!userData) {
      return NextResponse.json({ message: "user not found" }, { status: 404 });
    }
    return NextResponse.json(userData, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
