"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { useNotices } from "@/hooks/useNotices";
import { uploadToS3 } from "@/hooks/useUpload";
import { showToast } from "@/lib/toast";
import { Modal, Field, inputCls, Btn, Icon, IC } from "@/components/ui";
import { NoticeAttachment } from "@/types";

export default function CreateNoticeModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const { createNotice } = useNotices();
  const [form, setForm] = useState({
    title: "",
    message: "",
    visibility: "PUBLIC",
    urgent: false,
  });
  const [attachments, setAttachments] = useState<NoticeAttachment[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    setUploading(true);
    try {
      const uploaded: NoticeAttachment[] = await Promise.all(
        Array.from(files).map(async (file) => {
          const url = await uploadToS3(file, "notices");
          return {
            url,
            name: file.name,
            type: file.type === "application/pdf" ? "pdf" : "image",
          } as NoticeAttachment;
        }),
      );
      setAttachments((prev) => [...prev, ...uploaded]);
    } catch {
      showToast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const remove = (url: string) =>
    setAttachments((prev) => prev.filter((a) => a.url !== url));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createNotice({ ...form, attachments });
      onSuccess?.();
      onClose();
    } catch {
      showToast.error("Failed to create notice");
    } finally {
      setLoading(false);
    }
  };

  const images = attachments.filter((a) => a.type === "image");
  const pdfs = attachments.filter((a) => a.type === "pdf");

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

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">
              Attachments
            </label>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="text-xs text-primary-600 hover:text-primary-700 font-medium disabled:opacity-50 flex items-center gap-1"
            >
              <Icon d={IC.plus} className="w-3.5 h-3.5" />
              {uploading ? "Uploading..." : "Add files"}
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>

          {images.length > 0 && (
            <div
              className={`grid gap-2 mb-2 ${images.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}
            >
              {images.map((a) => (
                <div
                  key={a.url}
                  className="relative group rounded-lg overflow-hidden border border-gray-100 h-32"
                >
                  <Image
                    src={a.url}
                    alt={a.name}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => remove(a.url)}
                    className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Icon d={IC.x} className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {pdfs.length > 0 && (
            <div className="space-y-1.5">
              {pdfs.map((a) => (
                <div
                  key={a.url}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-100"
                >
                  <Icon
                    d={IC.download}
                    className="w-4 h-4 text-danger-500 shrink-0"
                  />
                  <span className="text-xs text-gray-600 flex-1 truncate">
                    {a.name}
                  </span>
                  <span className="text-[10px] uppercase font-semibold text-gray-400">
                    PDF
                  </span>
                  <button
                    type="button"
                    onClick={() => remove(a.url)}
                    className="text-gray-400 hover:text-danger-500 transition-colors"
                  >
                    <Icon d={IC.x} className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {attachments.length === 0 && !uploading && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="w-full h-20 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center gap-2 text-gray-400 hover:border-primary-300 hover:text-primary-500 transition-colors text-sm"
            >
              <Icon d={IC.plus} className="w-4 h-4" /> Images or PDFs
            </button>
          )}

          {uploading && (
            <div className="flex items-center justify-center gap-2 py-4 text-sm text-gray-400">
              <div className="w-4 h-4 border-2 border-gray-200 border-t-primary-500 rounded-full animate-spin" />
              Uploading...
            </div>
          )}
        </div>

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
              Sends an email notification to all members
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
          <Btn type="submit" disabled={loading || uploading} className="flex-1">
            {loading ? "Creating..." : "Create Notice"}
          </Btn>
        </div>
      </form>
    </Modal>
  );
}
