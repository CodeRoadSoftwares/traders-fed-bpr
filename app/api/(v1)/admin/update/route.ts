import { getUser } from "@/lib/auth/getUser";
import { connectDb } from "@/lib/db/db";
import User from "@/models/user.model";
import { Types } from "mongoose";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";

export async function PUT(req: Request) {
  try {
    await connectDb();
    const user = await getUser();
    if (user?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ message: "unauthorized" }, { status: 403 });
    }
    const data = await req.json();
    const { id, name, email, phone, password } = data;
    const targetUser = await User.findById(new Types.ObjectId(id));
    if (!targetUser) {
      return NextResponse.json({ message: "user not found" }, { status: 404 });
    }
    if (targetUser.role === "SUPER_ADMIN") {
      return NextResponse.json(
        { message: "cannot update super admin" },
        { status: 403 },
      );
    }
    const updateData: Record<string, unknown> = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (password) updateData.password = await hash(password, 10);

    const updated = await User.findByIdAndUpdate(
      new Types.ObjectId(id),
      updateData,
      { new: true },
    ).select("-password");
    return NextResponse.json(
      { message: "admin updated successfully", data: updated },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
