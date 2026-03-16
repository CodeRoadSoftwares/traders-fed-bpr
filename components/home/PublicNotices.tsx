"use client";
import { useState, useEffect } from "react";
import apiClient from "@/lib/axios/apiClient";
import { Notice } from "@/types";
import Link from "next/link";

export default function PublicNotices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await apiClient.get("/notice/get", {
          params: { limit: 3 },
        });
        setNotices(response.data.data);
      } catch (error) {
        console.error("Failed to fetch notices:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Latest Notices 📢
            </h2>
            <p className="text-gray-600">
              Stay updated with important announcements
            </p>
          </div>
          <Link
            href="/notices"
            className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 bg-white hover:bg-gray-50 text-primary-600 font-medium rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-200"
          >
            View All
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-lg animate-pulse border border-gray-100"
              >
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : notices.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-gray-100">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📭</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No notices yet
            </h3>
            <p className="text-gray-600">Check back later for updates</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {notices.map((notice) => (
              <div
                key={notice._id}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="flex items-center space-x-2 mb-4">
                  {notice.urgent && (
                    <span className="px-3 py-1 bg-danger-100 text-danger-700 text-xs font-medium rounded-full flex items-center space-x-1">
                      <span>🚨</span>
                      <span>Urgent</span>
                    </span>
                  )}
                  <span className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full">
                    {notice.visibility}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {notice.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                  {notice.message}
                </p>
                <div className="flex items-center text-xs text-gray-500">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {new Date(notice.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
