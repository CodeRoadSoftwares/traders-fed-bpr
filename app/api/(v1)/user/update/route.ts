import { getUser } from "@/lib/auth/getUser";
import { connectDb } from "@/lib/db/db";
import { User } from "@/lib/db/models";
import { Types } from "mongoose";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";

export async function PUT(req: Request) {
  try {
    await connectDb();
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ message: "unauthorized" }, { status: 403 });
    }
    const data = await req.json();
    const { name, phone, address, password } = data;
    const updateData: Record<string, unknown> = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (password) {
      updateData.password = await hash(password, 10);
    }
    const updated = await User.findByIdAndUpdate(
      new Types.ObjectId(user.id),
      updateData,
      { new: true },
    ).select("-password");
    if (!updated) {
      return NextResponse.json({ message: "user not found" }, { status: 404 });
    }
    return NextResponse.json(
      { message: "profile updated successfully", data: updated },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
