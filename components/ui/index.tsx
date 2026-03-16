"use client";
// Shared UI primitives used across all pages

import { ReactNode } from "react";

// ─── Icon ─────────────────────────────────────────────────────────────────────
export function Icon({
  d,
  className = "w-5 h-5",
}: {
  d: string;
  className?: string;
}) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d={d}
      />
    </svg>
  );
}

export const IC = {
  search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  check:
    "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
  alert:
    "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
  calendar:
    "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  location:
    "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
  phone:
    "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
  mail: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  arrow: "M17 8l4 4m0 0l-4 4m4-4H3",
  arrowLeft: "M7 16l-4-4m0 0l4-4m-4 4h18",
  close: "M6 18L18 6M6 6l12 12",
  plus: "M12 4v16m8-8H4",
  trash:
    "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
  eye: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
  fund: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  shop: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z",
  user: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  shield:
    "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  refresh:
    "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
  download: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4",
  chevronRight: "M9 5l7 7-7 7",
  chevronLeft: "M15 19l-7-7 7-7",
  clock: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  building:
    "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
  notice:
    "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
  check2: "M5 13l4 4L19 7",
  x: "M6 18L18 6M6 6l12 12",
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────
export function Sk({ className }: { className: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

// ─── Page Shell ───────────────────────────────────────────────────────────────
export function PageHeader({
  label,
  title,
  subtitle,
  action,
}: {
  label?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
      <div>
        {label && (
          <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-1">
            {label}
          </p>
        )}
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    ACTIVE: "bg-primary-50 text-primary-700 border border-primary-100",
    PENDING: "bg-warning-50 text-warning-700 border border-warning-100",
    REJECTED: "bg-danger-50 text-danger-700 border border-danger-100",
    EXPIRED: "bg-gray-100 text-gray-600 border border-gray-200",
    PUBLIC: "bg-gray-100 text-gray-600",
    SHOPS: "bg-secondary-50 text-secondary-700",
    INCOME: "bg-primary-50 text-primary-700",
    EXPENSE: "bg-danger-50 text-danger-700",
    ADMIN: "bg-secondary-50 text-secondary-700",
    SUPER_ADMIN: "bg-primary-50 text-primary-700",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${map[status] || "bg-gray-100 text-gray-600"}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

// ─── Modal Shell ──────────────────────────────────────────────────────────────
export function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <Icon d={IC.close} className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ─── Form Field ───────────────────────────────────────────────────────────────
export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

const inputCls =
  "w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white placeholder:text-gray-400";
export { inputCls };

// ─── Btn ──────────────────────────────────────────────────────────────────────
export function Btn({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "danger" | "ghost";
  disabled?: boolean;
  className?: string;
}) {
  const v = {
    primary: "bg-primary-600 hover:bg-primary-700 text-white shadow-sm",
    secondary: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200",
    danger: "bg-danger-50 hover:bg-danger-100 text-danger-700",
    ghost: "text-gray-500 hover:text-gray-700 hover:bg-gray-100",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${v[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────
export function Pagination({
  page,
  pages,
  onPage,
}: {
  page: number;
  pages: number;
  onPage: (p: number) => void;
}) {
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-1 mt-6">
      <button
        onClick={() => onPage(page - 1)}
        disabled={page === 1}
        className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <Icon d={IC.chevronLeft} className="w-4 h-4" />
      </button>
      {Array.from({ length: Math.min(5, pages) }, (_, i) => {
        let p = i + 1;
        if (pages > 5) {
          if (page <= 3) p = i + 1;
          else if (page >= pages - 2) p = pages - 4 + i;
          else p = page - 2 + i;
        }
        return (
          <button
            key={p}
            onClick={() => onPage(p)}
            className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${page === p ? "bg-primary-600 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
          >
            {p}
          </button>
        );
      })}
      <button
        onClick={() => onPage(page + 1)}
        disabled={page === pages}
        className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <Icon d={IC.chevronRight} className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
export function Empty({
  icon,
  title,
  subtitle,
}: {
  icon: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
        <Icon d={icon} className="w-7 h-7 text-gray-400" />
      </div>
      <p className="font-medium text-gray-700">{title}</p>
      {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-white rounded-xl border border-gray-100 ${className}`}>
      {children}
    </div>
  );
}

// ─── Spinner ──────────────────────────────────────────────────────────────────
export function Spinner() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-8 h-8 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
    </div>
  );
}
