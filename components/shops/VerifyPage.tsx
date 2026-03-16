"use client";
import { useState } from "react";
import Link from "next/link";
import { Icon, IC } from "@/components/ui";

interface VerifyResult {
  valid: boolean;
  message?: string;
  shop?: {
    name: string;
    category: string;
    certificateNumber: string;
    issuedAt: string;
    expiryDate: string;
    status: string;
  };
}

export default function VerifyPage() {
  const [cert, setCert] = useState("");
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cert.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const r = await fetch(
        `/api/certificate/verify?cert=${encodeURIComponent(cert)}`,
      );
      setResult(await r.json());
    } catch {
      setResult({
        valid: false,
        message: "Failed to verify. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <div className="w-14 h-14 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Icon d={IC.shield} className="w-7 h-7" />
        </div>
        <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-2">
          Certificate Verification
        </p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Verify a Shop Certificate
        </h1>
        <p className="text-gray-500 text-sm">
          Enter a certificate number to instantly verify if a shop is registered
          and active with the Traders Federation.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-4">
        <form onSubmit={handleVerify} className="flex gap-3">
          <div className="relative flex-1">
            <Icon
              d={IC.check}
              className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
            />
            <input
              type="text"
              value={cert}
              onChange={(e) => setCert(e.target.value)}
              placeholder="e.g. CERT-2024-001"
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 shrink-0"
          >
            {loading ? "Checking..." : "Verify"}
          </button>
        </form>
      </div>

      {result && (
        <div
          className={`rounded-xl border-2 p-6 ${result.valid ? "border-primary-200 bg-primary-50/50" : "border-danger-200 bg-danger-50/50"}`}
        >
          {result.valid && result.shop ? (
            <>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center">
                  <Icon d={IC.check2} className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-primary-700">
                    Valid Certificate
                  </p>
                  <p className="text-xs text-primary-600">
                    This shop is registered and active
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Shop Name", value: result.shop.name },
                  {
                    label: "Category",
                    value: result.shop.category.replace(/_/g, " "),
                  },
                  {
                    label: "Certificate No.",
                    value: result.shop.certificateNumber,
                  },
                  { label: "Status", value: result.shop.status },
                  {
                    label: "Issued On",
                    value: new Date(result.shop.issuedAt).toLocaleDateString(
                      "en-IN",
                      { day: "numeric", month: "long", year: "numeric" },
                    ),
                  },
                  {
                    label: "Valid Until",
                    value: new Date(result.shop.expiryDate).toLocaleDateString(
                      "en-IN",
                      { day: "numeric", month: "long", year: "numeric" },
                    ),
                  },
                ].map((row) => (
                  <div key={row.label}>
                    <p className="text-xs text-gray-500 mb-0.5">{row.label}</p>
                    <p className="text-sm font-semibold text-gray-900 capitalize">
                      {row.value}
                    </p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-danger-100 text-danger-600 rounded-xl flex items-center justify-center shrink-0">
                <Icon d={IC.x} className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-danger-700">
                  Invalid Certificate
                </p>
                <p className="text-sm text-danger-600 mt-0.5">
                  {result.message ||
                    "This certificate was not found or has expired."}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      <p className="text-center text-sm text-gray-400 mt-6">
        Looking for a shop?{" "}
        <Link
          href="/directory"
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          Browse the directory
        </Link>
      </p>
    </div>
  );
}
