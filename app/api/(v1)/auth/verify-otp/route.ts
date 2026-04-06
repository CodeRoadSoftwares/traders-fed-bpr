import { connectDb } from "@/lib/db/db";
import { OtpToken } from "@/lib/db/models";
import { verifyOtp } from "@/lib/otp/otp";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDb();
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { message: "Email and OTP are required" },
        { status: 400 },
      );
    }

    const otpToken = await OtpToken.findOne({
      email: email.toLowerCase().trim(),
    }).sort({ createdAt: -1 });

    if (!otpToken) {
      return NextResponse.json(
        { message: "Invalid or expired OTP" },
        { status: 400 },
      );
    }
    if (new Date() > otpToken.expiresAt) {
      await OtpToken.deleteOne({ _id: otpToken._id });
      return NextResponse.json(
        { message: "OTP has expired. Please request a new one." },
        { status: 400 },
      );
    }

    const isValid = await verifyOtp(otp, otpToken.hashedOtp);
    if (!isValid) {
      return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
    }
    return NextResponse.json(
      { message: "OTP verified successfully", verified: true },
      { status: 200 },
    );
  } catch (error) {
    console.error("verify-otp error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
