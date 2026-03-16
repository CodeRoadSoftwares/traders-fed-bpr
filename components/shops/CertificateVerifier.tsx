"use client";
import { useState } from "react";
import { useCertificates } from "@/hooks/useCertificates";
import { Icon, IC, Btn, inputCls } from "@/components/ui";

interface VerifyResult {
  valid: boolean;
  error?: string;
  shop?: {
    name: string;
    category: string;
    certificateNumber: string;
    issuedAt: string;
    expiryDate: string;
    status: string;
  };
}

export default function CertificateVerifier() {
  const [cert, setCert] = useState("");
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [loading, setLoading] = useState(false);
  const { verifyCertificate } = useCertificates();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cert.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      setResult(await verifyCertificate(cert));
    } catch {
      setResult({ valid: false, error: "Certificate not found" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-1">
          Tools
        </p>
        <h2 className="text-xl font-bold text-gray-900">Verify Certificate</h2>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <form onSubmit={handleVerify} className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Icon
              d={IC.shield}
              className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
            />
            <input
              type="text"
              value={cert}
              onChange={(e) => setCert(e.target.value)}
              placeholder="Enter certificate number"
              className={`${inputCls} pl-9`}
              required
            />
          </div>
          <Btn type="submit" disabled={loading}>
            {loading ? "Checking..." : "Verify"}
          </Btn>
        </form>

        {result && (
          <div
            className={`rounded-xl border-2 p-5 ${result.valid ? "border-primary-200 bg-primary-50/40" : "border-danger-200 bg-danger-50/40"}`}
          >
            {result.valid && result.shop ? (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center">
                    <Icon d={IC.check2} className="w-4 h-4" />
                  </div>
                  <p className="font-semibold text-primary-700">
                    Valid Certificate
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    ["Shop Name", result.shop.name],
                    ["Category", result.shop.category.replace(/_/g, " ")],
                    ["Certificate No.", result.shop.certificateNumber],
                    ["Status", result.shop.status],
                    [
                      "Issued On",
                      new Date(result.shop.issuedAt).toLocaleDateString(
                        "en-IN",
                      ),
                    ],
                    [
                      "Valid Until",
                      new Date(result.shop.expiryDate).toLocaleDateString(
                        "en-IN",
                      ),
                    ],
                  ].map(([l, v]) => (
                    <div key={l}>
                      <p className="text-xs text-gray-400 mb-0.5">{l}</p>
                      <p className="font-medium text-gray-900 capitalize">
                        {v}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-danger-100 text-danger-600 rounded-lg flex items-center justify-center shrink-0">
                  <Icon d={IC.x} className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-danger-700">
                    Invalid Certificate
                  </p>
                  <p className="text-sm text-danger-600 mt-0.5">
                    {result.error || "Not found or expired"}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
