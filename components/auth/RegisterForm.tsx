"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import apiClient from "@/lib/axios/apiClient";
import { JKDistrict } from "@/constants/districts";
import { Icon, IC } from "@/components/ui";
import { showToast } from "@/lib/toast";

export default function RegisterForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: { line1: "", district: "", pincode: "" },
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.post("/auth/register", {
        ...form,
        phone: Number(form.phone),
        address: {
          ...form.address,
          pincode: Number(form.address.pincode),
        },
      });
      showToast.success("Account created! Please sign in.");
      router.push("/login");
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string } } };
      showToast.error(ax?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all";
  const labelCls = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg mb-4">
          <span className="text-white font-bold text-lg">TF</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
        <p className="text-gray-500 text-sm mt-1">
          Join the Traders Federation
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-6">
        {[1, 2].map((s) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${step >= s ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-400"}`}
            >
              {s}
            </div>
            <p
              className={`text-xs font-medium ${step >= s ? "text-gray-700" : "text-gray-400"}`}
            >
              {s === 1 ? "Account" : "Address"}
            </p>
            {s < 2 && (
              <div
                className={`flex-1 h-px ${step > s ? "bg-primary-300" : "bg-gray-200"}`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 && (
            <>
              <div>
                <label className={labelCls}>Full Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputCls}
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className={labelCls}>Email Address</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputCls}
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className={labelCls}>Phone Number</label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={inputCls}
                  placeholder="10-digit mobile number"
                />
              </div>
              <div>
                <label className={labelCls}>Password</label>
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className={inputCls}
                  placeholder="Choose a strong password"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  if (form.name && form.email && form.phone && form.password)
                    setStep(2);
                }}
                className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                Continue <Icon d={IC.chevronRight} className="w-4 h-4" />
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label className={labelCls}>Street Address</label>
                <input
                  type="text"
                  required
                  value={form.address.line1}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      address: { ...form.address, line1: e.target.value },
                    })
                  }
                  className={inputCls}
                  placeholder="Street, locality"
                />
              </div>
              <div>
                <label className={labelCls}>District</label>
                <select
                  required
                  value={form.address.district}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      address: { ...form.address, district: e.target.value },
                    })
                  }
                  className={inputCls}
                >
                  <option value="">Select district</option>
                  {Object.values(JKDistrict).map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Pincode</label>
                <input
                  type="text"
                  required
                  value={form.address.pincode}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      address: { ...form.address, pincode: e.target.value },
                    })
                  }
                  className={inputCls}
                  placeholder="6-digit pincode"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Icon d={IC.chevronLeft} className="w-4 h-4" /> Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                      Creating...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>
            </>
          )}
        </form>
        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          <Icon d={IC.arrowLeft} className="w-3.5 h-3.5" /> Back to home
        </Link>
      </div>
    </div>
  );
}
