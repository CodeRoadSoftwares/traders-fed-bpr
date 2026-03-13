"use client";
import { useState } from "react";
import Link from "next/link";

export default function VerifyPage() {
  const [certificateNumber, setCertificateNumber] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certificateNumber.trim()) return;

    setLoading(true);
    setResult(null);
    try {
      const response = await fetch(
        `/api/certificate/verify?cert=${encodeURIComponent(certificateNumber)}`,
      );
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ valid: false, error: "Failed to verify certificate" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-primary-700">
                Traders Federation
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="text-gray-700 hover:text-primary-600 px-3 py-2"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Verify Certificate
          </h1>
          <p className="text-lg text-gray-600">
            Enter a certificate number to verify its authenticity
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Certificate Number
              </label>
              <input
                type="text"
                value={certificateNumber}
                onChange={(e) => setCertificateNumber(e.target.value)}
                placeholder="Enter certificate number (e.g., CERT-2024-001)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-lg"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50 font-semibold text-lg"
            >
              {loading ? "Verifying..." : "Verify Certificate"}
            </button>
          </form>

          {result && (
            <div className="mt-8 p-6 rounded-lg border-2">
              {result.valid ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-3xl">✓</span>
                    </div>
                    <h3 className="text-2xl font-bold text-green-700">
                      Valid Certificate
                    </h3>
                  </div>
                  <div className="border-t pt-4 space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Shop Name</p>
                        <p className="text-lg font-semibold">
                          {result.shop.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Category</p>
                        <p className="text-lg font-semibold">
                          {result.shop.category}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">
                          Certificate Number
                        </p>
                        <p className="text-lg font-semibold">
                          {result.shop.certificateNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                          {result.shop.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Issued Date</p>
                        <p className="text-lg font-semibold">
                          {new Date(result.shop.issuedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Expiry Date</p>
                        <p className="text-lg font-semibold">
                          {new Date(
                            result.shop.expiryDate,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-3xl">✗</span>
                    </div>
                    <h3 className="text-2xl font-bold text-red-700">
                      Invalid Certificate
                    </h3>
                  </div>
                  <p className="text-gray-600 border-t pt-4">
                    {result.message ||
                      "This certificate is not valid, not found, or has expired."}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/directory"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Browse Verified Shops Directory →
          </Link>
        </div>
      </div>
    </div>
  );
}
