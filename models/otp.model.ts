import { Schema, model, models } from "mongoose";

const otpTokenSchema = new Schema(
  {
    email: { type: String, required: true, index: true },
    hashedOtp: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: true },
  },
  { timestamps: true },
);

// Auto-delete expired OTPs
otpTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const OtpToken = models.OtpToken || model("OtpToken", otpTokenSchema);
export default OtpToken;
