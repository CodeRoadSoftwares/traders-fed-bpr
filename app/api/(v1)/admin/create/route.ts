import { getUser } from "@/lib/auth/getUser";
import { connectDb } from "@/lib/db/db";
import User from "@/models/user.model";
import { adminSchema, IAdmin } from "@/validation/admin/admin.validation";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDb();
    const user = await getUser();
    if (user?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ message: "unauthorized" }, { status: 403 });
    }
    const data = await req.json();
    const parsedData: IAdmin = adminSchema.parse(data);
    const { email, password, phone, name } = parsedData;
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 },
      );
    }
    const hashedPassword = await hash(password, 10);
    const newAdmin = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "ADMIN",
    });
    if (!newAdmin) {
      return NextResponse.json(
        { message: "failed to create admin" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { message: "admin created successfully", data: newAdmin },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
