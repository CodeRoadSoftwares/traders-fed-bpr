import { getUser } from "@/lib/auth/getUser";
import { connectDb } from "@/lib/db/db";
import { Shop } from "@/lib/db/models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const user = await getUser();
    const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
    if (!isAdmin) {
      return NextResponse.json({ message: "unauthorized" }, { status: 403 });
    }

    const page = Number(req.nextUrl.searchParams.get("page")) || 1;
    const limit = Number(req.nextUrl.searchParams.get("limit")) || 10;
    const search = req.nextUrl.searchParams.get("search") || "";
    const skip = (page - 1) * limit;

    const match: Record<string, unknown> = {
      certificateStatus: "ACTIVE",
    };

    if (search) {
      match.$or = [
        { shopName: { $regex: search, $options: "i" } },
        { registrationNumber: { $regex: search, $options: "i" } },
      ];
    }

    const [shops, total] = await Promise.all([
      Shop.find(match)
        .populate("userId", "name phone")
        .sort({ shopName: 1 })
        .skip(skip)
        .limit(limit),
      Shop.countDocuments(match),
    ]);

    return NextResponse.json({
      data: shops,
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
