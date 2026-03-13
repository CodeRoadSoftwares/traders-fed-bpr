import crypto from "crypto";

export function generateCertificateNumber(): string {
  const year = new Date().getFullYear();
  const random = crypto.randomBytes(6).toString("hex").toUpperCase();

  return `CERT-JK-${year}-${random}`;
}
