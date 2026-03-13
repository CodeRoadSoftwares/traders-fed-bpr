import { getUser } from "@/lib/auth/getUser";
import { connectDb } from "@/lib/db/db";
import Notice from "@/models/notice.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const user = await getUser();
    const page = Number(req.nextUrl.searchParams.get("page")) || 1;
    const limit = Number(req.nextUrl.searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const match: Record<string, unknown> = {};
    if (!user || user.role === "SHOP") {
      match.visibility = { $in: ["PUBLIC", "SHOPS"] };
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
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
