"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUser";
import { Icon, IC } from "@/components/ui";

const HOME_ICON =
  "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6";

// Nav link definitions with icons
const publicLinks = [
  { href: "/", label: "Home", icon: HOME_ICON },
  { href: "/directory", label: "Directory", icon: IC.building },
  { href: "/notices", label: "Notices", icon: IC.notice },
  { href: "/funds", label: "Funds", icon: IC.fund },
  { href: "/verify", label: "Verify", icon: IC.shield },
];

function getAuthLinks(role: string) {
  const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";
  return [
    { href: "/dashboard", label: "Dashboard", icon: HOME_ICON },
    ...(role === "SHOP"
      ? [{ href: "/my-shop", label: "My Shop", icon: IC.shop }]
      : []),
    { href: "/notices", label: "Notices", icon: IC.notice },
    ...(isAdmin
      ? [
          { href: "/shops", label: "Shops", icon: IC.shop },
          { href: "/certificates", label: "Certificates", icon: IC.check },
          { href: "/funds", label: "Funds", icon: IC.fund },
        ]
      : [{ href: "/funds", label: "Funds", icon: IC.fund }]),
    ...(role === "SUPER_ADMIN"
      ? [{ href: "/admins", label: "Admins", icon: IC.user }]
      : []),
  ];
}

export default function Navbar() {
  const { logout } = useAuth();
  const { user } = useUser();
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;
  const links = user ? getAuthLinks(user.role) : publicLinks;
  // Bottom bar shows max 5 items
  const bottomLinks = links.slice(0, 5);

  return (
    <>
      {/* ── Top bar ── */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
              href={user ? "/dashboard" : "/"}
              className="flex items-center gap-2.5 group"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow shrink-0">
                <span className="text-white font-bold text-sm">TF</span>
              </div>
              <span className="font-bold text-base text-gray-900 hidden sm:block">
                Traders Federation
              </span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-0.5">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon d={link.icon} className="w-4 h-4" />
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {user ? (
                <>
                  <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="w-7 h-7 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-white text-xs font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm leading-tight">
                      <p className="font-medium text-gray-900 text-xs">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-400 capitalize">
                        {user.role.toLowerCase().replace("_", " ")}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Icon d={IC.x} className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-3.5 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-3.5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                  >
                    Register
                  </Link>
                </div>
              )}
              {/* Mobile login/register — only shown when logged out */}
              {!user && (
                <div className="flex sm:hidden items-center gap-1.5">
                  <Link
                    href="/login"
                    className="px-3 py-1.5 text-gray-600 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-3 py-1.5 bg-primary-600 text-white rounded-lg text-sm font-medium"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile bottom tab bar (md and below) ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-area-pb">
        <div className="flex items-stretch">
          {bottomLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 transition-colors ${
                  active
                    ? "text-primary-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <div
                  className={`relative flex items-center justify-center w-6 h-6 ${active ? "text-primary-600" : ""}`}
                >
                  <Icon d={link.icon} className="w-5 h-5" />
                  {active && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary-600 rounded-full" />
                  )}
                </div>
                <span
                  className={`text-[10px] font-medium leading-none ${active ? "text-primary-600" : "text-gray-400"}`}
                >
                  {link.label}
                </span>
              </Link>
            );
          })}
          {/* Logout tab for logged-in users */}
          {user && (
            <button
              onClick={logout}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 text-gray-400 hover:text-danger-500 transition-colors"
            >
              <Icon d={IC.x} className="w-5 h-5" />
              <span className="text-[10px] font-medium leading-none">
                Logout
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom bar spacer so content isn't hidden behind it on mobile */}
      <div className="md:hidden h-16" />
    </>
  );
}
