import { getUser } from "@/lib/auth/getUser";
import { connectDb } from "@/lib/db/db";
import { Shop, User } from "@/lib/db/models";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import {
  renderToBuffer,
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

function assetBuffer(filename: string): Buffer {
  return fs.readFileSync(
    path.join(process.cwd(), "public", "assets", filename),
  );
}

const LOGO = assetBuffer("LOGO.jpeg");
const PRESIDENT = assetBuffer("president.png");
const GEN_SEC = assetBuffer("gen-sec.png");
const TREASURER = assetBuffer("treasurer-accountant.png");

const S = StyleSheet.create({
  page: { backgroundColor: "#ffffff", padding: 0 },
  outer: {
    margin: 20,
    border: "6px double #1d4ed8",
    flex: 1,
    position: "relative",
    backgroundColor: "#fefce8",
  },
  cTL: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 50,
    height: 50,
    borderTop: "3px solid #93c5fd",
    borderLeft: "3px solid #93c5fd",
  },
  cTR: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 50,
    height: 50,
    borderTop: "3px solid #93c5fd",
    borderRight: "3px solid #93c5fd",
  },
  cBL: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 50,
    height: 50,
    borderBottom: "3px solid #93c5fd",
    borderLeft: "3px solid #93c5fd",
  },
  cBR: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 50,
    height: 50,
    borderBottom: "3px solid #93c5fd",
    borderRight: "3px solid #93c5fd",
  },
  watermark: {
    position: "absolute",
    top: 130,
    left: 230,
    width: 200,
    height: 200,
    opacity: 0.05,
  },
  content: { padding: 30, alignItems: "center" },
  logo: { width: 80, height: 80, marginBottom: 8 },
  orgName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1d4ed8",
    textAlign: "center",
  },
  orgSub: {
    fontSize: 10,
    color: "#4b5563",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 2,
    marginBottom: 12,
  },
  divider: {
    width: "100%",
    borderBottom: "1.5px solid #bfdbfe",
    marginBottom: 12,
  },
  certTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    textAlign: "center",
    letterSpacing: 2,
    marginBottom: 4,
  },
  titleLine: {
    width: 120,
    borderBottom: "2px solid #2563eb",
    marginBottom: 14,
  },
  body: {
    fontSize: 11,
    color: "#1f2937",
    lineHeight: 1.7,
    textAlign: "justify",
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  bold: { fontWeight: "bold" },
  grid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  cellL: { width: "50%", marginBottom: 8 },
  cellR: { width: "50%", marginBottom: 8, alignItems: "flex-end" },
  label: {
    fontSize: 8,
    color: "#6b7280",
    fontWeight: "bold",
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  value: { fontSize: 11, fontWeight: "bold", color: "#111827" },
  stampDivider: {
    width: "100%",
    borderTop: "1.5px solid #d1d5db",
    marginBottom: 16,
  },
  stampsRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    paddingHorizontal: 10,
  },
  stampItem: { alignItems: "center", width: "30%" },
  stampImg: { width: 128, height: 110, marginBottom: 6 },
  stampLine: {
    width: "100%",
    borderTop: "1.5px solid #1f2937",
    paddingTop: 4,
    alignItems: "center",
  },
  stampLabel: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#111827",
    textAlign: "center",
  },
});

interface CertProps {
  shopName: string;
  ownerName: string;
  licenseNumber: string;
  shopAddress: string;
  certificateNumber: string;
  registrationNumber: string;
  issuedDate: string;
  expiryDate: string;
}

function CertificatePDF(p: CertProps) {
  const stamps = [
    { src: PRESIDENT, label: "President" },
    { src: GEN_SEC, label: "General Secretary" },
    { src: TREASURER, label: "Treasurer" },
  ];

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={S.page}>
        <View style={S.outer}>
          <View style={S.cTL} />
          <View style={S.cTR} />
          <View style={S.cBL} />
          <View style={S.cBR} />

          <View style={S.content}>
            <Image src={LOGO} style={S.logo} />
            <Text style={S.orgName}>Traders Federation</Text>
            <Text style={S.orgSub}>Bandipora, Jammu &amp; Kashmir</Text>
            <View style={S.divider} />

            <Text style={S.certTitle}>CERTIFICATE OF REGISTRATION</Text>
            <View style={S.titleLine} />

            <Text style={S.body}>
              {"This is to certify that "}
              <Text style={S.bold}>{p.shopName}</Text>
              {", owned by "}
              <Text style={S.bold}>{p.ownerName}</Text>
              {", bearing License No. "}
              <Text style={S.bold}>{p.licenseNumber}</Text>
              {p.shopAddress ? `, located at ${p.shopAddress}` : ""}
              {
                ", is a registered and verified member of the Traders Federation, Bandipora, and has been issued this certificate in accordance with the federation's registration policies and regulations."
              }
            </Text>

            <View style={S.grid}>
              <View style={S.cellL}>
                <Text style={S.label}>CERTIFICATE NO.</Text>
                <Text style={S.value}>{p.certificateNumber}</Text>
              </View>
              <View style={S.cellR}>
                <Text style={S.label}>REGISTRATION NO.</Text>
                <Text style={S.value}>{p.registrationNumber}</Text>
              </View>
              <View style={S.cellL}>
                <Text style={S.label}>ISSUED ON</Text>
                <Text style={S.value}>{p.issuedDate}</Text>
              </View>
              <View style={S.cellR}>
                <Text style={S.label}>VALID UNTIL</Text>
                <Text style={S.value}>{p.expiryDate}</Text>
              </View>
            </View>

            <View style={S.stampDivider} />
            <View style={S.stampsRow}>
              {stamps.map(({ src, label }) => (
                <View key={label} style={S.stampItem}>
                  <Image src={src} style={S.stampImg} />
                  <View style={S.stampLine}>
                    <Text style={S.stampLabel}>{label}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}

export async function GET(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user)
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });

    await connectDb();

    const shopId = req.nextUrl.searchParams.get("shopId");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let shop: any;

    if (shopId && (user.role === "ADMIN" || user.role === "SUPER_ADMIN")) {
      shop = await Shop.findById(shopId).lean();
    } else {
      shop = await Shop.findOne({ userId: user.id }).lean();
    }

    if (!shop)
      return NextResponse.json({ message: "Shop not found" }, { status: 404 });
    if (shop.certificateStatus !== "ACTIVE") {
      return NextResponse.json(
        { message: "Certificate not active" },
        { status: 403 },
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const owner: any = await User.findById(shop.userId)
      .select("name address")
      .lean();
    const ownerName: string = owner?.name || "—";
    const addr = owner?.address;
    const shopAddress: string = addr?.line
      ? `${addr.line}${addr.district ? `, ${addr.district}` : ""}${addr.pincode ? ` - ${addr.pincode}` : ""}`
      : "";

    const fmt = (d?: string | Date) =>
      d
        ? new Date(d).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "—";

    const pdfBuffer = await renderToBuffer(
      <CertificatePDF
        shopName={shop.shopName}
        ownerName={ownerName}
        licenseNumber={shop.licenseNumber}
        shopAddress={shopAddress}
        certificateNumber={shop.certificateNumber}
        registrationNumber={shop.registrationNumber}
        issuedDate={fmt(shop.certificateIssuedAt)}
        expiryDate={fmt(shop.certificateExpiryDate)}
      />,
    );

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Certificate_${shop.certificateNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Certificate PDF error:", error);
    return NextResponse.json(
      { message: "Failed to generate certificate" },
      { status: 500 },
    );
  }
}
