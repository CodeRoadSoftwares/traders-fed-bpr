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
} from "@/components/ui";
import apiClient from "@/lib/axios/apiClient";
import { showToast } from "@/lib/toast";

function SummaryCards({
  income,
  expense,
  loading,
}: {
  income: number;
  expense: number;
  loading: boolean;
}) {
  const balance = income - expense;
  const items = [
    {
      label: "Total Income",
      value: income,
      color: "text-primary-600",
      bg: "bg-primary-50",
      border: "border-primary-100",
      icon: IC.fund,
    },
    {
      label: "Total Expense",
      value: expense,
      color: "text-danger-600",
      bg: "bg-danger-50",
      border: "border-danger-100",
      icon: IC.fund,
    },
    {
      label: "Net Balance",
      value: balance,
      color: balance >= 0 ? "text-primary-600" : "text-danger-600",
      bg: balance >= 0 ? "bg-primary-50" : "bg-danger-50",
      border: balance >= 0 ? "border-primary-100" : "border-danger-100",
      icon: IC.fund,
    },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {items.map((s) => (
        <div
          key={s.label}
          className={`${s.bg} border ${s.border} rounded-xl p-5`}
        >
          <div
            className={`w-9 h-9 bg-white rounded-lg flex items-center justify-center mb-3 ${s.color}`}
          >
            <Icon d={s.icon} className="w-4.5 h-4.5" />
          </div>
          <p className="text-xs text-gray-500 mb-1">{s.label}</p>
          {loading ? (
            <Sk className="h-7 w-24" />
          ) : (
            <p className={`text-2xl font-bold ${s.color}`}>
              {balance < 0 && s.label === "Net Balance" ? "−" : ""}₹
              {Math.abs(s.value).toLocaleString("en-IN")}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export default function FundsDashboard() {
  const { user } = useUser();
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
  const isShop = user?.role === "SHOP";
  const [page, setPage] = useState(1);
  const [type, setType] = useState("");
  const [search, setSearch] = useState("");
  const [sortAmount, setSortAmount] = useState<"" | "asc" | "desc">("");
  const [showModal, setShowModal] = useState(false);
  const [myContributions, setMyContributions] = useState<{
    totalAmount: number;
    contributions: typeof funds;
  } | null>(null);
  const [contributionsLoading, setContributionsLoading] = useState(false);
  const { funds, pagination, loading, deleteFund, refetch } = useFunds({
    page,
    type,
    limit: 15,
  });

  useEffect(() => {
    if (isShop) {
      fetchMyContributions();
    }
  }, [isShop]);

  const fetchMyContributions = async () => {
    setContributionsLoading(true);
    try {
      const res = await apiClient.get("/fund/my-contributions");
      setMyContributions(res.data);
    } catch (error) {
      console.error("Failed to fetch contributions", error);
    } finally {
      setContributionsLoading(false);
    }
  };

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
      // Fetch all entries for current type filter (no pagination)
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-1">
            Transparency
          </p>
          <h1 className="text-2xl font-bold text-gray-900">Funds Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            {isAdmin
              ? "Manage income and expense entries, generate reports"
              : "Complete record of federation income and expenditure — updated in real time"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Btn variant="secondary" onClick={handleCsvExport}>
            <Icon d={IC.download} className="w-4 h-4" /> CSV Export
          </Btn>
          {isAdmin && (
            <>
              <Btn variant="secondary" onClick={handleReport}>
                <Icon d={IC.download} className="w-4 h-4" /> PDF Report
              </Btn>
              <Btn onClick={() => setShowModal(true)}>
                <Icon d={IC.plus} className="w-4 h-4" /> Add Entry
              </Btn>
            </>
          )}
        </div>
      </div>

      {!user && (
        <div className="flex items-start gap-3 px-4 py-3.5 bg-primary-50 border border-primary-100 rounded-xl text-sm text-primary-700 mb-6">
          <Icon d={IC.shield} className="w-4 h-4 shrink-0 mt-0.5" />
          <p>
            This is a public transparency record. All income and expenses of the
            Traders Federation are listed here for member and public
            accountability.
          </p>
        </div>
      )}

      <div className="mb-6">
        <SummaryCards income={income} expense={expense} loading={loading} />
      </div>

      {isShop && (
        <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl border border-primary-200 p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary-600 shrink-0">
              <Icon d={IC.fund} className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                Your Contributions
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Total amount you have contributed to the federation
              </p>
              {contributionsLoading ? (
                <Sk className="h-8 w-32" />
              ) : (
                <p className="text-3xl font-bold text-primary-600">
                  ₹{myContributions?.totalAmount.toLocaleString("en-IN") || 0}
                </p>
              )}
              {myContributions && myContributions.contributions.length > 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  {myContributions.contributions.length} contribution
                  {myContributions.contributions.length > 1 ? "s" : ""} recorded
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4 flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <Icon
            d={IC.search}
            className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search category or description…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white text-gray-700 placeholder-gray-400"
          />
        </div>

        {/* Type filter */}
        <div className="flex gap-2 shrink-0">
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
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${type === val ? "bg-primary-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Sort by amount */}
        <select
          value={sortAmount}
          onChange={(e) => setSortAmount(e.target.value as "" | "asc" | "desc")}
          className="shrink-0 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white text-gray-700"
        >
          <option value="">Sort: Date</option>
          <option value="desc">Amount: High → Low</option>
          <option value="asc">Amount: Low → High</option>
        </select>

        {pagination && !loading && (
          <p className="text-xs text-gray-400 shrink-0">
            {search ? `${sorted.length} of ` : ""}
            {pagination.total} entries
          </p>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-5 space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Sk className="h-6 w-16 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Sk className="h-3.5 w-1/3" />
                  <Sk className="h-3 w-1/4" />
                </div>
                <Sk className="h-4 w-24" />
                {isAdmin && <Sk className="h-7 w-7 rounded-lg" />}
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
                      className="flex items-center gap-1 hover:text-gray-800 transition-colors"
                    >
                      Amount
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
                          {fund.shopUser.shopName}
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
                          onClick={() => {
                            if (confirm("Delete this entry?"))
                              deleteFund(fund._id);
                          }}
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

      {!user && (
        <p className="text-center text-xs text-gray-400 mt-8">
          Data is maintained by federation administrators. For queries, contact
          your local federation office.
        </p>
      )}

      {showModal && (
        <CreateFundModal
          onClose={() => setShowModal(false)}
          onSuccess={refetch}
        />
      )}
    </div>
  );
}
