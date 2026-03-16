"use client";
import { useState } from "react";
import { useNotices } from "@/hooks/useNotices";
import { useUser } from "@/hooks/useUser";
import CreateNoticeModal from "./CreateNoticeModal";
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
  const { notices, pagination, loading, deleteNotice } = useNotices({ page });
  const { user } = useUser();
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-1">
            Announcements
          </p>
          <h1 className="text-2xl font-bold text-gray-900">Notices</h1>
          <p className="text-gray-500 text-sm mt-1">
            Official announcements from the Traders Federation
          </p>
        </div>
        {isAdmin && (
          <Btn onClick={() => setShowModal(true)}>
            <Icon d={IC.plus} className="w-4 h-4" /> New Notice
          </Btn>
        )}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-100 p-5 space-y-3"
            >
              <div className="flex gap-2">
                <Sk className="h-5 w-14 rounded-full" />
                <Sk className="h-5 w-10 rounded-full" />
              </div>
              <Sk className="h-5 w-2/3" />
              <Sk className="h-3 w-full" />
              <Sk className="h-3 w-4/5" />
            </div>
          ))}
        </div>
      ) : notices.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100">
          <Empty
            icon={IC.notice}
            title="No notices yet"
            subtitle="Check back later for updates"
          />
        </div>
      ) : (
        <div className="space-y-3">
          {notices.map((notice) => (
            <div
              key={notice._id}
              className={`bg-white rounded-xl border p-5 hover:shadow-sm transition-shadow ${notice.urgent ? "border-l-4 border-l-danger-500 border-gray-100" : "border-gray-100"}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {notice.urgent && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-danger-50 text-danger-700 text-xs font-medium rounded-full border border-danger-100">
                        <Icon d={IC.alert} className="w-3 h-3" /> Urgent
                      </span>
                    )}
                    <StatusBadge status={notice.visibility} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {notice.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {notice.message}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-3">
                    <Icon d={IC.calendar} className="w-3.5 h-3.5" />
                    {new Date(notice.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                </div>
                {isAdmin && (
                  <Btn
                    variant="danger"
                    onClick={() => {
                      if (confirm("Delete this notice?"))
                        deleteNotice(notice._id);
                    }}
                    className="shrink-0"
                  >
                    <Icon d={IC.trash} className="w-4 h-4" />
                  </Btn>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {pagination && (
        <Pagination page={page} pages={pagination.pages} onPage={setPage} />
      )}
      {showModal && <CreateNoticeModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
