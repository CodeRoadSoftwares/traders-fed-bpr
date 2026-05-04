"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { useUser } from "@/hooks/useUser";
import apiClient from "@/lib/axios/apiClient";
import { Shop, Notice } from "@/types";
import HomeCarousel from "@/components/home/HomeCarousel";
import FederationMessage from "@/components/home/FederationMessage";
import HomeStatsBar from "@/components/home/HomeStatsBar";
import {
  NoticesSection,
  ShopsSection,
  VerifyCTA,
  HomeFeatures,
  HowItWorks,
  CTABanner,
  HomeFooter,
} from "@/components/home/HomeSections";

export default function HomePage() {
  const { user } = useUser();
  const [shops, setShops] = useState<Shop[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [stats, setStats] = useState({
    totalShops: 0,
    activeShops: 0,
    totalNotices: 0,
  });
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const noticesRes = await apiClient.get("/notice/get", {
          params: { limit: 4, visibility: "PUBLIC" },
        });

        setNotices(noticesRes.data.data || []);
        setStats((prev) => ({
          ...prev,
          totalNotices: noticesRes.data.pagination?.total || 0,
        }));

        // Only fetch shops if user is admin
        if (isAdmin) {
          const shopsRes = await apiClient.get("/shop/get", {
            params: { status: "ACTIVE", limit: 6 },
          });
          setShops(shopsRes.data.data || []);
          setStats((prev) => ({
            ...prev,
            totalShops: shopsRes.data.pagination?.total || 0,
            activeShops:
              shopsRes.data.data?.filter(
                (s: Shop) => s.certificateStatus === "ACTIVE",
              ).length || 0,
          }));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAdmin]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      <Navbar />
      <HomeCarousel />
      <FederationMessage />
      <HomeStatsBar stats={stats} loading={loading} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 space-y-8 sm:space-y-14">
        <NoticesSection notices={notices} loading={loading} />
        <ShopsSection shops={shops} loading={loading} isAdmin={isAdmin} />
        <VerifyCTA />
      </div>
      <HomeFeatures />
      <HowItWorks />
      {!user && <CTABanner />}
      <HomeFooter isAdmin={isAdmin} />
    </div>
  );
}
