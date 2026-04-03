"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
  close: "M6 18L18 6M6 6l12 12",
  download: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4",
  externalLink:
    "M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14",
  zoomIn:
    "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7",
  image:
    "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
  fileText:
    "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  paperclip:
    "M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13",
  phone:
    "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
};

const colors = [
  "from-primary-500 to-primary-700",
  "from-secondary-500 to-secondary-700",
  "from-warning-500 to-warning-600",
];

/* ─── Image Viewer (fullscreen) ──────────────────────────────────────────── */
function ImageViewer({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white transition-colors"
      >
        <Icon d={ICONS.close} className="w-5 h-5" />
      </button>
      <div
        className="relative max-w-4xl max-h-[85vh] w-full h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain"
          sizes="(max-width: 1024px) 100vw, 80vw"
        />
      </div>
      <a
        href={src}
        download
        onClick={(e) => e.stopPropagation()}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur text-white text-sm font-medium rounded-full transition-colors"
      >
        <Icon d={ICONS.download} className="w-4 h-4" />
        Download
      </a>
    </div>
  );
}

/* ─── Notice Detail Modal ────────────────────────────────────────────────── */
function NoticeDetailModal({
  notice,
  onClose,
}: {
  notice: Notice;
  onClose: () => void;
}) {
  const [viewerImage, setViewerImage] = useState<string | null>(null);

  const images = notice.attachments?.filter((a) => a.type === "image") ?? [];
  const pdfs = notice.attachments?.filter((a) => a.type === "pdf") ?? [];
  const hasAttachments = images.length > 0 || pdfs.length > 0;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-3 sm:p-4 pt-[6vh] sm:pt-[8vh] overflow-y-auto"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100">
            <div className="flex-1 min-w-0 pr-3">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {notice.urgent && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-danger-50 text-danger-700 text-xs font-semibold rounded-full border border-danger-100">
                    <Icon d={ICONS.alert} className="w-3 h-3" />
                    Urgent
                  </span>
                )}
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    notice.visibility === "PUBLIC"
                      ? "bg-gray-100 text-gray-600"
                      : "bg-secondary-50 text-secondary-700"
                  }`}
                >
                  {notice.visibility === "PUBLIC" ? "Public" : "Members Only"}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug">
                {notice.title}
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-2">
                <Icon d={ICONS.calendar} className="w-3.5 h-3.5" />
                {new Date(notice.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
                {notice.createdBy && typeof notice.createdBy === "object" && (
                  <>
                    <span className="text-gray-200 mx-0.5">·</span>
                    <span>{notice.createdBy.name}</span>
                  </>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors shrink-0"
            >
              <Icon d={ICONS.close} className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>
          </div>

          {/* Body */}
          <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-5 max-h-[65vh] overflow-y-auto">
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
              {notice.message}
            </p>

            {/* Images */}
            {images.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 mb-3">
                  <Icon d={ICONS.image} className="w-4 h-4 text-gray-400" />
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Images ({images.length})
                  </p>
                </div>
                <div
                  className={`grid gap-2.5 ${
                    images.length === 1 ? "grid-cols-1" : "grid-cols-2"
                  }`}
                >
                  {images.map((a) => (
                    <div
                      key={a.url}
                      className="group relative rounded-xl overflow-hidden border border-gray-100 bg-gray-50 aspect-[4/3] cursor-pointer hover:shadow-lg transition-all"
                    >
                      <Image
                        src={a.url}
                        alt={a.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        onClick={() => setViewerImage(a.url)}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-0 left-0 right-0 p-2.5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-[11px] text-white font-medium truncate max-w-[55%]">
                          {a.name}
                        </p>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewerImage(a.url);
                            }}
                            className="w-7 h-7 bg-white/20 hover:bg-white/30 backdrop-blur rounded-lg flex items-center justify-center text-white transition-colors"
                            title="View full size"
                          >
                            <Icon d={ICONS.zoomIn} className="w-3.5 h-3.5" />
                          </button>
                          <a
                            href={a.url}
                            download
                            onClick={(e) => e.stopPropagation()}
                            className="w-7 h-7 bg-white/20 hover:bg-white/30 backdrop-blur rounded-lg flex items-center justify-center text-white transition-colors"
                            title="Download"
                          >
                            <Icon d={ICONS.download} className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PDFs */}
            {pdfs.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 mb-3">
                  <Icon d={ICONS.fileText} className="w-4 h-4 text-gray-400" />
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Documents ({pdfs.length})
                  </p>
                </div>
                <div className="space-y-2">
                  {pdfs.map((a) => (
                    <div
                      key={a.url}
                      className="flex items-center gap-3 px-3 sm:px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 hover:border-gray-200 transition-all"
                    >
                      <div className="w-9 h-9 sm:w-10 sm:h-10 bg-danger-50 rounded-lg flex items-center justify-center shrink-0">
                        <Icon
                          d={ICONS.fileText}
                          className="w-4 h-4 sm:w-5 sm:h-5 text-danger-500"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {a.name}
                        </p>
                        <p className="text-[11px] text-gray-400 uppercase mt-0.5">
                          PDF Document
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <a
                          href={a.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white border border-gray-200 text-gray-600 hover:text-primary-600 hover:border-primary-200 text-xs font-medium rounded-lg transition-colors"
                        >
                          <Icon d={ICONS.externalLink} className="w-3 h-3" />
                          <span className="hidden sm:inline">View</span>
                        </a>
                        <a
                          href={a.url}
                          download
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-primary-50 border border-primary-100 text-primary-700 hover:bg-primary-100 text-xs font-medium rounded-lg transition-colors"
                        >
                          <Icon d={ICONS.download} className="w-3 h-3" />
                          <span className="hidden sm:inline">Download</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl flex items-center justify-between">
            <p className="text-xs text-gray-400">
              {hasAttachments ? (
                <>
                  {images.length > 0 &&
                    `${images.length} image${images.length > 1 ? "s" : ""}`}
                  {images.length > 0 && pdfs.length > 0 && " · "}
                  {pdfs.length > 0 &&
                    `${pdfs.length} document${pdfs.length > 1 ? "s" : ""}`}
                </>
              ) : (
                "No attachments"
              )}
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {viewerImage && (
        <ImageViewer
          src={viewerImage}
          alt="Notice attachment"
          onClose={() => setViewerImage(null)}
        />
      )}
    </>
  );
}

/* ─── Notice Card ────────────────────────────────────────────────────────── */
function NoticeCard({
  notice,
  onOpen,
}: {
  notice: Notice;
  onOpen: (n: Notice) => void;
}) {
  const imgCount =
    notice.attachments?.filter((a) => a.type === "image").length || 0;
  const pdfCount =
    notice.attachments?.filter((a) => a.type === "pdf").length || 0;
  const hasAttachments = imgCount > 0 || pdfCount > 0;
  const firstImage = notice.attachments?.find((a) => a.type === "image");

  return (
    <button
      onClick={() => onOpen(notice)}
      className={`w-full text-left bg-white rounded-xl border overflow-hidden hover:shadow-lg transition-all group cursor-pointer ${
        notice.urgent
          ? "border-l-4 border-l-danger-500 border-t-gray-100 border-r-gray-100 border-b-gray-100"
          : "border-gray-100 hover:border-primary-100"
      }`}
    >
      {/* Preview image if available */}
      {firstImage && (
        <div className="relative w-full h-32 sm:h-36 bg-gray-100 overflow-hidden">
          <Image
            src={firstImage.url}
            alt={notice.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          {imgCount > 1 && (
            <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 px-2 py-0.5 bg-black/40 backdrop-blur text-white text-[10px] font-medium rounded-full">
              <Icon d={ICONS.image} className="w-3 h-3" />+{imgCount - 1}
            </span>
          )}
        </div>
      )}

      <div className="p-4 sm:p-5 flex flex-col gap-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            {notice.urgent && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-danger-50 text-danger-700 text-xs font-medium rounded-full border border-danger-100">
                <Icon d={ICONS.alert} className="w-3 h-3" /> Urgent
              </span>
            )}
            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[11px] font-medium rounded-full">
              {notice.visibility}
            </span>
          </div>
          <span className="text-[11px] text-gray-300 shrink-0">
            {new Date(notice.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
            })}
          </span>
        </div>

        <h3 className="font-semibold text-gray-900 text-sm leading-snug group-hover:text-primary-600 transition-colors line-clamp-2">
          {notice.title}
        </h3>
        <p className="text-gray-500 text-xs sm:text-sm line-clamp-2 leading-relaxed">
          {notice.message}
        </p>

        {/* Attachment indicators */}
        {hasAttachments && (
          <div className="flex items-center gap-3 pt-1 border-t border-gray-50">
            {imgCount > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] text-gray-400">
                <Icon d={ICONS.image} className="w-3.5 h-3.5" />
                {imgCount} {imgCount > 1 ? "photos" : "photo"}
              </span>
            )}
            {pdfCount > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] text-gray-400">
                <Icon d={ICONS.fileText} className="w-3.5 h-3.5" />
                {pdfCount} {pdfCount > 1 ? "files" : "file"}
              </span>
            )}
          </div>
        )}
      </div>
    </button>
  );
}

/* ─── Shop Card (e-comm style) ───────────────────────────────────────────── */
function ShopCard({ shop }: { shop: Shop }) {
  const initials = shop.user?.name?.slice(0, 2).toUpperCase() || "TF";
  const color = colors[shop._id.charCodeAt(0) % colors.length];
  const photoUrl =
    shop.primaryPhoto ||
    (shop.photos && shop.photos.length > 0 ? shop.photos[0] : null);

  return (
    <Link
      href={`/shops/${shop._id}`}
      className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg hover:border-primary-200 transition-all group flex flex-col"
    >
      {/* Photo Hero */}
      <div className="relative w-full aspect-[16/10] bg-gray-100 overflow-hidden">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={shop.shopName || shop.user?.name || "Shop"}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${color} flex items-center justify-center`}
          >
            <span className="text-white text-3xl font-bold opacity-40">
              {initials}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 px-2 py-0.5 bg-white/90 backdrop-blur-sm text-primary-700 text-[11px] font-semibold rounded-full shadow-sm">
          <Icon d={ICONS.certificate} className="w-3 h-3" /> Verified
        </span>
        {shop.shopName && (
          <div className="absolute bottom-2.5 left-3 right-3">
            <p className="text-white text-xs font-semibold truncate drop-shadow-md">
              {shop.shopName}
            </p>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-4 flex-1 flex flex-col gap-2">
        <div>
          <h3 className="font-semibold text-gray-900 text-sm group-hover:text-primary-600 transition-colors leading-snug">
            {shop.user?.name}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5 capitalize">
            {shop.category?.replace(/_/g, " ")}
          </p>
        </div>
        <div className="space-y-1 text-xs text-gray-400 mt-auto">
          {shop.user?.phone && (
            <div className="flex items-center gap-1.5">
              <Icon d={ICONS.phone} className="w-3 h-3 shrink-0" />
              <span>{shop.user.phone}</span>
            </div>
          )}
          {shop.user?.address?.district && (
            <div className="flex items-center gap-1.5">
              <Icon d={ICONS.location} className="w-3 h-3 shrink-0" />
              <span className="truncate">
                {shop.user.address.line ? `${shop.user.address.line}, ` : ""}
                {shop.user.address.district}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

/* ─── Notices Section ────────────────────────────────────────────────────── */
export function NoticesSection({
  notices,
  loading,
}: {
  notices: Notice[];
  loading: boolean;
}) {
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  return (
    <section>
      <div className="flex items-center justify-between mb-5 sm:mb-6">
        <div>
          <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-1">
            Announcements
          </p>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            Latest Notices
          </h2>
        </div>
        <Link
          href="/notices"
          className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium shrink-0"
        >
          View all <Icon d={ICONS.arrow} className="w-4 h-4" />
        </Link>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-100 p-5 space-y-3"
            >
              <Skeleton className="h-28 w-full rounded-lg" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          ))}
        </div>
      ) : notices.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {notices.map((n) => (
            <NoticeCard key={n._id} notice={n} onOpen={setSelectedNotice} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 p-10 text-center">
          <p className="text-gray-400 text-sm">
            No public notices at this time.
          </p>
        </div>
      )}

      {selectedNotice && (
        <NoticeDetailModal
          notice={selectedNotice}
          onClose={() => setSelectedNotice(null)}
        />
      )}
    </section>
  );
}

/* ─── Shops Section ──────────────────────────────────────────────────────── */
export function ShopsSection({
  shops,
  loading,
}: {
  shops: Shop[];
  loading: boolean;
}) {
  return (
    <section>
      <div className="flex items-center justify-between mb-5 sm:mb-6">
        <div>
          <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-1">
            Directory
          </p>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            Verified Shops
          </h2>
        </div>
        <Link
          href="/directory"
          className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium shrink-0"
        >
          Browse all <Icon d={ICONS.arrow} className="w-4 h-4" />
        </Link>
      </div>
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden"
            >
              <Skeleton className="h-28 sm:h-36 w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : shops.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
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

/* ─── Everything below stays exactly the same ────────────────────────────── */

export function VerifyCTA() {
  return (
    <section className="bg-white rounded-xl border border-gray-100 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
      <div className="flex items-start sm:items-center gap-4">
        <div className="w-11 h-11 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center shrink-0">
          <Icon d={ICONS.verify} className="w-5 h-5 sm:w-6 sm:h-6" />
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
        className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors shadow-md"
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
    <section className="py-12 sm:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 sm:mb-10">
          <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-2">
            Platform Features
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Everything the federation needs
          </h2>
          <p className="text-gray-500 mt-2 max-w-xl text-sm sm:text-base">
            A single platform for shop registration, certificate management,
            public communication, and financial accountability.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-100 p-5 sm:p-6 hover:shadow-md transition-shadow"
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
      title: "Review",
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
    <section className="py-12 sm:py-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 sm:mb-10">
          <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-2">
            Process
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            How it works
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {steps.map((s, i) => (
            <div key={i} className="relative">
              {i < steps.length - 1 && (
                <div
                  className="hidden lg:block absolute top-5 h-px bg-gray-200 z-0"
                  style={{ left: "2.5rem", right: "-1rem" }}
                />
              )}
              <div className="relative z-10">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary-600 text-white text-xs sm:text-sm font-bold flex items-center justify-center mb-3 sm:mb-4">
                  {s.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1.5 text-sm sm:text-base">
                  {s.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
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
    <section className="py-12 sm:py-16 bg-primary-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
          Ready to register your shop?
        </h2>
        <p className="text-primary-200 mb-7 max-w-xl mx-auto text-sm sm:text-base">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 pb-24 md:pb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-10">
          <div className="col-span-2 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-sm">TF</span>
              </div>
              <span className="text-white font-semibold">
                Traders Federation
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              A digital platform for shop registration, certificate management,
              and community engagement across Bandipora.
            </p>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-3 sm:mb-4">
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
            <h4 className="text-white text-sm font-semibold mb-3 sm:mb-4">
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
        <div className="border-t border-gray-800 pt-5 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs">
          <p>
            © {new Date().getFullYear()} Traders Federation, Bandipora. All
            rights reserved.
          </p>
          <p className="text-gray-600">Official Digital Platform</p>
        </div>
      </div>
    </footer>
  );
}
