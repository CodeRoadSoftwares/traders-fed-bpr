import bcrypt from "bcrypt";

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function hashOtp(otp: string): Promise<string> {
  return bcrypt.hash(otp, 10);
}

export async function verifyOtp(
  otp: string,
  hashedOtp: string,
): Promise<boolean> {
  return bcrypt.compare(otp, hashedOtp);
}

export function otpExpiry(): Date {
  return new Date(Date.now() + 10 * 60 * 1000);
}
