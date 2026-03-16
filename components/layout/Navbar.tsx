"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUser";
import { useState } from "react";

export default function Navbar() {
  const { logout } = useAuth();
  const { user } = useUser();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  const publicLinks = [
    { href: "/", label: "Home" },
    { href: "/directory", label: "Directory" },
    { href: "/notices", label: "Notices" },
    { href: "/funds", label: "Funds" },
    { href: "/verify", label: "Verify" },
  ];

  const authLinks = user
    ? [
        { href: "/dashboard", label: "Dashboard" },
        ...(user.role === "SHOP"
          ? [{ href: "/my-shop", label: "My Shop" }]
          : []),
        { href: "/notices", label: "Notices" },
        ...(isAdmin
          ? [
              { href: "/shops", label: "Shops" },
              { href: "/certificates", label: "Certificates" },
              { href: "/funds", label: "Funds" },
            ]
          : []),
        ...(user.role === "SUPER_ADMIN"
          ? [{ href: "/admins", label: "Admins" }]
          : []),
      ]
    : [];

  const allLinks = user ? authLinks : publicLinks;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href={user ? "/dashboard" : "/"}
            className="flex items-center space-x-2 group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <span className="text-white font-bold text-xl">TF</span>
            </div>
            <span className="font-bold text-lg text-gray-900 hidden sm:block">
              Traders Federation
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {allLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-primary-50 text-primary-700"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <div className="hidden sm:flex items-center space-x-3 px-3 py-2 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user.role.toLowerCase().replace("_", " ")}
                    </p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-50"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-1">
              {allLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            {user && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-lg mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user.role.toLowerCase().replace("_", " ")}
                    </p>
                  </div>
                </div>
              </div>
            )}
            {!user && (
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-center text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-center bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg text-sm font-medium shadow-md"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
