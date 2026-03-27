"use client";
import { useState, useRef, useEffect } from "react";
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
          { href: "/carousel", label: "Carousel", icon: IC.image },
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const desktopDropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) => pathname === href;
  const links = user ? getAuthLinks(user.role) : publicLinks;
  
  // Bottom bar uses first 4 links if logged in (to leave room for Profile tab)
  const bottomLinks = user ? links.slice(0, 4) : links.slice(0, 5);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        desktopDropdownRef.current &&
        !desktopDropdownRef.current.contains(target)
      ) {
        setDesktopDropdownOpen(false);
      }
      if (
        mobileDropdownRef.current &&
        !mobileDropdownRef.current.contains(target)
      ) {
        setMobileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDesktopDropdownOpen(false);
    setMobileDropdownOpen(false);
  }, [pathname]);

  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Left Box: Logo */}
            <div className="flex items-center gap-3">
              <Link
                href={user ? "/dashboard" : "/"}
                className="flex items-center gap-2.5 group mr-2"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow shrink-0">
                  <span className="text-white font-bold text-sm">TF</span>
                </div>
                <span className="font-bold text-base text-gray-900">
                  Traders Federation
                </span>
              </Link>
            </div>

            {/* Middle: Desktop nav links */}
            <div className="hidden lg:flex items-center gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
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

            {/* Right side: User Profile / Auth / Mobile Menu Toggle */}
            <div className="flex items-center gap-2 sm:gap-3">
              {user ? (
                <>
                  {/* Desktop Profile (hidden on mobile) */}
                  <div className="hidden md:block relative" ref={desktopDropdownRef}>
                    <button
                      onClick={() => setDesktopDropdownOpen(!desktopDropdownOpen)}
                      className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 bg-white hover:bg-gray-50 border border-gray-200 rounded-full transition-colors"
                    >
                      <div className="w-7 h-7 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-white text-xs font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-semibold text-gray-900 truncate max-w-[120px]">
                          {user.name}
                        </p>
                      </div>
                    </button>

                    {/* Desktop Profile Dropdown */}
                    {desktopDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate mt-0.5">
                            {user.email}
                          </p>
                          <span className="inline-block mt-2 px-2 py-0.5 bg-primary-50 text-primary-700 text-[10px] font-bold uppercase tracking-wider rounded border border-primary-100">
                            {user.role.replace("_", " ")}
                          </span>
                        </div>
                        <div className="p-1">
                          <button
                            onClick={logout}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-danger-600 hover:bg-danger-50 rounded-lg transition-colors font-medium text-left"
                          >
                            <Icon d={IC.logOut} className="w-4 h-4" />
                            Log out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Mobile Menu Toggle (Right Corner) */}
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="lg:hidden p-2 -mr-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors focus:bg-gray-100"
                    aria-label="Toggle menu"
                  >
                    <Icon d={mobileMenuOpen ? IC.close : IC.menu} className="w-6 h-6" />
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-1 sm:gap-2">
                  <Link
                    href="/login"
                    className="px-3 sm:px-3.5 py-2 text-gray-600 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-3 sm:px-3.5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Nav Links Dropdown (Top Bar) */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white animate-in slide-in-from-top-2 duration-200 shadow-sm relative z-40">
            <div className="px-4 py-3 space-y-1 max-h-[70vh] overflow-y-auto">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "bg-primary-50 text-primary-700"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon
                    d={link.icon}
                    className={`w-5 h-5 ${isActive(link.href) ? "text-primary-600" : "text-gray-400"}`}
                  />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* ── Mobile bottom tab bar (md and below) ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 safe-area-pb pb-env">
        <div className="flex items-stretch h-14">
          {bottomLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors ${
                  active
                    ? "text-primary-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <div
                  className={`relative flex items-center justify-center w-6 h-6 ${active ? "text-primary-600" : ""}`}
                >
                  <Icon d={link.icon} className="w-5 h-5" />
                  {active && (
                    <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary-600 rounded-full" />
                  )}
                </div>
                <span
                  className={`text-[10px] font-medium leading-none ${active ? "text-primary-600" : "text-gray-500"}`}
                >
                  {link.label}
                </span>
              </Link>
            );
          })}

          {/* Mobile Profile Tab */}
          {user && (
            <div className="flex-1 relative" ref={mobileDropdownRef}>
              <button
                onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                className={`w-full h-full flex flex-col items-center justify-center gap-1 transition-colors ${
                  mobileDropdownOpen ? "text-primary-600" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="w-5 h-5 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  <span className="text-white text-[9px] font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-medium leading-none ${mobileDropdownOpen ? "text-primary-600" : "text-gray-500"}`}
                >
                  Profile
                </span>
              </button>

              {/* Mobile Profile Dropdown (opens upwards) */}
              {mobileDropdownOpen && (
                <div className="absolute bottom-[calc(100%+8px)] right-3 w-56 bg-white rounded-xl shadow-[0_-5px_25px_-5px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden z-50 animate-in slide-in-from-bottom-2 duration-200">
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {user.email}
                    </p>
                    <span className="inline-block mt-2 px-2 py-0.5 bg-primary-50 text-primary-700 text-[10px] font-bold uppercase tracking-wider rounded border border-primary-100">
                      {user.role.replace("_", " ")}
                    </span>
                  </div>
                  <div className="p-1">
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-danger-600 hover:bg-danger-50 rounded-lg transition-colors font-medium text-left"
                    >
                      <Icon d={IC.logOut} className="w-4 h-4" />
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom bar spacer so content isn't hidden behind it on mobile */}
    </>
  );
}
