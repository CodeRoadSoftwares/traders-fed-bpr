import { connectDb } from "@/lib/db/db";
import { sendEmail, generateRenewalReminderEmail } from "@/lib/email/email";
import { Shop } from "@/lib/db/models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }

    await connectDb();
    const today = new Date();
    const reminderDate = new Date();
    reminderDate.setDate(today.getDate() + 15);

    const expiringShops = await Shop.find({
      certificateStatus: "ACTIVE",
      certificateExpiryDate: {
        $gte: today,
        $lte: reminderDate,
      },
    }).populate("userId", "name email");

    let sentCount = 0;
    for (const shop of expiringShops) {
      const user = shop.userId as unknown as { name: string; email: string };
      const emailHtml = generateRenewalReminderEmail(
        user.name,
        shop.certificateNumber,
        shop.certificateExpiryDate!,
      );

      const sent = await sendEmail({
        to: user.email,
        subject: "Certificate Renewal Reminder",
        html: emailHtml,
      });

      if (sent) sentCount++;
    }

    return NextResponse.json({
      message: "renewal reminders sent",
      total: expiringShops.length,
      sent: sentCount,
    });
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
