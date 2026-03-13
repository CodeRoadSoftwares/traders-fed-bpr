import { connectDb } from "@/lib/db/db";
import Shop from "@/models/shop.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }

    await connectDb();
    const today = new Date();

    const result = await Shop.updateMany(
      {
        certificateStatus: "ACTIVE",
        certificateExpiryDate: { $lt: today },
      },
      {
        $set: { certificateStatus: "EXPIRED" },
      },
    );

    return NextResponse.json({
      message: "certificates expired successfully",
      count: result.modifiedCount,
    });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
