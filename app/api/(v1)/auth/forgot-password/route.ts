import { connectDb } from "@/lib/db/db";
import { User, OtpToken } from "@/lib/db/models";
import { generateOtp, hashOtp, otpExpiry } from "@/lib/otp/otp";
import { sendEmail, generateOtpEmail } from "@/lib/email/email";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDb();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 },
      );
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return NextResponse.json(
        { message: "If that email exists, an OTP has been sent." },
        { status: 200 },
      );
    }

    await OtpToken.deleteMany({ email: user.email });

    const otp = generateOtp();
    const hashedOtp = await hashOtp(otp);

    await OtpToken.create({
      email: user.email,
      hashedOtp,
      expiresAt: otpExpiry(),
    });

    await sendEmail({
      to: user.email,
      subject: "Your Password Reset OTP — Traders Federation",
      html: generateOtpEmail(otp),
    });

    return NextResponse.json(
      { message: "If that email exists, an OTP has been sent." },
      { status: 200 },
    );
  } catch (error) {
    console.error("forgot-password error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
