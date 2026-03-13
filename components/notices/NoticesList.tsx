"use client";
import { useState } from "react";
import { useNotices } from "@/hooks/useNotices";
import { useUser } from "@/hooks/useUser";
import CreateNoticeModal from "./CreateNoticeModal";

export default function NoticesList() {
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const { notices, pagination, loading, deleteNotice } = useNotices({ page });
  const { user } = useUser();

  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  const handleDelete = async (id: string) => {
    if (confirm("Delete this notice?")) {
      await deleteNotice(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Notices</h1>
        {isAdmin && (
          <button
            onClick={() => setShowModal(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg"
          >
            Create Notice
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="space-y-4">
          {notices.map((notice) => (
            <div key={notice._id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {notice.title}
                    </h3>
                    {notice.urgent && (
                      <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">
                        Urgent
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 mb-4">{notice.message}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>
                      {new Date(notice.createdAt).toLocaleDateString()}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 rounded">
                      {notice.visibility}
                    </span>
                  </div>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(notice._id)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {page} of {pagination.pages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === pagination.pages}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {showModal && <CreateNoticeModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
