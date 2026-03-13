import { getUser } from "@/lib/auth/getUser";
import { connectDb } from "@/lib/db/db";
import { Notice, User } from "@/lib/db/models";
import { INotice, noticeSchema } from "@/validation/notice/notice.validation";
import { Types } from "mongoose";
import { NextResponse } from "next/server";
import { sendEmail, generateUrgentNoticeEmail } from "@/lib/email/email";

export async function POST(req: Request) {
  try {
    await connectDb();
    const user = await getUser();
    const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
    if (!isAdmin) {
      return NextResponse.json({ message: "unauthorized" }, { status: 403 });
    }
    const data = await req.json();
    const parsedData: INotice = noticeSchema.parse(data);
    const notice = await Notice.create({
      ...parsedData,
      createdBy: new Types.ObjectId(user.id),
    });
    if (!notice) {
      return NextResponse.json(
        { message: "failed to create notice" },
        { status: 400 },
      );
    }

    if (parsedData.urgent) {
      const users = await User.find({ role: "SHOP" }).select("email name");
      const emailHtml = generateUrgentNoticeEmail(
        parsedData.title,
        parsedData.message,
      );

      for (const shopUser of users) {
        await sendEmail({
          to: shopUser.email,
          subject: `🚨 Urgent Notice: ${parsedData.title}`,
          html: emailHtml,
        });
      }
    }

    return NextResponse.json(
      { message: "notice created successfully", data: notice },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
