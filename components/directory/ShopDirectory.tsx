"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import apiClient from "@/lib/axios/apiClient";
import { Shop } from "@/types";
import Link from "next/link";
import { Icon, IC, Sk, StatusBadge, Pagination, Empty } from "@/components/ui";
import { JKDistrict } from "@/constants/districts";
import { ShopCategory } from "@/constants/categories";

const colors = [
  "from-primary-500 to-primary-700",
  "from-secondary-500 to-secondary-700",
  "from-warning-500 to-warning-600",
];

export default function ShopDirectory() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        if (search) {
          const r = await apiClient.get("/shop/search", {
            params: { q: search },
          });
          setShops(r.data.data || []);
          setTotal(r.data.count || 0);
          setTotalPages(1);
        } else {
          const r = await apiClient.get("/shop/get", {
            params: {
              status: "ACTIVE",
              page,
              limit: 12,
              district: district || undefined,
              category: category || undefined,
            },
          });
          setShops(r.data.data || []);
          setTotal(r.data.pagination?.total || 0);
          setTotalPages(r.data.pagination?.pages || 1);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [search, page, district, category]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-1.5 shadow-sm inline-block px-2 py-0.5 bg-primary-50 rounded-md border border-primary-100">
            Public Directory
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mt-1">
            Shop Directory
          </h1>
          <p className="text-gray-500 text-sm mt-1.5 font-medium">
            Browse verified and registered businesses across Bandipora, Jammu &
            Kashmir
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2 mb-8 flex flex-col lg:flex-row gap-2">
        <div className="relative flex-1">
          <Icon
            d={IC.search}
            className="w-4.5 h-4.5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2"
          />
          <input
            type="text"
            placeholder="Search by shop name, category, or owner..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-11 pr-4 py-3 bg-gray-50/50 hover:bg-gray-50 border border-transparent focus:border-primary-200 focus:bg-white focus:ring-4 focus:ring-primary-50 rounded-xl text-sm transition-all outline-none text-gray-800 placeholder:text-gray-400 font-medium"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2 shrink-0">
          <div className="relative w-full sm:w-48">
            <Icon
              d={IC.location}
              className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            />
            <select
              value={district}
              onChange={(e) => {
                setDistrict(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-8 py-3 bg-gray-50/50 hover:bg-gray-50 border border-transparent focus:border-primary-200 focus:bg-white focus:ring-4 focus:ring-primary-50 rounded-xl text-sm transition-all outline-none appearance-none cursor-pointer text-gray-700 font-medium"
            >
              <option value="">All Districts</option>
              {Object.values(JKDistrict).map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <Icon
                d={IC.chevronRight}
                className="w-3.5 h-3.5 rotate-90 opacity-70"
              />
            </div>
          </div>

          <div className="relative w-full sm:w-56">
            <Icon
              d={IC.building}
              className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            />
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-8 py-3 bg-gray-50/50 hover:bg-gray-50 border border-transparent focus:border-primary-200 focus:bg-white focus:ring-4 focus:ring-primary-50 rounded-xl text-sm transition-all outline-none appearance-none cursor-pointer text-gray-700 font-medium"
            >
              <option value="">All Categories</option>
              {Object.values(ShopCategory).map((c) => (
                <option key={c} value={c}>
                  {c.replace(/_/g, " ")}
                </option>
              ))}
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <Icon
                d={IC.chevronRight}
                className="w-3.5 h-3.5 rotate-90 opacity-70"
              />
            </div>
          </div>
        </div>
      </div>

      {!loading && (
        <p className="text-xs text-gray-500 mb-4">{total} shops found</p>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-100 p-5 space-y-3"
            >
              <div className="flex justify-between">
                <Sk className="h-11 w-11 rounded-xl" />
                <Sk className="h-5 w-16 rounded-full" />
              </div>
              <Sk className="h-4 w-2/3" />
              <Sk className="h-3 w-1/2" />
              <Sk className="h-3 w-3/4" />
            </div>
          ))}
        </div>
      ) : shops.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100">
          <Empty
            icon={IC.search}
            title="No shops found"
            subtitle={
              search
                ? "Try different search terms"
                : "No active shops at the moment"
            }
          />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {shops.map((shop) => (
              <Link
                key={shop._id}
                href={`/shops/${shop._id}`}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-primary-100 transition-all group flex flex-col"
              >
                {/* Photo / Hero Section */}
                <div className="relative w-full aspect-[16/10] bg-gray-100">
                  {shop.primaryPhoto ||
                  (shop.photos && shop.photos.length > 0) ? (
                    <Image
                      src={shop.primaryPhoto || shop.photos![0]}
                      alt={shop.shopName || shop.user?.name || "Shop"}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div
                      className={`w-full h-full bg-gradient-to-br ${colors[shop._id.charCodeAt(0) % colors.length]} flex items-center justify-center`}
                    >
                      <span className="text-white text-3xl font-bold opacity-50">
                        {shop.user?.name?.slice(0, 2).toUpperCase() || "TF"}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute top-2.5 right-2.5">
                    <StatusBadge status="ACTIVE" />
                  </div>
                  {shop.shopName && (
                    <div className="absolute bottom-2.5 left-3 right-3">
                      <p className="text-white text-sm font-bold truncate drop-shadow-sm">
                        {shop.shopName}
                      </p>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col gap-2.5">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm group-hover:text-primary-600 transition-colors">
                      {shop.user?.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5 capitalize">
                      {shop.category?.replace(/_/g, " ")}
                    </p>
                  </div>
                  <div className="space-y-1.5 text-xs text-gray-500 mt-auto">
                    {shop.user?.phone && (
                      <div className="flex items-center gap-1.5">
                        <Icon d={IC.phone} className="w-3.5 h-3.5 shrink-0" />
                        {shop.user.phone}
                      </div>
                    )}
                    {shop.user?.address?.district && (
                      <div className="flex items-center gap-1.5">
                        <Icon
                          d={IC.location}
                          className="w-3.5 h-3.5 shrink-0"
                        />
                        {shop.user.address.line
                          ? `${shop.user.address.line}, `
                          : ""}
                        {shop.user.address.district}
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 font-mono">
                      <Icon d={IC.check} className="w-3.5 h-3.5 shrink-0" />
                      {shop.certificateNumber}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <Pagination page={page} pages={totalPages} onPage={setPage} />
        </>
      )}
    </div>
  );
}
