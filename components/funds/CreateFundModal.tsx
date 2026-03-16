"use client";
import { useState } from "react";
import { useFunds } from "@/hooks/useFunds";
import { Modal, Field, inputCls, Btn } from "@/components/ui";

export default function CreateFundModal({ onClose }: { onClose: () => void }) {
  const { createFund } = useFunds();
  const [form, setForm] = useState({
    type: "INCOME",
    category: "",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createFund({
        ...form,
        amount: Number(form.amount),
        date: new Date(form.date).toISOString(),
      });
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
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
                onClick={() => setForm({ ...form, type: t })}
                className={`py-2.5 rounded-lg text-sm font-medium border transition-colors ${form.type === t ? (t === "INCOME" ? "bg-primary-600 text-white border-primary-600" : "bg-danger-600 text-white border-danger-600") : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}
              >
                {t === "INCOME" ? "Income" : "Expense"}
              </button>
            ))}
          </div>
        </Field>
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
