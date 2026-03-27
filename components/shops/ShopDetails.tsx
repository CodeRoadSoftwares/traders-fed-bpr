"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import apiClient from "@/lib/axios/apiClient";
import { Shop } from "@/types";
import { Icon, IC, StatusBadge, Spinner, Btn } from "@/components/ui";
import { useUser } from "@/hooks/useUser";
import Link from "next/link";
import { showToast } from "@/lib/toast";
import ShopPhotos from "@/components/shop/ShopPhotos";

/* ── Fullscreen image lightbox ── */
function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white transition-colors z-10"
      >
        <Icon d={IC.close} className="w-5 h-5" />
      </button>
      <div
        className="relative max-w-4xl max-h-[85vh] w-full h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={src}
          alt="Shop photo"
          fill
          className="object-contain"
          sizes="(max-width: 1024px) 100vw, 80vw"
        />
      </div>
    </div>
  );
}

export default function ShopDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [activePhoto, setActivePhoto] = useState<string | null>(null);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const { user, loading: userLoading } = useUser();
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  useEffect(() => {
    params.then((p) => fetchShop(p.id));
  }, [params]);

  const fetchShop = async (id: string) => {
    try {
      const r = await apiClient.get(`/shop/get/${id}`);
      setShop(r.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!shop || !confirm("Approve this shop?")) return;
    try {
      await apiClient.post("/certificate/approve", { id: shop._id });
      showToast.success("Shop approved");
      params.then((p) => fetchShop(p.id));
    } catch {
      showToast.error("Failed to approve shop");
    }
  };

  const handleReject = async () => {
    if (!shop || !confirm("Reject this shop?")) return;
    try {
      await apiClient.post("/certificate/reject", { id: shop._id });
      showToast.success("Shop rejected");
      params.then((p) => fetchShop(p.id));
    } catch {
      showToast.error("Failed to reject shop");
    }
  };

  const handleRenew = async () => {
    if (!shop || !confirm("Renew certificate for this shop?")) return;
    try {
      await apiClient.post("/certificate/renew", { id: shop._id });
      params.then((p) => fetchShop(p.id));
    } catch {
      showToast.error("Failed to renew certificate");
    }
  };

  if (loading) return <Spinner />;
  if (!shop)
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Shop not found.</p>
        <Link
          href="/directory"
          className="text-primary-600 text-sm mt-2 inline-block font-semibold hover:text-primary-700 transition-colors"
        >
          &larr; Back to directory
        </Link>
      </div>
    );

  const daysLeft = shop.certificateExpiryDate
    ? Math.ceil(
        (new Date(shop.certificateExpiryDate).getTime() - Date.now()) /
          86400000,
      )
    : null;

  // Robust ownership: only when user is loaded AND their ID matches the shop's userId
  const isOwner = !userLoading && !!user && String(user._id) === String(shop.userId);

  // Collect all photos for the gallery
  const allPhotos: string[] = [];
  if (shop.primaryPhoto) allPhotos.push(shop.primaryPhoto);
  if (shop.photos) {
    for (const p of shop.photos) {
      if (!allPhotos.includes(p)) allPhotos.push(p);
    }
  }
  const heroPhoto = activePhoto || allPhotos[0] || null;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Back */}
      <Link
        href={isAdmin ? "/shops" : "/directory"}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors bg-white px-3.5 py-2 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300"
      >
        <Icon d={IC.arrowLeft} className="w-4 h-4" /> Back
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-start">

        {/* ─── RIGHT COLUMN: Gallery (visually first on mobile, second on desktop) ─── */}
        <div className="lg:col-span-2 lg:order-2 space-y-4">
          {isOwner ? (
            /* Owner view: Upload manager */
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Icon d={IC.image} className="w-5 h-5 text-primary-500" />
                <p className="text-sm font-bold text-gray-900">
                  Manage Photos
                </p>
              </div>
              <div className="bg-primary-50/50 border border-primary-100 rounded-xl p-3.5 mb-4">
                <p className="text-xs font-medium text-primary-700 leading-relaxed">
                  Upload images of your store, inventory, or products. Click any photo to set it as the cover image shown in the directory.
                </p>
              </div>
              <ShopPhotos
                shopId={shop._id}
                initialPhotos={shop.photos || []}
                initialPrimary={shop.primaryPhoto}
              />
            </div>
          ) : (
            /* Public / Customer / Admin view: Immersive gallery */
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {allPhotos.length > 0 ? (
                <>
                  {/* Hero image */}
                  <div
                    className="relative w-full aspect-square sm:aspect-[4/3] cursor-pointer group"
                    onClick={() => heroPhoto && setLightboxSrc(heroPhoto)}
                  >
                    <Image
                      src={heroPhoto!}
                      alt={shop.shopName || shop.user?.name || "Shop"}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Zoom hint */}
                    <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 shadow-lg">
                      <Icon d={IC.zoomIn} className="w-3.5 h-3.5" />
                      View Full
                    </div>

                    {/* Verified badge overlay */}
                    {shop.certificateStatus === "ACTIVE" && (
                      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur text-primary-700 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1.5 border border-primary-100">
                        <Icon d={IC.shield} className="w-3.5 h-3.5" />
                        Verified
                      </div>
                    )}
                  </div>

                  {/* Thumbnail strip */}
                  {allPhotos.length > 1 && (
                    <div className="p-3 flex gap-2 overflow-x-auto">
                      {allPhotos.map((p) => (
                        <button
                          key={p}
                          onClick={() => setActivePhoto(p)}
                          className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all duration-200 ${
                            (activePhoto || allPhotos[0]) === p
                              ? "border-primary-500 ring-2 ring-primary-200 shadow-md"
                              : "border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100"
                          }`}
                        >
                          <Image src={p} alt="Thumbnail" fill className="object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-20 px-6">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                    <Icon d={IC.image} className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-sm font-semibold text-gray-700">No photos yet</p>
                  <p className="text-xs text-gray-400 mt-1 max-w-[220px] leading-relaxed">
                    This shop hasn't uploaded any storefront photos yet.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ─── LEFT COLUMN: Details ─── */}
        <div className="lg:col-span-3 lg:order-1 space-y-6">
          {/* Header card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600" />
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5 mb-6">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 rounded-2xl flex items-center justify-center text-primary-700 font-bold text-2xl shadow-sm shrink-0">
                  {shop.user?.name?.charAt(0).toUpperCase() || "?"}
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                    {shop.shopName || shop.user?.name}
                  </h1>
                  <p className="text-sm font-medium text-gray-500 mt-0.5">{shop.user?.name}</p>
                  <div className="inline-flex items-center gap-1.5 mt-2 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg text-xs font-semibold text-gray-600 capitalize">
                    <Icon d={IC.building} className="w-3.5 h-3.5 text-gray-400" />
                    {shop.category?.replace(/_/g, " ")}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <StatusBadge status={shop.certificateStatus} />
                {isAdmin && shop.certificateStatus === "PENDING" && (
                  <>
                    <Btn onClick={handleApprove} variant="primary" className="shadow-sm">
                      <Icon d={IC.check2} className="w-4 h-4" /> Approve
                    </Btn>
                    <Btn onClick={handleReject} variant="danger" className="shadow-sm">
                      <Icon d={IC.x} className="w-4 h-4" /> Reject
                    </Btn>
                  </>
                )}
                {isAdmin && shop.certificateStatus === "ACTIVE" && (
                  <Btn onClick={handleRenew} variant="secondary" className="shadow-sm">
                    <Icon d={IC.refresh} className="w-4 h-4" /> Renew
                  </Btn>
                )}
              </div>
            </div>

            {/* Expiry warning – admin only */}
            {isAdmin &&
              daysLeft !== null &&
              daysLeft <= 30 &&
              shop.certificateStatus === "ACTIVE" && (
                <div
                  className={`flex items-center gap-3 px-5 py-4 rounded-xl text-sm font-medium mb-5 shadow-sm border ${daysLeft <= 7 ? "bg-danger-50 border-danger-200 text-danger-700" : "bg-warning-50 border-warning-200 text-warning-700"}`}
                >
                  <Icon d={IC.alert} className="w-5 h-5 shrink-0" />
                  Certificate expires in {daysLeft} day{daysLeft !== 1 ? "s" : ""}.
                </div>
              )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  label: "Registration No.",
                  value: shop.registrationNumber,
                  icon: IC.building,
                },
                { label: "License No.", value: shop.licenseNumber, icon: IC.check },
                {
                  label: "Certificate No.",
                  value: shop.certificateNumber,
                  icon: IC.shield,
                  mono: true,
                },
                {
                  label: "Certificate Status",
                  value: <StatusBadge status={shop.certificateStatus} />,
                  icon: IC.check,
                },
                {
                  label: "Issued On",
                  value: shop.certificateIssuedAt
                    ? new Date(shop.certificateIssuedAt).toLocaleDateString(
                        "en-IN",
                        { day: "numeric", month: "long", year: "numeric" },
                      )
                    : "—",
                  icon: IC.calendar,
                },
                {
                  label: "Valid Until",
                  value: shop.certificateExpiryDate
                    ? new Date(shop.certificateExpiryDate).toLocaleDateString(
                        "en-IN",
                        { day: "numeric", month: "long", year: "numeric" },
                      )
                    : "—",
                  icon: IC.calendar,
                },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors"
                >
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-gray-100">
                    <Icon d={row.icon} className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="mt-0.5">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                      {row.label}
                    </p>
                    {typeof row.value === "string" ? (
                      <p
                        className={`text-sm font-bold text-gray-900 ${row.mono ? "font-mono tracking-wide" : ""}`}
                      >
                        {row.value || "—"}
                      </p>
                    ) : (
                      row.value
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <Icon d={IC.location} className="w-5 h-5 text-gray-400" />
              <p className="text-sm font-bold text-gray-900 uppercase tracking-widest">
                Contact & Location
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  label: "Phone",
                  value: String(shop.user?.phone || "—"),
                  icon: IC.phone,
                },
                { label: "Email", value: shop.user?.email || "—", icon: IC.mail },
                {
                  label: "Address",
                  value:
                    [
                      shop.user?.address?.line,
                      shop.user?.address?.district,
                      shop.user?.address?.pincode,
                    ]
                      .filter(Boolean)
                      .join(", ") || "—",
                  icon: IC.location,
                },
              ].map((row) => (
                <div key={row.label} className="flex flex-col gap-2 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2">
                    <Icon d={row.icon} className="w-4 h-4 text-gray-400" />
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {row.label}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-gray-900 line-clamp-2">
                    {row.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox overlay */}
      {lightboxSrc && (
        <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
      )}
    </div>
  );
}
