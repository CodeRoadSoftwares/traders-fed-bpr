"use client";
import { useState, useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import { useFunds } from "@/hooks/useFunds";
import CreateFundModal from "@/components/funds/CreateFundModal";
import {
  Icon,
  IC,
  Sk,
  StatusBadge,
  Pagination,
  Empty,
  Btn,
  ConfirmDialog,
} from "@/components/ui";
import apiClient from "@/lib/axios/apiClient";
import { showToast } from "@/lib/toast";

export default function FundsDashboard() {
  const { user } = useUser();
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
  const isShop = user?.role === "SHOP";
  const [page, setPage] = useState(1);
  const [type, setType] = useState("");
  const [search, setSearch] = useState("");
  const [sortAmount, setSortAmount] = useState<"" | "asc" | "desc">("");
  const [showModal, setShowModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [myContributions, setMyContributions] = useState<{
    totalAmount: number;
    contributions: unknown[];
  } | null>(null);
  const [contributionsLoading, setContributionsLoading] = useState(false);
  const { funds, pagination, loading, deleteFund, refetch } = useFunds({
    page,
    type,
    limit: 15,
  });

  useEffect(() => {
    if (!isShop) return;

    const fetchContributions = async () => {
      try {
        setContributionsLoading(true);
        const res = await apiClient.get("/fund/my-contributions");
        setMyContributions(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setContributionsLoading(false);
      }
    };

    fetchContributions();
  }, [isShop]);

  const filtered = funds.filter((f) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      f.category?.toLowerCase().includes(q) ||
      f.description?.toLowerCase().includes(q)
    );
  });

  const sorted = sortAmount
    ? [...filtered].sort((a, b) =>
        sortAmount === "asc" ? a.amount - b.amount : b.amount - a.amount,
      )
    : filtered;

  const income = funds
    .filter((f) => f.type === "INCOME")
    .reduce((s, f) => s + f.amount, 0);
  const expense = funds
    .filter((f) => f.type === "EXPENSE")
    .reduce((s, f) => s + f.amount, 0);
  const balance = income - expense;

  const handleReport = async () => {
    try {
      const r = await apiClient.get("/fund/report/pdf", {
        responseType: "blob",
      });
      const url = URL.createObjectURL(
        new Blob([r.data], { type: "application/pdf" }),
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = "funds-report.pdf";
      a.click();
    } catch {
      showToast.error("Failed to generate report");
    }
  };

  const handleCsvExport = async () => {
    try {
      const r = await apiClient.get("/fund/get", {
        params: { type: type || undefined, limit: 10000, page: 1 },
      });
      const all: typeof funds = r.data.data || [];
      const rows = [
        ["Date", "Type", "Category", "Description", "Amount"],
        ...all.map((f) => [
          new Date(f.date).toLocaleDateString("en-IN"),
          f.type,
          f.category,
          `"${(f.description || "").replace(/"/g, '""')}"`,
          f.amount,
        ]),
      ];
      const csv = rows.map((r) => r.join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `funds-${type || "all"}-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      showToast.error("Failed to export CSV");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      {/* Compact header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Funds</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCsvExport}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Export CSV"
          >
            <Icon d={IC.download} className="w-4 h-4" />
          </button>
          {isAdmin && (
            <>
              <button
                onClick={handleReport}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="PDF Report"
              >
                <Icon d={IC.fileText} className="w-4 h-4" />
              </button>
              <Btn
                onClick={() => setShowModal(true)}
                className="!py-2 !px-3 text-sm"
              >
                <Icon d={IC.plus} className="w-4 h-4" />
                <span className="hidden sm:inline">Add Entry</span>
              </Btn>
            </>
          )}
        </div>
      </div>

      {/* Stats strip — horizontal scroll on mobile */}
      <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 scrollbar-none mb-4">
        {[
          {
            label: "Income",
            value: income,
            color: "text-primary-600",
            bg: "bg-primary-50",
            border: "border-primary-100",
          },
          {
            label: "Expense",
            value: expense,
            color: "text-danger-600",
            bg: "bg-danger-50",
            border: "border-danger-100",
          },
          {
            label: "Balance",
            value: balance,
            color: balance >= 0 ? "text-primary-600" : "text-danger-600",
            bg: balance >= 0 ? "bg-primary-50" : "bg-danger-50",
            border: balance >= 0 ? "border-primary-100" : "border-danger-100",
          },
        ].map((s) => (
          <div
            key={s.label}
            className={`${s.bg} border ${s.border} rounded-xl p-4 shrink-0 w-40 sm:w-auto`}
          >
            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
            {loading ? (
              <Sk className="h-6 w-20" />
            ) : (
              <p className={`text-xl font-bold ${s.color} tabular-nums`}>
                {balance < 0 && s.label === "Balance" ? "−" : ""}₹
                {Math.abs(s.value).toLocaleString("en-IN")}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* My contributions (shop users) */}
      {isShop && (
        <div className="flex items-center gap-3 bg-primary-50 border border-primary-100 rounded-xl px-4 py-3 mb-4">
          <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center text-primary-600 shrink-0">
            <Icon d={IC.fund} className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Your Contributions</p>
            {contributionsLoading ? (
              <Sk className="h-5 w-20 mt-1" />
            ) : (
              <p className="text-lg font-bold text-primary-600">
                ₹{myContributions?.totalAmount.toLocaleString("en-IN") || 0}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Public notice */}
      {!user && (
        <div className="flex items-start gap-2 px-3 py-2.5 bg-primary-50 border border-primary-100 rounded-xl text-xs text-primary-700 mb-4">
          <Icon d={IC.shield} className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          Public transparency record — all federation income and expenses are
          listed here.
        </div>
      )}

      {/* Search + filters row */}
      <div className="flex gap-2 mb-2">
        <div className="relative flex-1">
          <Icon
            d={IC.search}
            className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500 text-gray-700 placeholder-gray-400"
          />
        </div>
        <select
          value={sortAmount}
          onChange={(e) => setSortAmount(e.target.value as "" | "asc" | "desc")}
          className="px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500 text-gray-700"
        >
          <option value="">Date</option>
          <option value="desc">High → Low</option>
          <option value="asc">Low → High</option>
        </select>
      </div>

      {/* Type filter chips */}
      <div className="flex gap-2 mb-3">
        {(
          [
            ["", "All"],
            ["INCOME", "Income"],
            ["EXPENSE", "Expense"],
          ] as const
        ).map(([val, label]) => (
          <button
            key={val}
            onClick={() => {
              setType(val);
              setPage(1);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors ${type === val ? "bg-primary-600 text-white border-primary-600" : "bg-white text-gray-600 border-gray-200"}`}
          >
            {label}
          </button>
        ))}
        {pagination && !loading && (
          <span className="ml-auto text-xs text-gray-400 self-center">
            {pagination.total} entries
          </span>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-4 space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Sk className="h-5 w-14 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Sk className="h-3.5 w-1/3" />
                  <Sk className="h-3 w-1/4" />
                </div>
                <Sk className="h-4 w-20" />
              </div>
            ))}
          </div>
        ) : funds.length === 0 ? (
          <Empty
            icon={IC.fund}
            title="No fund entries"
            subtitle={
              type
                ? `No ${type.toLowerCase()} entries found`
                : "No entries recorded yet"
            }
          />
        ) : sorted.length === 0 ? (
          <Empty
            icon={IC.fund}
            title="No results"
            subtitle={`No entries match "${search}"`}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  {["Date", "Type", "Category", "Shop", "Description"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide"
                      >
                        {h}
                      </th>
                    ),
                  )}
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    <button
                      onClick={() =>
                        setSortAmount((s) =>
                          s === "desc" ? "asc" : s === "asc" ? "" : "desc",
                        )
                      }
                      className="flex items-center gap-1 hover:text-gray-800"
                    >
                      Amount{" "}
                      <span className="text-gray-300">
                        {sortAmount === "desc"
                          ? "↓"
                          : sortAmount === "asc"
                            ? "↑"
                            : "↕"}
                      </span>
                    </button>
                  </th>
                  {isAdmin && <th className="px-4 py-3" />}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {sorted.map((fund) => (
                  <tr
                    key={fund._id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-4 py-3.5 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(fund.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={fund.type} />
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-700">
                      {fund.category}
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-600">
                      {fund.shopUser &&
                      typeof fund.shopUser === "object" &&
                      "shopName" in fund.shopUser ? (
                        <span className="text-primary-600 font-medium">
                          {(fund.shopUser as { shopName: string }).shopName}
                        </span>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-600 max-w-xs">
                      <span className="line-clamp-1">{fund.description}</span>
                    </td>
                    <td
                      className={`px-4 py-3.5 text-sm font-semibold tabular-nums ${fund.type === "INCOME" ? "text-primary-600" : "text-danger-600"}`}
                    >
                      {fund.type === "INCOME" ? "+" : "−"}₹
                      {fund.amount.toLocaleString("en-IN")}
                    </td>
                    {isAdmin && (
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => setConfirmDelete(fund._id)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-danger-600 hover:bg-danger-50 transition-colors"
                        >
                          <Icon d={IC.trash} className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pagination && (
        <Pagination page={page} pages={pagination.pages} onPage={setPage} />
      )}

      {showModal && (
        <CreateFundModal
          onClose={() => setShowModal(false)}
          onSuccess={refetch}
        />
      )}

      {confirmDelete && (
        <ConfirmDialog
          title="Delete Entry"
          message="Delete this fund entry? This cannot be undone."
          confirmLabel="Delete"
          danger
          onConfirm={() => {
            deleteFund(confirmDelete);
            setConfirmDelete(null);
          }}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}
