import { getUser } from "@/lib/auth/getUser";
import { connectDb } from "@/lib/db/db";
import Fund from "@/models/fund.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const user = await getUser();
    const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
    if (!isAdmin) {
      return NextResponse.json({ message: "unauthorized" }, { status: 403 });
    }
    const period = req.nextUrl.searchParams.get("period") || "monthly";
    const year =
      Number(req.nextUrl.searchParams.get("year")) || new Date().getFullYear();
    const month = req.nextUrl.searchParams.get("month");

    const match: Record<string, unknown> = {};
    if (period === "monthly" && month) {
      const startDate = new Date(year, Number(month) - 1, 1);
      const endDate = new Date(year, Number(month), 0, 23, 59, 59);
      match.date = { $gte: startDate, $lte: endDate };
    } else if (period === "quarterly") {
      const quarter = Number(req.nextUrl.searchParams.get("quarter")) || 1;
      const startMonth = (quarter - 1) * 3;
      const startDate = new Date(year, startMonth, 1);
      const endDate = new Date(year, startMonth + 3, 0, 23, 59, 59);
      match.date = { $gte: startDate, $lte: endDate };
    } else {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31, 23, 59, 59);
      match.date = { $gte: startDate, $lte: endDate };
    }

    const report = await Fund.aggregate([
      { $match: match },
      {
        $group: {
          _id: { type: "$type", category: "$category" },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.type": 1, "_id.category": 1 } },
    ]);

    const income = report
      .filter((r) => r._id.type === "INCOME")
      .reduce((sum, r) => sum + r.total, 0);
    const expense = report
      .filter((r) => r._id.type === "EXPENSE")
      .reduce((sum, r) => sum + r.total, 0);

    return NextResponse.json({
      period,
      year,
      month,
      summary: {
        income,
        expense,
        balance: income - expense,
      },
      breakdown: report,
    });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
