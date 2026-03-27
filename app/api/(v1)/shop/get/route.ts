import { connectDb } from "@/lib/db/db";
import { Shop } from "@/lib/db/models";
import { NextRequest, NextResponse } from "next/server";
import { PipelineStage } from "mongoose";

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const page = Number(req.nextUrl.searchParams.get("page")) || 1;
    const limit = Number(req.nextUrl.searchParams.get("limit")) || 10;
    const search = req.nextUrl.searchParams.get("search");
    const category = req.nextUrl.searchParams.get("category");
    const district = req.nextUrl.searchParams.get("district");
    const status = req.nextUrl.searchParams.get("status");
    const skip = (page - 1) * limit;

    const match: Record<string, unknown> = {};
    if (status && status !== "ALL") {
      match.certificateStatus = status;
    } else if (!status) {
      match.certificateStatus = "ACTIVE";
    }
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

    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { "user.name": { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } },
            { registrationNumber: { $regex: search, $options: "i" } },
          ],
        },
      });
    }

    pipeline.push(
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
      { $sort: { createdAt: -1 } },
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          totalCount: [{ $count: "count" }],
        },
      },
    );

    const shops = await Shop.aggregate(pipeline);
    const data = shops[0].data;
    const total = shops[0].totalCount[0]?.count ?? 0;

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
    console.error("Shop fetch error:", error);
    return NextResponse.json(
      { message: "Failed to fetch shops", error: String(error) },
      { status: 500 },
    );
  }
}
