"use client";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUser";

export default function Navbar() {
  const { logout } = useAuth();
  const { user } = useUser();

  if (!user) return null;

  const isAdmin = user.role === "ADMIN" || user.role === "SUPER_ADMIN";

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link
              href="/dashboard"
              className="text-xl font-bold text-primary-700"
            >
              Traders Federation
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-primary-600 px-3 py-2"
              >
                Dashboard
              </Link>
              {user.role === "SHOP" && (
                <Link
                  href="/my-shop"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2"
                >
                  My Shop
                </Link>
              )}
              <Link
                href="/notices"
                className="text-gray-700 hover:text-primary-600 px-3 py-2"
              >
                Notices
              </Link>
              <Link
                href="/directory"
                className="text-gray-700 hover:text-primary-600 px-3 py-2"
              >
                Directory
              </Link>
              {isAdmin && (
                <>
                  <Link
                    href="/shops"
                    className="text-gray-700 hover:text-primary-600 px-3 py-2"
                  >
                    Shops
                  </Link>
                  <Link
                    href="/certificates"
                    className="text-gray-700 hover:text-primary-600 px-3 py-2"
                  >
                    Certificates
                  </Link>
                  <Link
                    href="/funds"
                    className="text-gray-700 hover:text-primary-600 px-3 py-2"
                  >
                    Funds
                  </Link>
                </>
              )}
              {user.role === "SUPER_ADMIN" && (
                <Link
                  href="/admins"
                  className="text-gray-700 hover:text-primary-600 px-3 py-2"
                >
                  Admins
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">{user.name}</span>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
