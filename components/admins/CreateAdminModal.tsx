"use client";
import { useState } from "react";
import { useAdmins } from "@/hooks/useAdmins";
import { Modal, Field, inputCls, Btn } from "@/components/ui";

export default function CreateAdminModal({ onClose }: { onClose: () => void }) {
  const { createAdmin } = useAdmins();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createAdmin({ ...form, phone: Number(form.phone) });
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Create Admin" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Full Name">
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputCls}
            placeholder="Admin name"
          />
        </Field>
        <Field label="Email Address">
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={inputCls}
            placeholder="admin@example.com"
          />
        </Field>
        <Field label="Phone Number">
          <input
            type="tel"
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className={inputCls}
            placeholder="10-digit number"
          />
        </Field>
        <Field label="Password" hint="Admin will use this to log in">
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className={inputCls}
            placeholder="••••••••"
          />
        </Field>
        <div className="flex gap-3 pt-2">
          <Btn variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Btn>
          <Btn type="submit" disabled={loading} className="flex-1">
            {loading ? "Creating..." : "Create Admin"}
          </Btn>
        </div>
      </form>
    </Modal>
  );
}
