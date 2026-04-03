"use client";
import { useState } from "react";
import Image from "next/image";
import { useNotices } from "@/hooks/useNotices";
import { useUser } from "@/hooks/useUser";
import { Notice, NoticeAttachment } from "@/types";
import CreateNoticeModal from "./CreateNoticeModal";
import NoticeDetailModal from "@/components/dashboard/NoticeDetailModal";
import {
  Icon,
  IC,
  Sk,
  StatusBadge,
  Pagination,
  Empty,
  Btn,
} from "@/components/ui";

export default function NoticesList() {
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  const { notices, pagination, loading, deleteNotice, refetch } = useNotices({
    page,
  });
  const { user } = useUser();
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  const images = (attachments?: NoticeAttachment[]) =>
    attachments?.filter((a) => a.type === "image") ?? [];
  const pdfs = (attachments?: NoticeAttachment[]) =>
    attachments?.filter((a) => a.type === "pdf") ?? [];

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-1.5 shadow-sm inline-block px-2 py-0.5 bg-primary-50 rounded-md border border-primary-100">
            Announcements
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mt-1">
            Notices
          </h1>
          <p className="text-gray-500 text-sm mt-1 font-medium">
            Official announcements and updates from the Traders Federation
          </p>
        </div>
        {isAdmin && (
          <Btn onClick={() => setShowModal(true)} className="shadow-sm">
            <Icon d={IC.plus} className="w-4 h-4" /> New Notice
          </Btn>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4 shadow-sm"
            >
              <Sk className="h-48 w-full rounded-xl" />
              <div className="flex gap-2">
                <Sk className="h-5 w-16 rounded-full" />
                <Sk className="h-5 w-20 rounded-full" />
              </div>
              <Sk className="h-5 w-3/4" />
              <Sk className="h-3 w-full" />
              <Sk className="h-3 w-5/6" />
              <div className="pt-4 mt-2 border-t border-gray-50 flex justify-between">
                <Sk className="h-3 w-20" />
                <Sk className="h-4 w-12" />
              </div>
            </div>
          ))}
        </div>
      ) : notices.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden py-12">
          <Empty
            icon={IC.notice}
            title="No notices yet"
            subtitle="Check back later for important updates and announcements."
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {notices.map((notice) => {
            const imgs = images(notice.attachments);
            const docs = pdfs(notice.attachments);
            const coverImage = imgs.length > 0 ? imgs[0].url : null;

            return (
              <div
                key={notice._id}
                onClick={() => setSelectedNotice(notice)}
                className={`flex flex-col bg-white rounded-2xl border transition-all duration-300 cursor-pointer group hover:shadow-xl hover:-translate-y-1 ${
                  notice.urgent
                    ? "border-danger-200 shadow-[0_4px_20px_-5px_rgba(239,68,68,0.15)] bg-gradient-to-br from-white to-danger-50/30"
                    : "border-gray-100 shadow-sm hover:border-primary-200"
                }`}
              >
                {/* Notice Cover Image */}
                {coverImage ? (
                  <div className="relative h-48 w-full rounded-t-2xl overflow-hidden shrink-0 border-b border-gray-100">
                    <Image
                      src={coverImage}
                      alt={notice.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4" />
                  </div>
                ) : (
                  <div
                    className={`h-2 w-full rounded-t-2xl shrink-0 ${notice.urgent ? "bg-danger-500" : "bg-primary-500"}`}
                  />
                )}

                <div className="p-5 flex flex-col flex-1">
                  {/* Badges & Actions */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {notice.urgent && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-danger-50 text-danger-700 text-[10px] font-bold uppercase tracking-wider rounded border border-danger-200 shadow-sm">
                          <Icon d={IC.alert} className="w-3 h-3" /> Urgent
                        </span>
                      )}
                      <StatusBadge status={notice.visibility} />
                    </div>

                    {isAdmin && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (
                            confirm(
                              "Are you sure you want to completely delete this notice? This action cannot be undone.",
                            )
                          ) {
                            deleteNotice(notice._id);
                          }
                        }}
                        className="p-1.5 text-gray-400 hover:text-danger-600 hover:bg-danger-50 rounded-lg transition-colors border border-transparent hover:border-danger-100"
                        title="Delete Notice"
                      >
                        <Icon d={IC.trash} className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Content */}
                  <h3
                    className={`font-bold text-lg leading-snug mb-2 group-hover:text-primary-600 transition-colors line-clamp-2 ${!coverImage ? "mt-1" : ""}`}
                  >
                    {notice.title}
                  </h3>
                  <p className="text-sm font-medium text-gray-500 leading-relaxed line-clamp-3 mb-4 flex-1">
                    {notice.message}
                  </p>

                  {/* Footer Meta */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400">
                      <Icon d={IC.calendar} className="w-3.5 h-3.5" />
                      {new Date(notice.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>

                    {(imgs.length > 0 || docs.length > 0) && (
                      <div className="flex items-center gap-2">
                        {imgs.length > 0 && (
                          <div className="flex items-center gap-1 px-1.5 py-0.5 bg-gray-50 border border-gray-100 rounded text-[10px] font-bold text-gray-500">
                            <Icon
                              d={IC.image}
                              className="w-3 h-3 text-gray-400"
                            />
                            {imgs.length}
                          </div>
                        )}
                        {docs.length > 0 && (
                          <div className="flex items-center gap-1 px-1.5 py-0.5 bg-gray-50 border border-gray-100 rounded text-[10px] font-bold text-gray-500">
                            <Icon
                              d={IC.fileText}
                              className="w-3 h-3 text-gray-400"
                            />
                            {docs.length}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {pagination && pagination.pages > 1 && (
        <div className="pt-4">
          <Pagination page={page} pages={pagination.pages} onPage={setPage} />
        </div>
      )}

      {/* Modals */}
      {showModal && (
        <CreateNoticeModal
          onClose={() => setShowModal(false)}
          onSuccess={refetch}
        />
      )}

      {selectedNotice && (
        <NoticeDetailModal
          notice={selectedNotice}
          onClose={() => setSelectedNotice(null)}
        />
      )}
    </div>
  );
}
