"use client";
import { useState } from "react";
import { useNotices } from "@/hooks/useNotices";
import { Modal, Field, inputCls, Btn, Icon, IC } from "@/components/ui";

export default function CreateNoticeModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const { createNotice } = useNotices();
  const [form, setForm] = useState({
    title: "",
    message: "",
    visibility: "PUBLIC",
    urgent: false,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createNotice(form);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Create Notice" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Title">
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className={inputCls}
            placeholder="Notice title"
          />
        </Field>
        <Field label="Message">
          <textarea
            required
            rows={4}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className={inputCls}
            placeholder="Write the notice content..."
          />
        </Field>
        <Field label="Visibility">
          <select
            value={form.visibility}
            onChange={(e) => setForm({ ...form, visibility: e.target.value })}
            className={inputCls}
          >
            <option value="PUBLIC">Public — visible to everyone</option>
            <option value="SHOPS">
              Shops Only — visible to registered members
            </option>
          </select>
        </Field>
        <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
          <input
            type="checkbox"
            checked={form.urgent}
            onChange={(e) => setForm({ ...form, urgent: e.target.checked })}
            className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
          />
          <div>
            <p className="text-sm font-medium text-gray-700">Mark as Urgent</p>
            <p className="text-xs text-gray-400">
              Sends an email notification to all users
            </p>
          </div>
          {form.urgent && (
            <Icon d={IC.alert} className="w-4 h-4 text-danger-500 ml-auto" />
          )}
        </label>
        <div className="flex gap-3 pt-2">
          <Btn variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Btn>
          <Btn type="submit" disabled={loading} className="flex-1">
            {loading ? "Creating..." : "Create Notice"}
          </Btn>
        </div>
      </form>
    </Modal>
  );
}
