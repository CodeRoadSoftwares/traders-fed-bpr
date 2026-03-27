"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import apiClient from "@/lib/axios/apiClient";
import { Notice, NoticeAttachment } from "@/types";
import { Icon, IC } from "@/components/ui";

function NoticeCard({ notice }: { notice: Notice }) {
  const images = notice.attachments?.filter((a) => a.type === "image") ?? [];
  const pdfs = notice.attachments?.filter((a) => a.type === "pdf") ?? [];

  return (
    <div
      className={`bg-white rounded-2xl border overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col ${notice.urgent ? "border-l-4 border-l-danger-500 border-gray-100" : "border-gray-100 shadow-sm"}`}
    >
      {images.length > 0 && (
        <div className="relative w-full h-44 shrink-0">
          <Image
            src={images[0].url}
            alt={images[0].name}
            fill
            className="object-cover"
          />
          {images.length > 1 && (
            <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
              +{images.length - 1} more
            </span>
          )}
        </div>
      )}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {notice.urgent && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-danger-50 text-danger-700 text-xs font-semibold rounded-full border border-danger-100">
              <Icon d={IC.alert} className="w-3 h-3" /> Urgent
            </span>
          )}
          <span className="px-2.5 py-0.5 bg-primary-50 text-primary-700 text-xs font-medium rounded-full border border-primary-100">
            {notice.visibility}
          </span>
        </div>
        <h3 className="font-semibold text-gray-900 mb-2 leading-snug">
          {notice.title}
        </h3>
        <p className="text-gray-500 text-sm line-clamp-3 flex-1">
          {notice.message}
        </p>

        {pdfs.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {pdfs.map((a: NoticeAttachment) => (
              <a
                key={a.url}
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <Icon d={IC.download} className="w-3.5 h-3.5 text-danger-500" />
                <span className="truncate max-w-[120px]">{a.name}</span>
              </a>
            ))}
          </div>
        )}

        <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-4 pt-3 border-t border-gray-50">
          <Icon d={IC.calendar} className="w-3.5 h-3.5" />
          {new Date(notice.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </div>
      </div>
    </div>
  );
}

export default function PublicNotices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get("/notice/get", { params: { limit: 3 } })
      .then((r) => setNotices(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10">
          <div>
            <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-2">
              Announcements
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Latest Notices
            </h2>
            <p className="text-gray-500 mt-2">
              Stay updated with important announcements
            </p>
          </div>
          <Link
            href="/notices"
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-primary-600 text-sm font-medium rounded-xl shadow-sm hover:shadow-md transition-all"
          >
            View All <Icon d={IC.chevronRight} className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse"
              >
                <div className="h-44 bg-gray-200" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : notices.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon d={IC.notice} className="w-7 h-7 text-gray-400" />
            </div>
            <p className="font-medium text-gray-700">No notices yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Check back later for updates
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {notices.map((notice) => (
              <NoticeCard key={notice._id} notice={notice} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
