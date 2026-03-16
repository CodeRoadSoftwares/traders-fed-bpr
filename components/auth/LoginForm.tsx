"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Icon, IC } from "@/components/ui";

export default function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(form);
      router.push("/dashboard");
    } catch (err) {
      const ax = err as { response?: { data?: { message?: string } } };
      setError(ax?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg mb-4">
          <span className="text-white font-bold text-lg">TF</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
        <p className="text-gray-500 text-sm mt-1">
          Sign in to your federation account
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 px-3.5 py-3 bg-danger-50 border border-danger-100 rounded-lg text-danger-700 text-sm">
              <Icon d={IC.alert} className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-3.5 py-2.5 pr-10 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
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
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-5">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Create one
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
