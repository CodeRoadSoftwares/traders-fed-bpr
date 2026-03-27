import { getUser } from "@/lib/auth/getUser";
import { connectDb } from "@/lib/db/db";
import { Fund } from "@/lib/db/models";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();
    const user = await getUser();
    if (!user || user.role !== "SHOP") {
      return NextResponse.json({ message: "unauthorized" }, { status: 403 });
    }

    const contributions = await Fund.find({
      type: "INCOME",
      shopUser: user.id,
    }).sort({ date: -1 });

    const totalAmount = contributions.reduce(
      (sum, entry) => sum + entry.amount,
      0,
    );

    return NextResponse.json({
      totalAmount,
      contributions,
    });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
