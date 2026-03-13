import { getUser } from "@/lib/auth/getUser";
import { connectDb } from "@/lib/db/db";
import Fund from "@/models/fund.model";
import { fundSchema, IFund } from "@/validation/fund/fund.validation";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDb();
    const user = await getUser();
    const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
    if (!isAdmin) {
      return NextResponse.json({ message: "unauthorized" }, { status: 403 });
    }
    const data = await req.json();
    const parsedData: IFund = fundSchema.parse(data);
    const fund = await Fund.create({
      ...parsedData,
      createdBy: new Types.ObjectId(user.id),
    });
    if (!fund) {
      return NextResponse.json(
        { message: "failed to create fund entry" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { message: "fund entry created successfully", data: fund },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
