import { connectDb } from "@/lib/db/db";
import { Fund } from "@/lib/db/models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const page = Number(req.nextUrl.searchParams.get("page")) || 1;
    const limit = Number(req.nextUrl.searchParams.get("limit")) || 10;
    const type = req.nextUrl.searchParams.get("type");
    const startDate = req.nextUrl.searchParams.get("startDate");
    const endDate = req.nextUrl.searchParams.get("endDate");
    const skip = (page - 1) * limit;

    const match: Record<string, unknown> = {};
    if (type) match.type = type;
    if (startDate || endDate) {
      const dateFilter: Record<string, Date> = {};
      if (startDate) dateFilter.$gte = new Date(startDate);
      if (endDate) dateFilter.$lte = new Date(endDate);
      match.date = dateFilter;
    }

    const [funds, total] = await Promise.all([
      Fund.find(match)
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .populate("createdBy", "name")
        .populate("shopUser", "name"),
      Fund.countDocuments(match),
    ]);
    const data = await Promise.all(
      funds.map(async (fund) => {
        const fundObj = fund.toObject();
        if (fundObj.shopUser) {
          const { Shop } = await import("@/lib/db/models");
          const shop = await Shop.findOne({
            userId: fundObj.shopUser._id,
          }).select("shopName");
          return {
            ...fundObj,
            shopUser: {
              ...fundObj.shopUser,
              shopName: shop?.shopName || null,
            },
          };
        }
        return fundObj;
      }),
    );

    return NextResponse.json({
      data,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
