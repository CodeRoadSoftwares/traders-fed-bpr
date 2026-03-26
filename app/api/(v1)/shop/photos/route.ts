import { getUser } from "@/lib/auth/getUser";
import { connectDb } from "@/lib/db/db";
import { Shop } from "@/lib/db/models";
import { deleteFromS3 } from "@/lib/s3/s3";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    await connectDb();
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }

    const { photos, primaryPhoto } = await req.json();

    if (!Array.isArray(photos) || photos.length > 5) {
      return NextResponse.json(
        { message: "max 5 photos allowed" },
        { status: 400 },
      );
    }

    if (primaryPhoto && !photos.includes(primaryPhoto)) {
      return NextResponse.json(
        { message: "primaryPhoto must be one of the uploaded photos" },
        { status: 400 },
      );
    }

    const shop = await Shop.findOne({ userId: user.id });
    if (!shop) {
      return NextResponse.json({ message: "shop not found" }, { status: 404 });
    }

    const removed = (shop.photos as string[]).filter(
      (p: string) => !photos.includes(p),
    );
    await Promise.allSettled(removed.map((url: string) => deleteFromS3(url)));

    shop.photos = photos;
    shop.primaryPhoto = primaryPhoto || photos[0] || null;
    await shop.save();

    return NextResponse.json({
      message: "photos updated",
      data: { photos: shop.photos, primaryPhoto: shop.primaryPhoto },
    });
  } catch (error) {
    return NextResponse.json({ message: String(error) }, { status: 500 });
  }
}
