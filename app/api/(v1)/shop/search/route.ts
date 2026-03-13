import { connectDb } from "@/lib/db/db";
import Shop from "@/models/shop.model";
import { NextRequest, NextResponse } from "next/server";
import { PipelineStage } from "mongoose";

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const query = req.nextUrl.searchParams.get("q");
    const category = req.nextUrl.searchParams.get("category");
    const district = req.nextUrl.searchParams.get("district");

    if (!query && !category && !district) {
      return NextResponse.json(
        { message: "at least one search parameter required" },
        { status: 400 },
      );
    }

    const match: Record<string, unknown> = {
      certificateStatus: "ACTIVE",
    };
    if (category) match.category = category;

    const pipeline: PipelineStage[] = [
      { $match: match },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
    ];

    if (district) {
      pipeline.push({
        $match: {
          "user.address.district": district,
        },
      });
    }

    if (query) {
      pipeline.push({
        $match: {
          $or: [
            { "user.name": { $regex: query, $options: "i" } },
            { category: { $regex: query, $options: "i" } },
            { "user.address.line": { $regex: query, $options: "i" } },
          ],
        },
      });
    }

    pipeline.push(
      {
        $project: {
          category: 1,
          certificateNumber: 1,
          certificateStatus: 1,
          "user.name": 1,
          "user.phone": 1,
          "user.email": 1,
          "user.address": 1,
        },
      },
      { $limit: 50 },
    );

    const shops = await Shop.aggregate(pipeline);

    return NextResponse.json({ data: shops, count: shops.length });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
