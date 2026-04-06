"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/axios/apiClient";
import { Icon, IC } from "@/components/ui";
import { showToast } from "@/lib/toast";

const inputCls =
  "w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all";

export default function ForgotPasswordForm() {
  const [step, setStep] = useState<"email" | "otp" | "password">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const router = useRouter();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.post("/auth/forgot-password", { email });
      showToast.success("OTP sent to your email");
      setStep("otp");
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string } } };
      showToast.error(ax?.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      showToast.error("OTP must be 6 digits");
      return;
    }
    setLoading(true);
    try {
      await apiClient.post("/auth/verify-otp", { email, otp });
      showToast.success("OTP verified");
      setStep("password");
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string } } };
      showToast.error(ax?.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      showToast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await apiClient.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });
      showToast.success("Password reset successful! Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { message?: string } } };
      showToast.error(
        ax?.response?.data?.message || "Failed to reset password",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg mb-4">
          <Icon d={IC.shield} className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
        <p className="text-gray-500 text-sm mt-1">
          {step === "email" && "Enter your email to receive an OTP"}
          {step === "otp" && "Enter the 6-digit OTP sent to your email"}
          {step === "password" && "Create a new password"}
        </p>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {["email", "otp", "password"].map((s, i) => (
          <div
            key={s}
            className={`h-1.5 rounded-full transition-all ${
              step === s
                ? "w-8 bg-primary-600"
                : ["email", "otp", "password"].indexOf(step) > i
                  ? "w-6 bg-primary-300"
                  : "w-6 bg-gray-200"
            }`}
          />
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        {step === "email" && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputCls}
                placeholder="you@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Send OTP <Icon d={IC.arrow} className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Enter OTP
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className={`${inputCls} text-center text-2xl tracking-widest font-mono`}
                placeholder="000000"
              />
              <p className="text-xs text-gray-400 mt-2 text-center">
                Check your email for the 6-digit code
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep("email")}
                className="flex-1 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-lg transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                setStep("email");
                setOtp("");
              }}
              className="w-full text-xs text-primary-600 hover:text-primary-700 font-medium"
            >
              Resend OTP
            </button>
          </form>
        )}

        {step === "password" && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={inputCls}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <Icon d={IC.eye} className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Confirm Password
              </label>
              <input
                type={showPw ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputCls}
                placeholder="••••••••"
              />
            </div>
            {newPassword &&
              confirmPassword &&
              newPassword !== confirmPassword && (
                <p className="text-xs text-danger-600 flex items-center gap-1">
                  <Icon d={IC.alert} className="w-3 h-3" />
                  Passwords do not match
                </p>
              )}
            <button
              type="submit"
              disabled={loading || newPassword !== confirmPassword}
              className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-gray-500 mt-5">
          Remember your password?{" "}
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
