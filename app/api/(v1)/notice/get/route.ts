import { getUser } from "@/lib/auth/getUser";
import { connectDb } from "@/lib/db/db";
import { Notice } from "@/lib/db/models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    let user = null;
    try {
      user = await getUser();
    } catch {
      user = null;
    }

    const page = Number(req.nextUrl.searchParams.get("page")) || 1;
    const limit = Number(req.nextUrl.searchParams.get("limit")) || 10;
    const search = req.nextUrl.searchParams.get("search");
    const startDate = req.nextUrl.searchParams.get("startDate");
    const endDate = req.nextUrl.searchParams.get("endDate");
    const skip = (page - 1) * limit;

    const match: Record<string, unknown> = {};
    if (!user || user.role === "SHOP") {
      match.visibility = { $in: ["PUBLIC", "SHOPS"] };
    }

    if (startDate || endDate) {
      const dateFilter: Record<string, Date> = {};
      if (startDate) dateFilter.$gte = new Date(startDate);
      if (endDate) dateFilter.$lte = new Date(endDate);
      match.createdAt = dateFilter;
    }

    if (search) {
      match.$or = [
        { title: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
      ];
    }

    const [data, total] = await Promise.all([
      Notice.find(match)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("createdBy", "name"),
      Notice.countDocuments(match),
    ]);

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
    console.error("Notice fetch error:", error);
    return NextResponse.json(
      { message: "Failed to fetch notices", error: String(error) },
      { status: 500 },
    );
  }
}
