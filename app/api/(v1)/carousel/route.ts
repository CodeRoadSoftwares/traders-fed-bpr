import { getUser } from "@/lib/auth/getUser";
import { connectDb } from "@/lib/db/db";
import { Carousel } from "@/lib/db/models";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDb();
    const carousel = await Carousel.findOne().sort({ updatedAt: -1 });
    return NextResponse.json({ data: carousel?.slides ?? [] });
  } catch (error) {
    return NextResponse.json({ message: String(error) }, { status: 500 });
  }
}
export async function PUT(req: NextRequest) {
  try {
    await connectDb();
    const user = await getUser();
    const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
    if (!isAdmin) {
      return NextResponse.json({ message: "unauthorized" }, { status: 403 });
    }

    const { slides } = await req.json();

    if (!Array.isArray(slides) || slides.length !== 3) {
      return NextResponse.json(
        { message: "exactly 3 slides required" },
        { status: 400 },
      );
    }

    for (const s of slides) {
      if (!s.imageUrl || !s.title) {
        return NextResponse.json(
          { message: "each slide needs imageUrl and title" },
          { status: 400 },
        );
      }
    }

    const carousel = await Carousel.findOneAndUpdate(
      {},
      { slides, updatedBy: user.id },
      { upsert: true, new: true },
    );

    return NextResponse.json({
      message: "carousel updated",
      data: carousel.slides,
    });
  } catch (error) {
    return NextResponse.json({ message: String(error) }, { status: 500 });
  }
}
