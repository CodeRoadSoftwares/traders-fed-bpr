import { getUser } from "@/lib/auth/getUser";
import { connectDb } from "@/lib/db/db";
import Shop from "@/models/shop.model";
import User from "@/models/user.model";
import Notice from "@/models/notice.model";
import Fund from "@/models/fund.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();
    const user = await getUser();
    const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
    if (!isAdmin) {
      return NextResponse.json({ message: "unauthorized" }, { status: 403 });
    }

    const [
      totalShops,
      pendingShops,
      activeShops,
      rejectedShops,
      totalUsers,
      totalNotices,
      fundSummary,
    ] = await Promise.all([
      Shop.countDocuments(),
      Shop.countDocuments({ certificateStatus: "PENDING" }),
      Shop.countDocuments({ certificateStatus: "ACTIVE" }),
      Shop.countDocuments({ certificateStatus: "REJECTED" }),
      User.countDocuments({ role: "SHOP" }),
      Notice.countDocuments(),
      Fund.aggregate([
        {
          $group: {
            _id: "$type",
            total: { $sum: "$amount" },
          },
        },
      ]),
    ]);

    const income = fundSummary.find((s) => s._id === "INCOME")?.total || 0;
    const expense = fundSummary.find((s) => s._id === "EXPENSE")?.total || 0;

    return NextResponse.json({
      shops: {
        total: totalShops,
        pending: pendingShops,
        active: activeShops,
        rejected: rejectedShops,
      },
      users: totalUsers,
      notices: totalNotices,
      funds: {
        income,
        expense,
        balance: income - expense,
      },
    });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
