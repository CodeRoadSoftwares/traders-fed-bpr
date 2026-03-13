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
    const days = Number(req.nextUrl.searchParams.get("days")) || 15;
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    const expiringShops = await Shop.find({
      certificateStatus: "ACTIVE",
      certificateExpiryDate: {
        $gte: today,
        $lte: futureDate,
      },
    }).populate("userId", "name email phone");

    return NextResponse.json({
      data: expiringShops,
      count: expiringShops.length,
    });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
