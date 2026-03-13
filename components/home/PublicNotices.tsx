"use client";
import { useState, useEffect } from "react";
import apiClient from "@/lib/axios/apiClient";
import { Notice } from "@/types";
import Link from "next/link";

export default function PublicNotices() {
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await apiClient.get("/notice/get", {
          params: { limit: 3 },
        });
        setNotices(response.data.data);
      } catch (error) {
        console.error("Failed to fetch notices:", error);
      }
    };

    fetchNotices();
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Latest Notices</h2>
          <Link
            href="/notices"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {notices.map((notice) => (
            <div key={notice._id} className="bg-white rounded-lg shadow p-6">
              {notice.urgent && (
                <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full mb-2 inline-block">
                  Urgent
                </span>
              )}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {notice.title}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-3">
                {notice.message}
              </p>
              <p className="text-gray-500 text-xs mt-4">
                {new Date(notice.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
