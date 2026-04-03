"use client";
import { useState, useEffect } from "react";
import { useCertificates } from "@/hooks/useCertificates";
import { Icon, IC, Sk, Empty, ConfirmDialog } from "@/components/ui";
import { showToast } from "@/lib/toast";

export default function ExpiringCertificates() {
  const [days, setDays] = useState(30);
  const [confirmDialog, setConfirmDialog] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const {
    expiringShops,
    loading,
    fetchExpiringCertificates,
    renewCertificate,
  } = useCertificates();

  useEffect(() => {
    fetchExpiringCertificates(days);
  }, [days, fetchExpiringCertificates]);

  const handleRenew = async (id: string, name: string) => {
    try {
      await renewCertificate(id);
      fetchExpiringCertificates(days);
    } catch {
      showToast.error("Failed to renew");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-1">
            Alerts
          </p>
          <h2 className="text-xl font-bold text-gray-900">
            Expiring Certificates
          </h2>
        </div>
        <select
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-white text-gray-700"
        >
          <option value={15}>Next 15 days</option>
          <option value={30}>Next 30 days</option>
          <option value={60}>Next 60 days</option>
          <option value={90}>Next 90 days</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-5 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Sk className="h-9 w-9 rounded-lg" />
                <div className="flex-1 space-y-1.5">
                  <Sk className="h-3.5 w-1/3" />
                  <Sk className="h-3 w-1/4" />
                </div>
                <Sk className="h-5 w-16 rounded-full" />
                <Sk className="h-8 w-16 rounded-lg" />
              </div>
            ))}
          </div>
        ) : expiringShops.length === 0 ? (
          <Empty
            icon={IC.check}
            title={`No certificates expiring in the next ${days} days`}
            subtitle="All certificates are in good standing"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  {[
                    "Shop",
                    "Certificate No.",
                    "Expiry Date",
                    "Days Left",
                    "Action",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {expiringShops.map((shop) => {
                  const d = shop.certificateExpiryDate
                    ? Math.ceil(
                        (new Date(shop.certificateExpiryDate).getTime() -
                          Date.now()) /
                          86400000,
                      )
                    : 0;
                  const urgency =
                    d <= 7
                      ? "bg-danger-50 text-danger-700 border-danger-100"
                      : d <= 15
                        ? "bg-warning-50 text-warning-700 border-warning-100"
                        : "bg-gray-100 text-gray-600 border-gray-200";
                  return (
                    <tr
                      key={shop._id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-warning-50 text-warning-600 rounded-lg flex items-center justify-center text-xs font-bold shrink-0">
                            {shop.user?.name?.charAt(0).toUpperCase() || "?"}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {shop.user?.name}
                            </p>
                            <p className="text-xs text-gray-400">
                              {shop.user?.address?.district}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-xs font-mono text-gray-500">
                        {shop.certificateNumber}
                      </td>
                      <td className="px-4 py-3.5 text-sm text-gray-600">
                        {shop.certificateExpiryDate
                          ? new Date(
                              shop.certificateExpiryDate,
                            ).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${urgency}`}
                        >
                          {d} day{d !== 1 ? "s" : ""}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() =>
                            setConfirmDialog({
                              id: shop._id,
                              name: shop.user?.name || "",
                            })
                          }
                          className="inline-flex items-center gap-1.5 text-xs text-primary-600 hover:text-primary-700 font-medium"
                        >
                          <Icon d={IC.refresh} className="w-3.5 h-3.5" /> Renew
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
      {confirmDialog && (
        <ConfirmDialog
          title="Renew Certificate"
          message={`Renew certificate for ${confirmDialog.name}?`}
          confirmLabel="Renew"
          onConfirm={() => {
            handleRenew(confirmDialog.id, confirmDialog.name);
            setConfirmDialog(null);
          }}
          onCancel={() => setConfirmDialog(null)}
        />
      )}
    </div>
  );
}
