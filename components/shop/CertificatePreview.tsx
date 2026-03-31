"use client";
import Image from "next/image";
import { Shop } from "@/types";
import { Icon, IC } from "@/components/ui";
import apiClient from "@/lib/axios/apiClient";

interface CertificatePreviewProps {
  shop: Shop;
}

export default function CertificatePreview({ shop }: CertificatePreviewProps) {
  const handleDownload = async () => {
    try {
      const res = await apiClient.get("/certificate/download", {
        responseType: "blob",
      });
      const url = URL.createObjectURL(res.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Certificate_${shop.certificateNumber || "TF"}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download certificate:", error);
      alert("Failed to download certificate. Please try again.");
    }
  };

  const issuedDate = shop.certificateIssuedAt
    ? new Date(shop.certificateIssuedAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  const expiryDate = shop.certificateExpiryDate
    ? new Date(shop.certificateExpiryDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  const ownerName = shop.user?.name || "—";
  const shopAddress = shop.user?.address?.line
    ? `${shop.user.address.line}${shop.user.address.district ? `, ${shop.user.address.district}` : ""}${shop.user.address.pincode ? ` - ${shop.user.address.pincode}` : ""}`
    : "—";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Icon d={IC.shield} className="w-5 h-5 text-primary-600" />
          <p className="text-sm font-bold text-gray-900 uppercase tracking-widest">
            Official Certificate
          </p>
        </div>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm"
        >
          <Icon d={IC.download} className="w-4 h-4" />
          Download
        </button>
      </div>

      {/* Certificate - horizontal scroll on mobile */}
      <div className="overflow-x-auto -mx-6 px-6">
        <div
          className="relative overflow-hidden border-8 border-double border-primary-600 min-w-[700px]"
          style={{
            background:
              "linear-gradient(135deg, #fef3c7 0%, #ffffff 50%, #dbeafe 100%)",
          }}
        >
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-28 h-28 border-t-4 border-l-4 border-primary-400 opacity-30 pointer-events-none" />
          <div className="absolute top-0 right-0 w-28 h-28 border-t-4 border-r-4 border-primary-400 opacity-30 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-28 h-28 border-b-4 border-l-4 border-primary-400 opacity-30 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-28 h-28 border-b-4 border-r-4 border-primary-400 opacity-30 pointer-events-none" />

          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none">
            <div className="relative w-80 h-80">
              <Image
                src="/assets/LOGO.jpeg"
                alt="Watermark"
                fill
                className="object-contain mix-blend-multiply"
              />
            </div>
          </div>

          {/* Main content */}
          <div className="relative z-10 px-8 sm:px-14 py-8 sm:py-10 flex flex-col items-center gap-0">
            {/* Logo */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 mb-3">
              <Image
                src="/assets/LOGO.jpeg"
                alt="Federation Logo"
                fill
                className="object-contain mix-blend-multiply"
              />
            </div>

            {/* Org name */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-primary-700 tracking-tight text-center leading-tight">
              Traders Federation
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 font-semibold tracking-wide mt-0.5 mb-4">
              Bandipora, Jammu &amp; Kashmir
            </p>

            {/* Divider */}
            <div className="w-full border-t-2 border-primary-200 mb-4" />

            {/* Certificate title */}
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900 tracking-widest uppercase mb-1 text-center">
              Certificate of Registration
            </h2>
            <div className="w-36 h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent mb-5" />

            {/* Body text */}
            <p className="text-sm sm:text-base text-gray-800 leading-relaxed text-justify max-w-2xl">
              This is to certify that{" "}
              <span className="font-bold text-gray-900">{shop.shopName}</span>,
              owned by{" "}
              <span className="font-bold text-gray-900">{ownerName}</span>,
              bearing License No.{" "}
              <span className="font-mono font-bold text-gray-900">
                {shop.licenseNumber}
              </span>
              {shopAddress !== "—" && (
                <>
                  , located at{" "}
                  <span className="font-semibold text-gray-900">
                    {shopAddress}
                  </span>
                </>
              )}
              , is a registered and verified member of the Traders Federation,
              Bandipora, and has been issued this certificate in accordance with
              the federation&apos;s registration policies and regulations.
            </p>

            {/* Details grid */}
            <div className="w-full grid grid-cols-2 gap-x-6 gap-y-3 mt-6 px-2 sm:px-6 text-sm">
              <div>
                <p className="text-gray-500 font-semibold text-xs uppercase tracking-wide mb-0.5">
                  Certificate No.
                </p>
                <p className="font-mono font-bold text-gray-900">
                  {shop.certificateNumber}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-500 font-semibold text-xs uppercase tracking-wide mb-0.5">
                  Registration No.
                </p>
                <p className="font-mono font-bold text-gray-900">
                  {shop.registrationNumber}
                </p>
              </div>
              <div>
                <p className="text-gray-500 font-semibold text-xs uppercase tracking-wide mb-0.5">
                  Issued On
                </p>
                <p className="font-bold text-gray-900">{issuedDate}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-500 font-semibold text-xs uppercase tracking-wide mb-0.5">
                  Valid Until
                </p>
                <p className="font-bold text-gray-900">{expiryDate}</p>
              </div>
            </div>

            {/* Stamps */}
            <div className="w-full border-t-2 border-gray-300 mt-8 pt-6 grid grid-cols-3 gap-4">
              {[
                { src: "/assets/president.png", label: "President" },
                { src: "/assets/gen-sec.png", label: "General Secretary" },
                { src: "/assets/treasurer-accountant.png", label: "Treasurer" },
              ].map(({ src, label }) => (
                <div key={label} className="flex flex-col items-center gap-2">
                  <div className="relative w-50 h-30">
                    <Image
                      src={src}
                      alt={`${label} Stamp`}
                      fill
                      className="object-contain mix-blend-multiply opacity-90"
                    />
                  </div>
                  <div className="w-full border-t-2 border-gray-700 pt-1.5 text-center">
                    <p className="text-xs sm:text-sm font-bold text-gray-900">
                      {label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
