import { connectDb } from "@/lib/db/db";
import { Shop } from "@/lib/db/models";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDb();
    const { id } = await params;
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid shop id" }, { status: 400 });
    }
    const shop = await Shop.aggregate([
      { $match: { _id: new Types.ObjectId(id) } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          registrationNumber: 1,
          licenseNumber: 1,
          shopName: 1,
          category: 1,
          photos: 1,
          primaryPhoto: 1,
          location: 1,
          certificateNumber: 1,
          certificateStatus: 1,
          certificateIssuedAt: 1,
          certificateExpiryDate: 1,
          createdAt: 1,
          "user.name": 1,
          "user.email": 1,
          "user.phone": 1,
          "user.address": 1,
        },
      },
    ]);
    if (!shop.length) {
      return NextResponse.json({ message: "shop not found" }, { status: 404 });
    }
    return NextResponse.json(shop[0], { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
