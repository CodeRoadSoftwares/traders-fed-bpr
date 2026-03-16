"use client";
import { useState } from "react";
import { useAdmins } from "@/hooks/useAdmins";
import CreateAdminModal from "./CreateAdminModal";
import {
  Icon,
  IC,
  Sk,
  StatusBadge,
  Pagination,
  Empty,
  Btn,
} from "@/components/ui";

export default function AdminsList() {
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const { admins, pagination, loading, deleteAdmin } = useAdmins(page);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-1">
            Super Admin
          </p>
          <h1 className="text-2xl font-bold text-gray-900">Admin Management</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage federation administrators and their access
          </p>
        </div>
        <Btn onClick={() => setShowModal(true)}>
          <Icon d={IC.plus} className="w-4 h-4" /> Create Admin
        </Btn>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-5 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Sk className="h-10 w-10 rounded-xl" />
                <div className="flex-1 space-y-1.5">
                  <Sk className="h-3.5 w-1/3" />
                  <Sk className="h-3 w-1/4" />
                </div>
                <Sk className="h-5 w-20 rounded-full" />
                <Sk className="h-8 w-16 rounded-lg" />
              </div>
            ))}
          </div>
        ) : admins.length === 0 ? (
          <Empty icon={IC.user} title="No admins found" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  {["Admin", "Email", "Phone", "Role", ""].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {admins.map((admin) => (
                  <tr
                    key={admin._id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {admin.name.charAt(0).toUpperCase()}
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                          {admin.name}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-600">
                      {admin.email}
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-600">
                      {admin.phone}
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={admin.role} />
                    </td>
                    <td className="px-4 py-3.5">
                      {admin.role !== "SUPER_ADMIN" && (
                        <button
                          onClick={() => {
                            if (confirm(`Remove ${admin.name} as admin?`))
                              deleteAdmin(admin._id);
                          }}
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-danger-600 hover:bg-danger-50 transition-colors"
                        >
                          <Icon d={IC.trash} className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pagination && (
        <Pagination page={page} pages={pagination.pages} onPage={setPage} />
      )}
      {showModal && <CreateAdminModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
