"use client";
import { useState } from "react";
import { useFunds } from "@/hooks/useFunds";
import CreateFundModal from "./CreateFundModal";
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

export default function FundsList() {
  const [page, setPage] = useState(1);
  const [type, setType] = useState("");
  const [showModal, setShowModal] = useState(false);
  const { funds, pagination, loading, deleteFund } = useFunds({ page, type });

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
      alert("Failed to generate report");
    }
  };

  const income = funds
    .filter((f) => f.type === "INCOME")
    .reduce((s, f) => s + f.amount, 0);
  const expense = funds
    .filter((f) => f.type === "EXPENSE")
    .reduce((s, f) => s + f.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-1">
            Finance
          </p>
          <h1 className="text-2xl font-bold text-gray-900">Funds Management</h1>
          <p className="text-gray-500 text-sm mt-1">
            Track income, expenses, and generate reports
          </p>
        </div>
        <div className="flex gap-2">
          <Btn variant="secondary" onClick={handleReport}>
            <Icon d={IC.download} className="w-4 h-4" /> PDF Report
          </Btn>
          <Btn onClick={() => setShowModal(true)}>
            <Icon d={IC.plus} className="w-4 h-4" /> Add Entry
          </Btn>
        </div>
      </div>

      {/* Summary */}
      {!loading && funds.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: "Income (this page)",
              value: income,
              color: "text-primary-600",
              bg: "bg-primary-50",
            },
            {
              label: "Expense (this page)",
              value: expense,
              color: "text-danger-600",
              bg: "bg-danger-50",
            },
            {
              label: "Net (this page)",
              value: income - expense,
              color:
                income - expense >= 0 ? "text-primary-600" : "text-danger-600",
              bg: income - expense >= 0 ? "bg-primary-50" : "bg-danger-50",
            },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} rounded-xl p-4`}>
              <p className="text-xs text-gray-500 mb-1">{s.label}</p>
              <p className={`text-lg font-bold ${s.color}`}>
                ₹{Math.abs(s.value).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Filter */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none bg-white text-gray-700"
        >
          <option value="">All Entries</option>
          <option value="INCOME">Income Only</option>
          <option value="EXPENSE">Expense Only</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-5 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Sk className="h-8 w-16 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Sk className="h-3.5 w-1/3" />
                  <Sk className="h-3 w-1/4" />
                </div>
                <Sk className="h-4 w-20" />
                <Sk className="h-8 w-8 rounded-lg" />
              </div>
            ))}
          </div>
        ) : funds.length === 0 ? (
          <Empty
            icon={IC.fund}
            title="No fund entries"
            subtitle="Add your first income or expense entry"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  {[
                    "Date",
                    "Type",
                    "Category",
                    "Description",
                    "Amount",
                    "",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {funds.map((fund) => (
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
                    <td className="px-4 py-3.5 text-sm text-gray-600 max-w-xs truncate">
                      {fund.description}
                    </td>
                    <td
                      className={`px-4 py-3.5 text-sm font-semibold ${fund.type === "INCOME" ? "text-primary-600" : "text-danger-600"}`}
                    >
                      {fund.type === "INCOME" ? "+" : "−"}₹
                      {fund.amount.toLocaleString()}
                    </td>
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
      {showModal && <CreateFundModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
