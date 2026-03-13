"use client";
import { useState } from "react";
import { useCertificates } from "@/hooks/useCertificates";

interface VerificationResult {
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
  const [certificateNumber, setCertificateNumber] = useState("");
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const { verifyCertificate } = useCertificates();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certificateNumber.trim()) return;

    setLoading(true);
    setResult(null);
    try {
      const data = await verifyCertificate(certificateNumber);
      setResult(data);
    } catch {
      setResult({ valid: false, error: "Certificate not found" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Verify Certificate</h2>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Certificate Number
            </label>
            <input
              type="text"
              value={certificateNumber}
              onChange={(e) => setCertificateNumber(e.target.value)}
              placeholder="Enter certificate number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify Certificate"}
          </button>
        </form>

        {result && (
          <div className="mt-6 p-4 rounded-lg border-2">
            {result.valid && result.shop ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">✓</span>
                  <h3 className="text-xl font-bold text-green-700">
                    Valid Certificate
                  </h3>
                </div>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Shop Name:</span>{" "}
                    {result.shop.name}
                  </p>
                  <p>
                    <span className="font-medium">Category:</span>{" "}
                    {result.shop.category}
                  </p>
                  <p>
                    <span className="font-medium">Certificate Number:</span>{" "}
                    {result.shop.certificateNumber}
                  </p>
                  <p>
                    <span className="font-medium">Issued At:</span>{" "}
                    {new Date(result.shop.issuedAt).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-medium">Expiry Date:</span>{" "}
                    {new Date(result.shop.expiryDate).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>{" "}
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                      {result.shop.status}
                    </span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">✗</span>
                  <h3 className="text-xl font-bold text-red-700">
                    Invalid Certificate
                  </h3>
                </div>
                <p className="text-sm text-gray-600">
                  {result.error ||
                    "This certificate is not valid or has expired"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
