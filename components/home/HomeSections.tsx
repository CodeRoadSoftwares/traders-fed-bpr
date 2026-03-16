"use client";
import Link from "next/link";
import { Shop, Notice } from "@/types";

function Icon({ d, className = "w-5 h-5" }: { d: string; className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d={d}
      />
    </svg>
  );
}
function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

const ICONS = {
  arrow: "M17 8l4 4m0 0l-4 4m4-4H3",
  alert:
    "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
  calendar:
    "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  certificate:
    "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
  location:
    "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
  verify:
    "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
};

const colors = [
  "from-primary-500 to-primary-700",
  "from-secondary-500 to-secondary-700",
  "from-warning-500 to-warning-600",
];

function NoticeCard({ notice }: { notice: Notice }) {
  return (
    <div
      className={`bg-white rounded-xl border p-5 hover:shadow-md transition-shadow flex flex-col gap-3 ${notice.urgent ? "border-l-4 border-l-danger-500 border-gray-100" : "border-gray-100"}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {notice.urgent && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-danger-50 text-danger-700 text-xs font-medium rounded-full">
              <Icon d={ICONS.alert} className="w-3 h-3" /> Urgent
            </span>
          )}
          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
            {notice.visibility}
          </span>
        </div>
        <span className="text-xs text-gray-400 shrink-0 flex items-center gap-1">
          <Icon d={ICONS.calendar} className="w-3 h-3" />
          {new Date(notice.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>
      <h3 className="font-semibold text-gray-900 text-sm leading-snug">
        {notice.title}
      </h3>
      <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
        {notice.message}
      </p>
    </div>
  );
}

function ShopCard({ shop }: { shop: Shop }) {
  const initials = shop.user?.name?.slice(0, 2).toUpperCase() || "TF";
  const color = colors[shop._id.charCodeAt(0) % colors.length];
  return (
    <Link
      href={`/shops/${shop._id}`}
      className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-primary-200 transition-all group flex flex-col gap-3"
    >
      <div className="flex items-start justify-between">
        <div
          className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-sm shrink-0`}
        >
          {initials}
        </div>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-50 text-primary-700 text-xs font-medium rounded-full">
          <Icon d={ICONS.certificate} className="w-3 h-3" /> Verified
        </span>
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 text-sm group-hover:text-primary-600 transition-colors">
          {shop.user?.name}
        </h3>
        <p className="text-xs text-gray-500 mt-0.5 capitalize">
          {shop.category?.replace(/_/g, " ")}
        </p>
      </div>
      {shop.user?.address?.district && (
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Icon d={ICONS.location} className="w-3.5 h-3.5" />
          {shop.user.address.district}
        </div>
      )}
    </Link>
  );
}

export function NoticesSection({
  notices,
  loading,
}: {
  notices: Notice[];
  loading: boolean;
}) {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-1">
            Announcements
          </p>
          <h2 className="text-xl font-bold text-gray-900">Latest Notices</h2>
        </div>
        <Link
          href="/notices"
          className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          View all <Icon d={ICONS.arrow} className="w-4 h-4" />
        </Link>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-100 p-5 space-y-3"
            >
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          ))}
        </div>
      ) : notices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {notices.map((n) => (
            <NoticeCard key={n._id} notice={n} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
          <p className="text-gray-400 text-sm">
            No public notices at this time.
          </p>
        </div>
      )}
    </section>
  );
}

export function ShopsSection({
  shops,
  loading,
}: {
  shops: Shop[];
  loading: boolean;
}) {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-1">
            Directory
          </p>
          <h2 className="text-xl font-bold text-gray-900">Verified Shops</h2>
        </div>
        <Link
          href="/directory"
          className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          Browse all <Icon d={ICONS.arrow} className="w-4 h-4" />
        </Link>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-100 p-5 space-y-3"
            >
              <div className="flex justify-between">
                <Skeleton className="h-11 w-11 rounded-xl" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : shops.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {shops.map((s) => (
            <ShopCard key={s._id} shop={s} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
          <p className="text-gray-400 text-sm">No verified shops found.</p>
        </div>
      )}
    </section>
  );
}

export function VerifyCTA() {
  return (
    <section className="bg-white rounded-xl border border-gray-100 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center shrink-0">
          <Icon d={ICONS.verify} className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">
            Verify a Shop Certificate
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Enter a certificate number to instantly verify if a shop is
            registered and active.
          </p>
        </div>
      </div>
      <Link
        href="/verify"
        className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors shadow-md"
      >
        Verify Now <Icon d={ICONS.arrow} className="w-4 h-4" />
      </Link>
    </section>
  );
}

export function HomeFeatures() {
  const features = [
    {
      icon: ICONS.certificate,
      title: "Digital Certificates",
      desc: "Unique certificate numbers with instant public verification. Certificates carry expiry dates and renewal reminders.",
      color: "text-primary-600",
      bg: "bg-primary-50",
    },
    {
      icon: ICONS.alert,
      title: "Public Noticeboard",
      desc: "Official announcements from the federation. Urgent notices are highlighted and delivered via email to all members.",
      color: "text-warning-600",
      bg: "bg-warning-50",
    },
    {
      icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      title: "Financial Transparency",
      desc: "Complete income and expense records with downloadable PDF reports. Every rupee accounted for.",
      color: "text-secondary-600",
      bg: "bg-secondary-50",
    },
    {
      icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
      title: "Verified Directory",
      desc: "Browse and search registered businesses by category and district. Only verified shops are listed.",
      color: "text-primary-600",
      bg: "bg-primary-50",
    },
    {
      icon: ICONS.verify,
      title: "Certificate Verification",
      desc: "Anyone can verify a shop's certificate using the certificate number. Instant, public, no login required.",
      color: "text-secondary-600",
      bg: "bg-secondary-50",
    },
    {
      icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z",
      title: "Shop Registration",
      desc: "Register your shop, submit documents, and get your certificate approved by federation administrators.",
      color: "text-warning-600",
      bg: "bg-warning-50",
    },
  ];
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-2">
            Platform Features
          </p>
          <h2 className="text-2xl font-bold text-gray-900">
            Everything the federation needs
          </h2>
          <p className="text-gray-500 mt-2 max-w-xl">
            A single platform for shop registration, certificate management,
            public communication, and financial accountability.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <div
                className={`w-10 h-10 ${f.bg} ${f.color} rounded-lg flex items-center justify-center mb-4`}
              >
                <Icon d={f.icon} className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Register",
      desc: "Create your account and fill in your shop details including category, address, and license number.",
    },
    {
      step: "02",
      title: "Submit for Review",
      desc: "Your registration is reviewed by a federation administrator who verifies your documents.",
    },
    {
      step: "03",
      title: "Get Certified",
      desc: "Once approved, you receive a unique digital certificate with a verifiable certificate number.",
    },
    {
      step: "04",
      title: "Stay Connected",
      desc: "Receive notices, track your certificate status, and stay updated with federation activities.",
    },
  ];
  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-2">
            Process
          </p>
          <h2 className="text-2xl font-bold text-gray-900">How it works</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div key={i} className="relative">
              {i < steps.length - 1 && (
                <div
                  className="hidden lg:block absolute top-5 left-full w-full h-px bg-gray-200 z-0"
                  style={{ width: "calc(100% - 2.5rem)", left: "2.5rem" }}
                />
              )}
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-full bg-primary-600 text-white text-sm font-bold flex items-center justify-center mb-4">
                  {s.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTABanner() {
  return (
    <section className="py-16 bg-primary-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-3">
          Ready to register your shop?
        </h2>
        <p className="text-primary-200 mb-8 max-w-xl mx-auto">
          Join the Traders Federation and get your business officially verified.
          It only takes a few minutes to get started.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/register"
            className="px-8 py-3 bg-white text-primary-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-md"
          >
            Register Your Shop
          </Link>
          <Link
            href="/verify"
            className="px-8 py-3 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-400 transition-colors border border-primary-400"
          >
            Verify a Certificate
          </Link>
        </div>
      </div>
    </section>
  );
}

export function HomeFooter() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TF</span>
              </div>
              <span className="text-white font-semibold">
                Traders Federation
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              A semi-government digital platform for shop registration,
              certificate management, and community engagement across Jammu &
              Kashmir.
            </p>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">
              Public Services
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/directory", label: "Shop Directory" },
                { href: "/verify", label: "Verify Certificate" },
                { href: "/notices", label: "Public Notices" },
                { href: "/register", label: "Register Shop" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="hover:text-primary-400 transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">
              Member Portal
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/login", label: "Member Login" },
                { href: "/dashboard", label: "Dashboard" },
                { href: "/my-shop", label: "My Shop" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="hover:text-primary-400 transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs">
          <p>
            © {new Date().getFullYear()} Traders Federation, Jammu & Kashmir.
            All rights reserved.
          </p>
          <p className="text-gray-600">Official Digital Platform</p>
        </div>
      </div>
    </footer>
  );
}
