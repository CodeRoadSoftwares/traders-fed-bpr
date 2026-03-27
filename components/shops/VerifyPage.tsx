"use client";
import { useState } from "react";
import Link from "next/link";
import { Icon, IC, StatusBadge } from "@/components/ui";

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
    <div className="max-w-2xl mx-auto px-4 py-10 sm:py-16">
      {/* Hero Header */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-primary-200">
          <Icon d={IC.shield} className="w-8 h-8" />
        </div>
        <p className="text-xs font-bold text-primary-600 uppercase tracking-[0.2em] mb-2 inline-block px-3 py-1 bg-primary-50 rounded-full border border-primary-100">
          Certificate Verification
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mt-3">
          Verify a Shop Certificate
        </h1>
        <p className="text-gray-500 text-sm sm:text-base mt-2 max-w-md mx-auto leading-relaxed font-medium">
          Instantly check if a shop is registered and holds a valid certificate with the Traders Federation.
        </p>
      </div>

      {/* Search Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2 mb-8">
        <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Icon
              d={IC.shield}
              className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2"
            />
            <input
              type="text"
              value={cert}
              onChange={(e) => setCert(e.target.value)}
              placeholder="Enter certificate number, e.g. TF-BND-2024-001"
              className="w-full pl-12 pr-4 py-4 bg-gray-50/50 hover:bg-gray-50 border border-transparent focus:border-primary-200 focus:bg-white focus:ring-4 focus:ring-primary-50 rounded-xl text-sm transition-all outline-none text-gray-800 placeholder:text-gray-400 font-medium"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-50 shrink-0 shadow-sm hover:shadow-lg hover:shadow-primary-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <Icon d={IC.search} className="w-4 h-4" />
                Verify
              </>
            )}
          </button>
        </form>
      </div>

      {/* Results */}
      {result && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          {result.valid && result.shop ? (
            <div className="bg-white rounded-2xl border-2 border-primary-200 shadow-sm overflow-hidden">
              {/* Success banner */}
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center shrink-0">
                  <Icon d={IC.check2} className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-white text-lg">
                    Valid Certificate
                  </p>
                  <p className="text-sm text-primary-100 font-medium">
                    This shop is registered and verified with the federation.
                  </p>
                </div>
              </div>

              {/* Shop detail grid */}
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: "Shop Name", value: result.shop.name, icon: IC.shop },
                    {
                      label: "Category",
                      value: result.shop.category.replace(/_/g, " "),
                      icon: IC.building,
                    },
                    {
                      label: "Certificate No.",
                      value: result.shop.certificateNumber,
                      icon: IC.shield,
                      mono: true,
                    },
                    { label: "Status", value: result.shop.status, icon: IC.check, badge: true },
                    {
                      label: "Issued On",
                      value: new Date(result.shop.issuedAt).toLocaleDateString(
                        "en-IN",
                        { day: "numeric", month: "long", year: "numeric" },
                      ),
                      icon: IC.calendar,
                    },
                    {
                      label: "Valid Until",
                      value: new Date(result.shop.expiryDate).toLocaleDateString(
                        "en-IN",
                        { day: "numeric", month: "long", year: "numeric" },
                      ),
                      icon: IC.calendar,
                    },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100"
                    >
                      <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shrink-0 shadow-sm border border-gray-100">
                        <Icon d={row.icon} className="w-4.5 h-4.5 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                          {row.label}
                        </p>
                        {row.badge ? (
                          <StatusBadge status={row.value} />
                        ) : (
                          <p className={`text-sm font-bold text-gray-900 capitalize ${row.mono ? "font-mono tracking-wider text-xs" : ""}`}>
                            {row.value}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border-2 border-danger-200 shadow-sm overflow-hidden">
              {/* Error banner */}
              <div className="bg-gradient-to-r from-danger-500 to-danger-600 px-6 py-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center shrink-0">
                  <Icon d={IC.x} className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-white text-lg">
                    Invalid Certificate
                  </p>
                  <p className="text-sm text-danger-100 font-medium">
                    {result.message ||
                      "This certificate number was not found or belongs to an expired/rejected shop."}
                  </p>
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-sm text-gray-600 leading-relaxed">
                  Please double-check the certificate number and try again. If you believe this is an error, contact the Traders Federation office for assistance.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer hint */}
      <div className="text-center mt-8 space-y-3">
        <p className="text-sm text-gray-400 font-medium">
          Looking for a shop?{" "}
          <Link
            href="/directory"
            className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
          >
            Browse the directory →
          </Link>
        </p>
        <p className="text-xs text-gray-300">
          All certificates are issued and verified by the Bandipora Traders Federation.
        </p>
      </div>
    </div>
  );
}
