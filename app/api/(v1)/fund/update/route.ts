import { getUser } from "@/lib/auth/getUser";
import { connectDb } from "@/lib/db/db";
import Fund from "@/models/fund.model";
import { fundSchema } from "@/validation/fund/fund.validation";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    await connectDb();
    const user = await getUser();
    const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
    if (!isAdmin) {
      return NextResponse.json({ message: "unauthorized" }, { status: 403 });
    }
    const data = await req.json();
    const { id, ...updateData } = data;
    const parsedData = fundSchema.parse(updateData);
    const updated = await Fund.findByIdAndUpdate(
      new Types.ObjectId(id),
      parsedData,
      { new: true },
    );
    if (!updated) {
      return NextResponse.json(
        { message: "fund entry not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { message: "fund entry updated successfully", data: updated },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
