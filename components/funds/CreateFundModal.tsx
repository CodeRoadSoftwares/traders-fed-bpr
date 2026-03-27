"use client";
import { useState, useEffect, useRef } from "react";
import { useFunds } from "@/hooks/useFunds";
import { Modal, Field, inputCls, Btn, Icon, IC } from "@/components/ui";
import apiClient from "@/lib/axios/apiClient";

interface Shop {
  _id: string;
  shopName: string;
  userId: {
    _id: string;
    name: string;
  };
}

export default function CreateFundModal({ onClose }: { onClose: () => void }) {
  const { createFund } = useFunds();
  const [form, setForm] = useState({
    type: "INCOME",
    category: "",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    shopUser: "",
  });
  const [loading, setLoading] = useState(false);
  const [shopSearch, setShopSearch] = useState("");
  const [shops, setShops] = useState<Shop[]>([]);
  const [shopPage, setShopPage] = useState(1);
  const [shopTotal, setShopTotal] = useState(0);
  const [shopLoading, setShopLoading] = useState(false);
  const [showShopDropdown, setShowShopDropdown] = useState(false);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (form.type === "INCOME" && showShopDropdown) {
      fetchShops();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopSearch, shopPage, form.type, showShopDropdown]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowShopDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchShops = async () => {
    setShopLoading(true);
    try {
      const res = await apiClient.get("/fund/shops", {
        params: { page: shopPage, limit: 10, search: shopSearch },
      });
      setShops(res.data.data);
      setShopTotal(res.data.pagination.total);
    } catch (error) {
      console.error("Failed to fetch shops", error);
    } finally {
      setShopLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createFund({
        type: form.type,
        category: form.category,
        amount: Number(form.amount),
        description: form.description,
        date: new Date(form.date).toISOString(),
        shopUser:
          form.type === "INCOME" && form.shopUser ? form.shopUser : undefined,
      });
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleShopSelect = (shop: Shop) => {
    setSelectedShop(shop);
    setForm({ ...form, shopUser: shop.userId._id });
    setShowShopDropdown(false);
    setShopSearch("");
  };

  const handleTypeChange = (type: string) => {
    setForm({ ...form, type, shopUser: "" });
    setSelectedShop(null);
    setShopSearch("");
  };

  return (
    <Modal title="Add Fund Entry" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Type">
          <div className="grid grid-cols-2 gap-2">
            {["INCOME", "EXPENSE"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => handleTypeChange(t)}
                className={`py-2.5 rounded-lg text-sm font-medium border transition-colors ${form.type === t ? (t === "INCOME" ? "bg-primary-600 text-white border-primary-600" : "bg-danger-600 text-white border-danger-600") : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}
              >
                {t === "INCOME" ? "Income" : "Expense"}
              </button>
            ))}
          </div>
        </Field>

        {form.type === "INCOME" && (
          <Field label="Shop (Optional)">
            <div className="relative" ref={dropdownRef}>
              <div
                className={`${inputCls} cursor-pointer flex items-center justify-between`}
                onClick={() => setShowShopDropdown(!showShopDropdown)}
              >
                <span
                  className={selectedShop ? "text-gray-900" : "text-gray-400"}
                >
                  {selectedShop
                    ? selectedShop.shopName
                    : "Select shop (optional)"}
                </span>
                <Icon d={IC.chevronDown} className="w-4 h-4 text-gray-400" />
              </div>

              {showShopDropdown && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-hidden">
                  <div className="p-2 border-b border-gray-100">
                    <input
                      type="text"
                      placeholder="Search shops..."
                      value={shopSearch}
                      onChange={(e) => {
                        setShopSearch(e.target.value);
                        setShopPage(1);
                      }}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>

                  <div className="max-h-60 overflow-y-auto">
                    {shopLoading ? (
                      <div className="p-4 text-center text-sm text-gray-500">
                        Loading...
                      </div>
                    ) : shops.length === 0 ? (
                      <div className="p-4 text-center text-sm text-gray-500">
                        No shops found
                      </div>
                    ) : (
                      shops.map((shop) => (
                        <button
                          key={shop._id}
                          type="button"
                          onClick={() => handleShopSelect(shop)}
                          className="w-full px-3 py-2.5 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                        >
                          <p className="text-sm font-medium text-gray-900">
                            {shop.shopName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {shop.userId.name}
                          </p>
                        </button>
                      ))
                    )}
                  </div>

                  {shopTotal > 10 && (
                    <div className="p-2 border-t border-gray-100 flex items-center justify-between text-xs">
                      <button
                        type="button"
                        onClick={() => setShopPage((p) => Math.max(1, p - 1))}
                        disabled={shopPage === 1}
                        className="px-2 py-1 text-primary-600 disabled:text-gray-400"
                      >
                        Previous
                      </button>
                      <span className="text-gray-500">
                        Page {shopPage} of {Math.ceil(shopTotal / 10)}
                      </span>
                      <button
                        type="button"
                        onClick={() => setShopPage((p) => p + 1)}
                        disabled={shopPage >= Math.ceil(shopTotal / 10)}
                        className="px-2 py-1 text-primary-600 disabled:text-gray-400"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              )}

              {selectedShop && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedShop(null);
                    setForm({ ...form, shopUser: "" });
                  }}
                  className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <Icon d={IC.close} className="w-4 h-4" />
                </button>
              )}
            </div>
          </Field>
        )}

        <Field label="Category">
          <input
            type="text"
            required
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className={inputCls}
            placeholder="e.g. Registration Fee, Office Supplies"
          />
        </Field>
        <Field label="Amount (₹)">
          <input
            type="number"
            required
            min="1"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className={inputCls}
            placeholder="0"
          />
        </Field>
        <Field label="Description">
          <textarea
            required
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className={inputCls}
            placeholder="Brief description of this entry"
          />
        </Field>
        <Field label="Date">
          <input
            type="date"
            required
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className={inputCls}
          />
        </Field>
        <div className="flex gap-3 pt-2">
          <Btn variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Btn>
          <Btn type="submit" disabled={loading} className="flex-1">
            {loading ? "Saving..." : "Save Entry"}
          </Btn>
        </div>
      </form>
    </Modal>
  );
}
