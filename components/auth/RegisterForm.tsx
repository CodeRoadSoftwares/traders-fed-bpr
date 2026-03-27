"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import apiClient from "@/lib/axios/apiClient";
import { uploadToS3 } from "@/hooks/useUpload";
import { JKDistrict } from "@/constants/districts";
import { ShopCategory } from "@/constants/categories";
import { Icon, IC } from "@/components/ui";
import { showToast } from "@/lib/toast";

const STEPS = ["Account", "Address", "Shop Details"];

const inputCls =
  "w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all";
const labelCls = "block text-sm font-medium text-gray-700 mb-1.5";

export default function RegisterForm() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const photoRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "",
    fatherName: "",
    aadharNumber: "",
    email: "",
    password: "",
    phone: "",
    address: { line1: "", district: "", pincode: "" },
    shopName: "",
    registrationNumber: "",
    licenseNumber: "",
    category: "",
    primaryPhoto: "",
  });

  const router = useRouter();

  const set = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const setAddr = (field: string, value: string) =>
    setForm((prev) => ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }));

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToS3(file, "registration");
      setForm((prev) => ({ ...prev, primaryPhoto: url }));
      setPhotoPreview(url);
    } catch {
      showToast.error("Photo upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.primaryPhoto) {
      showToast.error("Please upload a shop photo");
      return;
    }
    setLoading(true);
    try {
      await apiClient.post("/auth/register", {
        ...form,
        phone: Number(form.phone),
        aadharNumber: form.aadharNumber.replace(/\s/g, ""),
        address: {
          ...form.address,
          pincode: Number(form.address.pincode),
        },
      });
      showToast.success("Registered! Your shop is pending admin approval.");
      router.push("/dashboard");
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string } } };
      showToast.error(ax?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const canProceedStep1 =
    form.name &&
    form.fatherName &&
    form.aadharNumber.replace(/\s/g, "").length === 12 &&
    form.email &&
    form.phone &&
    form.password;

  const canProceedStep2 =
    form.address.line1 && form.address.district && form.address.pincode;

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg mb-4">
          <span className="text-white font-bold text-lg">TF</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Register Shop</h1>
        <p className="text-gray-500 text-sm mt-1">
          Join the Traders Federation
        </p>
      </div>

      <div className="flex items-center gap-2 mb-6">
        {STEPS.map((label, i) => {
          const s = i + 1;
          return (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${step >= s ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-400"}`}
              >
                {s}
              </div>
              <p
                className={`text-xs font-medium ${step >= s ? "text-gray-700" : "text-gray-400"}`}
              >
                {label}
              </p>
              {s < STEPS.length && (
                <div
                  className={`flex-1 h-px ${step > s ? "bg-primary-300" : "bg-gray-200"}`}
                />
              )}
            </div>
          );
        })}
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
                  onChange={(e) => set("name", e.target.value)}
                  className={inputCls}
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className={labelCls}>Father&apos;s Name</label>
                <input
                  type="text"
                  required
                  value={form.fatherName}
                  onChange={(e) => set("fatherName", e.target.value)}
                  className={inputCls}
                  placeholder="Father's full name"
                />
              </div>
              <div>
                <label className={labelCls}>Aadhar Number</label>
                <input
                  type="text"
                  required
                  maxLength={12}
                  value={form.aadharNumber}
                  onChange={(e) =>
                    set("aadharNumber", e.target.value.replace(/\D/g, ""))
                  }
                  className={inputCls}
                  placeholder="12-digit Aadhar number"
                />
              </div>
              <div>
                <label className={labelCls}>Email Address</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
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
                  onChange={(e) => set("phone", e.target.value)}
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
                  onChange={(e) => set("password", e.target.value)}
                  className={inputCls}
                  placeholder="Choose a strong password"
                />
              </div>
              <button
                type="button"
                disabled={!canProceedStep1}
                onClick={() => setStep(2)}
                className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
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
                  onChange={(e) => setAddr("line1", e.target.value)}
                  className={inputCls}
                  placeholder="Street, locality"
                />
              </div>
              <div>
                <label className={labelCls}>District</label>
                <select
                  required
                  value={form.address.district}
                  onChange={(e) => setAddr("district", e.target.value)}
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
                  onChange={(e) => setAddr("pincode", e.target.value)}
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
                  type="button"
                  disabled={!canProceedStep2}
                  onClick={() => setStep(3)}
                  className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  Continue <Icon d={IC.chevronRight} className="w-4 h-4" />
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div>
                <label className={labelCls}>Shop Name</label>
                <input
                  type="text"
                  required
                  value={form.shopName}
                  onChange={(e) => set("shopName", e.target.value)}
                  className={inputCls}
                  placeholder="Your shop name"
                />
              </div>
              <div>
                <label className={labelCls}>Registration Number</label>
                <input
                  type="text"
                  required
                  value={form.registrationNumber}
                  onChange={(e) => set("registrationNumber", e.target.value)}
                  className={inputCls}
                  placeholder="Shop registration number"
                />
              </div>
              <div>
                <label className={labelCls}>License Number</label>
                <input
                  type="text"
                  required
                  value={form.licenseNumber}
                  onChange={(e) => set("licenseNumber", e.target.value)}
                  className={inputCls}
                  placeholder="Trade license number"
                />
              </div>
              <div>
                <label className={labelCls}>Category</label>
                <select
                  required
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                  className={inputCls}
                >
                  <option value="">Select category</option>
                  {Object.values(ShopCategory).map((c) => (
                    <option key={c} value={c}>
                      {c.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Shop Photo</label>
                <input
                  ref={photoRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
                {photoPreview ? (
                  <div className="relative w-full h-40 rounded-lg overflow-hidden border border-gray-200">
                    <Image
                      src={photoPreview}
                      alt="Shop photo"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPhotoPreview("");
                        setForm((p) => ({ ...p, primaryPhoto: "" }));
                      }}
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow text-gray-500 hover:text-red-500"
                    >
                      <Icon d={IC.x} className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => photoRef.current?.click()}
                    disabled={uploading}
                    className="w-full h-32 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-primary-400 hover:text-primary-500 transition-colors disabled:opacity-50"
                  >
                    {uploading ? (
                      <div className="w-5 h-5 border-2 border-gray-300 border-t-primary-500 rounded-full animate-spin" />
                    ) : (
                      <>
                        <Icon d={IC.shop} className="w-6 h-6" />
                        <span className="text-xs">
                          Click to upload shop photo
                        </span>
                      </>
                    )}
                  </button>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Icon d={IC.chevronLeft} className="w-4 h-4" /> Back
                </button>
                <button
                  type="submit"
                  disabled={loading || uploading}
                  className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                      Registering...
                    </>
                  ) : (
                    "Register Shop"
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
