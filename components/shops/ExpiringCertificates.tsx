"use client";
import { useState, useEffect } from "react";
import { useCertificates } from "@/hooks/useCertificates";

export default function ExpiringCertificates() {
  const [days, setDays] = useState(30);
  const {
    expiringShops,
    loading,
    fetchExpiringCertificates,
    renewCertificate,
  } = useCertificates();

  useEffect(() => {
    fetchExpiringCertificates(days);
  }, [days, fetchExpiringCertificates]);

  const handleRenew = async (shopId: string, shopName: string) => {
    if (confirm(`Renew certificate for ${shopName}?`)) {
      try {
        await renewCertificate(shopId);
        alert("Certificate renewed successfully");
        fetchExpiringCertificates(days);
      } catch (error) {
        alert("Failed to renew certificate");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Expiring Certificates
        </h2>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
        >
          <option value={15}>Next 15 days</option>
          <option value={30}>Next 30 days</option>
          <option value={60}>Next 60 days</option>
          <option value={90}>Next 90 days</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : expiringShops.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          No certificates expiring in the next {days} days
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Shop Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Certificate Number
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Expiry Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Days Left
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {expiringShops.map((shop) => {
                const daysLeft = shop.certificateExpiryDate
                  ? Math.ceil(
                      (new Date(shop.certificateExpiryDate).getTime() -
                        new Date().getTime()) /
                        (1000 * 60 * 60 * 24),
                    )
                  : 0;
                return (
                  <tr key={shop._id}>
                    <td className="px-4 py-3 text-sm">{shop.user?.name}</td>
                    <td className="px-4 py-3 text-sm">
                      {shop.certificateNumber}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {shop.certificateExpiryDate
                        ? new Date(
                            shop.certificateExpiryDate,
                          ).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          daysLeft <= 7
                            ? "bg-red-100 text-red-700"
                            : daysLeft <= 15
                              ? "bg-orange-100 text-orange-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {daysLeft} days
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() =>
                          handleRenew(shop._id, shop.user?.name || "")
                        }
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        Renew
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
