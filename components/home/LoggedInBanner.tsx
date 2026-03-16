"use client";
import Link from "next/link";

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

const ICONS = {
  dashboard:
    "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  shop: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z",
  certificate:
    "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
  fund: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  notice:
    "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
  verify:
    "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  myshop: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z",
};

export default function LoggedInBanner({
  user,
}: {
  user: { name: string; role: string };
}) {
  const isAdmin = user.role === "ADMIN" || user.role === "SUPER_ADMIN";
  const actions = isAdmin
    ? [
        {
          href: "/dashboard",
          label: "Dashboard",
          icon: ICONS.dashboard,
          color: "bg-primary-600 text-white hover:bg-primary-700",
        },
        {
          href: "/shops",
          label: "Manage Shops",
          icon: ICONS.shop,
          color:
            "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200",
        },
        {
          href: "/certificates",
          label: "Certificates",
          icon: ICONS.certificate,
          color:
            "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200",
        },
        {
          href: "/funds",
          label: "Funds",
          icon: ICONS.fund,
          color:
            "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200",
        },
      ]
    : [
        {
          href: "/dashboard",
          label: "Dashboard",
          icon: ICONS.dashboard,
          color: "bg-primary-600 text-white hover:bg-primary-700",
        },
        {
          href: "/my-shop",
          label: "My Shop",
          icon: ICONS.myshop,
          color:
            "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200",
        },
        {
          href: "/notices",
          label: "Notices",
          icon: ICONS.notice,
          color:
            "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200",
        },
        {
          href: "/verify",
          label: "Verify Certificate",
          icon: ICONS.verify,
          color:
            "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200",
        },
      ];

  return (
    <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-primary-200 text-sm">Welcome back</p>
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-primary-300 text-xs mt-0.5 capitalize">
              {user.role.toLowerCase().replace("_", " ")}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {actions.map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${a.color}`}
              >
                <Icon d={a.icon} className="w-4 h-4" />
                {a.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
