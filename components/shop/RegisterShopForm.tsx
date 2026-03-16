"use client";
import { useState } from "react";
import apiClient from "@/lib/axios/apiClient";
import { ShopCategory } from "@/constants/categories";
import { Icon, IC, Field, inputCls, Btn } from "@/components/ui";

export default function RegisterShopForm({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [form, setForm] = useState({
    registrationNumber: "",
    licenseNumber: "",
    category: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await apiClient.post("/shop/register", form);
      onSuccess();
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string } } };
      setError(ax?.response?.data?.message || "Failed to register shop");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-1">
          Get Started
        </p>
        <h1 className="text-2xl font-bold text-gray-900">Register Your Shop</h1>
        <p className="text-gray-500 text-sm mt-1">
          Submit your shop details for federation review. Once approved,
          you&apos;ll receive a digital certificate.
        </p>
      </div>

      {/* Info box */}
      <div className="flex items-start gap-3 p-4 bg-primary-50 border border-primary-100 rounded-xl text-sm text-primary-700">
        <Icon d={IC.shield} className="w-4 h-4 shrink-0 mt-0.5" />
        <p>
          Your registration will be reviewed by a federation administrator.
          You&apos;ll be notified once approved.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 bg-danger-50 border border-danger-100 rounded-lg text-danger-700 text-sm">
              <Icon d={IC.alert} className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}
          <Field
            label="Registration Number"
            hint="Your official shop registration number issued by the government"
          >
            <input
              type="text"
              required
              value={form.registrationNumber}
              onChange={(e) =>
                setForm({ ...form, registrationNumber: e.target.value })
              }
              className={inputCls}
              placeholder="e.g. REG-2024-001"
            />
          </Field>
          <Field label="License Number" hint="Your trade license number">
            <input
              type="text"
              required
              value={form.licenseNumber}
              onChange={(e) =>
                setForm({ ...form, licenseNumber: e.target.value })
              }
              className={inputCls}
              placeholder="e.g. LIC-2024-001"
            />
          </Field>
          <Field label="Shop Category">
            <select
              required
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className={inputCls}
            >
              <option value="">Select a category</option>
              {Object.values(ShopCategory).map((c) => (
                <option key={c} value={c}>
                  {c
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </option>
              ))}
            </select>
          </Field>
          <Btn
            type="submit"
            disabled={loading}
            className="w-full justify-center py-3"
          >
            {loading ? "Submitting..." : "Submit Registration"}
          </Btn>
        </form>
      </div>
    </div>
  );
}
