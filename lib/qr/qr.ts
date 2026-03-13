export function generateQRCodeData(certificateNumber: string, shopId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  return `${baseUrl}/verify/${shopId}?cert=${certificateNumber}`;
}
