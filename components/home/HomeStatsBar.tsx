"use client";
import { Icon } from "@/components/ui";

function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

const ICONS = {
  shop: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z",
  certificate:
    "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
  notice:
    "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
  location:
    "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
};

interface Props {
  stats: { totalShops: number; activeShops: number; totalNotices: number };
  loading: boolean;
}

export default function HomeStatsBar({ stats, loading }: Props) {
  const items = [
    {
      label: "Registered Shops",
      value: stats.totalShops,
      icon: ICONS.shop,
      color: "text-primary-600",
    },
    {
      label: "Active Certificates",
      value: stats.activeShops,
      icon: ICONS.certificate,
      color: "text-secondary-600",
    },
    {
      label: "Public Notices",
      value: stats.totalNotices,
      icon: ICONS.notice,
      color: "text-warning-600",
    },
    {
      label: "Districts Covered",
      value: 20,
      icon: ICONS.location,
      color: "text-primary-600",
    },
  ];
  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Scrollable row on mobile, grid on md+ */}
        <div className="flex overflow-x-auto md:grid md:grid-cols-4 gap-0 scrollbar-hide">
          {items.map((item, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 py-4 px-4 sm:px-6 shrink-0 min-w-[140px] md:min-w-0 ${
                i < 3 ? "md:border-r md:border-gray-100" : ""
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center ${item.color} shrink-0`}
              >
                <Icon d={item.icon} className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                {loading ? (
                  <Skeleton className="h-6 w-10 mb-1" />
                ) : (
                  <p className={`text-xl font-bold ${item.color} tabular-nums`}>
                    {item.value.toLocaleString()}
                  </p>
                )}
                <p className="text-xs text-gray-500 leading-tight whitespace-nowrap">
                  {item.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
