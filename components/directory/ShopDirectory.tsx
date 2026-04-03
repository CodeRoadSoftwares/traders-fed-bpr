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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      {/* Compact header + search row */}
      <div className="mb-3">
        <h1 className="text-lg sm:text-2xl font-bold text-gray-900 mb-3">
          Shop Directory
        </h1>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Icon
              d={IC.search}
              className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search shops…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-800 placeholder:text-gray-400"
            />
          </div>
          <select
            value={district}
            onChange={(e) => {
              setDistrict(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500 text-gray-700 max-w-[130px] sm:max-w-none"
          >
            <option value="">District</option>
            {Object.values(JKDistrict).map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Category chips — horizontal scroll */}
        <div className="flex gap-2 mt-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => {
              setCategory("");
              setPage(1);
            }}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${!category ? "bg-primary-600 text-white border-primary-600" : "bg-white text-gray-600 border-gray-200"}`}
          >
            All
          </button>
          {Object.values(ShopCategory).map((c) => (
            <button
              key={c}
              onClick={() => {
                setCategory(c);
                setPage(1);
              }}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${category === c ? "bg-primary-600 text-white border-primary-600" : "bg-white text-gray-600 border-gray-200"}`}
            >
              {c.replace(/_/g, " ")}
            </button>
          ))}
        </div>

        {!loading && (
          <p className="text-xs text-gray-400 mt-2">{total} shops found</p>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden"
            >
              <Sk className="h-28 sm:h-36 w-full" />
              <div className="p-3 space-y-2">
                <Sk className="h-4 w-2/3" />
                <Sk className="h-3 w-1/2" />
                <Sk className="h-3 w-3/4" />
              </div>
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
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {shops.map((shop) => (
              <Link
                key={shop._id}
                href={`/shops/${shop._id}`}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-primary-100 transition-all group flex flex-col"
              >
                <div className="relative w-full aspect-[16/10] bg-gray-100">
                  {shop.primaryPhoto || shop.photos?.[0] ? (
                    <Image
                      src={shop.primaryPhoto || shop.photos![0]}
                      alt={shop.shopName || shop.user?.name || "Shop"}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div
                      className={`w-full h-full bg-gradient-to-br ${colors[shop._id.charCodeAt(0) % colors.length]} flex items-center justify-center`}
                    >
                      <span className="text-white text-2xl font-bold opacity-50">
                        {shop.user?.name?.slice(0, 2).toUpperCase() || "TF"}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute top-2 right-2">
                    <StatusBadge status="ACTIVE" />
                  </div>
                  {shop.shopName && (
                    <p className="absolute bottom-2 left-2.5 right-2.5 text-white text-xs font-bold truncate drop-shadow-sm">
                      {shop.shopName}
                    </p>
                  )}
                </div>
                <div className="p-3 flex-1 flex flex-col gap-1.5">
                  <p className="font-semibold text-gray-900 text-sm group-hover:text-primary-600 transition-colors truncate">
                    {shop.user?.name}
                  </p>
                  <p className="text-xs text-gray-400 capitalize truncate">
                    {shop.category?.replace(/_/g, " ")}
                  </p>
                  {shop.user?.address?.district && (
                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-auto">
                      <Icon d={IC.location} className="w-3 h-3 shrink-0" />
                      <span className="truncate">
                        {shop.user.address.district}
                      </span>
                    </div>
                  )}
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
