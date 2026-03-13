"use client";
import { useState } from "react";
import { useAdmins } from "@/hooks/useAdmins";
import CreateAdminModal from "./CreateAdminModal";

export default function AdminsList() {
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const { admins, pagination, loading, deleteAdmin } = useAdmins(page);

  const handleDelete = async (id: string) => {
    if (confirm("Delete this admin?")) {
      await deleteAdmin(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Admins Management</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg"
        >
          Create Admin
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {admins.map((admin) => (
                  <tr key={admin._id}>
                    <td className="px-4 py-3 text-sm">{admin.name}</td>
                    <td className="px-4 py-3 text-sm">{admin.email}</td>
                    <td className="px-4 py-3 text-sm">{admin.phone}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 text-xs rounded-full bg-primary-100 text-primary-700">
                        {admin.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {admin.role !== "SUPER_ADMIN" && (
                        <button
                          onClick={() => handleDelete(admin._id)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination && pagination.pages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
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
      </div>

      {showModal && <CreateAdminModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
