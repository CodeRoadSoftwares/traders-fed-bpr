import { connectDb } from "@/lib/db/db";
import { User, OtpToken } from "@/lib/db/models";
import { verifyOtp } from "@/lib/otp/otp";
import {
  sendEmail,
  generatePasswordResetSuccessEmail,
} from "@/lib/email/email";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";

export async function POST(req: Request) {
  try {
    await connectDb();
    const { email, otp, newPassword } = await req.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { message: "Email, OTP, and new password are required" },
        { status: 400 },
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 },
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const otpToken = await OtpToken.findOne({
      email: normalizedEmail,
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

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const hashedPassword = await hash(newPassword, 10);

    await User.findByIdAndUpdate(user._id, { password: hashedPassword });

    await OtpToken.deleteMany({ email: normalizedEmail });

    await sendEmail({
      to: user.email,
      subject: "Password Reset Successful — Traders Federation",
      html: generatePasswordResetSuccessEmail(user.name),
    });

    return NextResponse.json(
      { message: "Password reset successful. You can now log in." },
      { status: 200 },
    );
  } catch (error) {
    console.error("reset-password error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
