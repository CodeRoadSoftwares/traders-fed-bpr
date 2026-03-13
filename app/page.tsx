import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import PublicNotices from "@/components/home/PublicNotices";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="text-xl font-bold text-primary-700">
              Traders Federation
            </div>
            <div className="flex gap-4">
              <Link
                href="/directory"
                className="text-gray-700 hover:text-primary-600 px-3 py-2"
              >
                Directory
              </Link>
              <Link
                href="/verify"
                className="text-gray-700 hover:text-primary-600 px-3 py-2"
              >
                Verify Certificate
              </Link>
              <Link
                href="/notices"
                className="text-gray-700 hover:text-primary-600 px-3 py-2"
              >
                Notices
              </Link>
              <Link
                href="/login"
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <Hero />
      <Features />
      <PublicNotices />

      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>© 2026 Traders Federation. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
