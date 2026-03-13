import { connectDb } from "@/lib/db/db";
import Fund from "@/models/fund.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const startDate = req.nextUrl.searchParams.get("startDate");
    const endDate = req.nextUrl.searchParams.get("endDate");

    const match: Record<string, unknown> = {};
    if (startDate || endDate) {
      const dateFilter: Record<string, Date> = {};
      if (startDate) dateFilter.$gte = new Date(startDate);
      if (endDate) dateFilter.$lte = new Date(endDate);
      match.date = dateFilter;
    }

    const summary = await Fund.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
        },
      },
    ]);

    const income = summary.find((s) => s._id === "INCOME")?.total || 0;
    const expense = summary.find((s) => s._id === "EXPENSE")?.total || 0;

    return NextResponse.json({
      income,
      expense,
      balance: income - expense,
    });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
