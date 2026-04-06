"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { useNotices } from "@/hooks/useNotices";
import { uploadToS3 } from "@/hooks/useUpload";
import { showToast } from "@/lib/toast";
import { Modal, Field, inputCls, Btn, Icon, IC } from "@/components/ui";
import { Notice, NoticeAttachment } from "@/types";

export default function EditNoticeModal({
  notice,
  onClose,
  onSuccess,
}: {
  notice: Notice;
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const { updateNotice } = useNotices();
  const [form, setForm] = useState({
    title: notice.title,
    message: notice.message,
    visibility: notice.visibility as "PUBLIC" | "SHOPS",
    urgent: notice.urgent,
  });
  const [attachments, setAttachments] = useState<NoticeAttachment[]>(
    notice.attachments ?? [],
  );
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
      await updateNotice(notice._id, { ...form, attachments });
      onSuccess?.();
      onClose();
    } catch {
      showToast.error("Failed to update notice");
    } finally {
      setLoading(false);
    }
  };

  const images = attachments.filter((a) => a.type === "image");
  const pdfs = attachments.filter((a) => a.type === "pdf");

  return (
    <Modal title="Edit Notice" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Title">
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className={inputCls}
          />
        </Field>

        <Field label="Message">
          <textarea
            required
            rows={4}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className={inputCls}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Visibility">
            <select
              value={form.visibility}
              onChange={(e) =>
                setForm({
                  ...form,
                  visibility: e.target.value as "PUBLIC" | "SHOPS",
                })
              }
              className={inputCls}
            >
              <option value="PUBLIC">Public</option>
              <option value="SHOPS">Shops Only</option>
            </select>
          </Field>
          <Field label="Priority">
            <label className="flex items-center gap-2 cursor-pointer mt-2">
              <input
                type="checkbox"
                checked={form.urgent}
                onChange={(e) => setForm({ ...form, urgent: e.target.checked })}
                className="w-4 h-4 accent-danger-600"
              />
              <span className="text-sm font-medium text-gray-700">Urgent</span>
            </label>
          </Field>
        </div>

        {/* Attachments */}
        <Field label="Attachments">
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/*,application/pdf"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          {images.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {images.map((a) => (
                <div key={a.url} className="relative group w-16 h-16">
                  <Image
                    src={a.url}
                    alt={a.name}
                    fill
                    className="object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => remove(a.url)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Icon d={IC.x} className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          {pdfs.length > 0 && (
            <div className="space-y-1 mb-2">
              {pdfs.map((a) => (
                <div
                  key={a.url}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg"
                >
                  <Icon
                    d={IC.fileText}
                    className="w-4 h-4 text-gray-400 shrink-0"
                  />
                  <span className="text-xs text-gray-600 flex-1 truncate">
                    {a.name}
                  </span>
                  <button type="button" onClick={() => remove(a.url)}>
                    <Icon
                      d={IC.x}
                      className="w-3.5 h-3.5 text-gray-400 hover:text-red-500"
                    />
                  </button>
                </div>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="w-full h-12 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center gap-2 text-xs text-gray-400 hover:border-primary-400 hover:text-primary-500 transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <div className="w-4 h-4 border-2 border-gray-300 border-t-primary-500 rounded-full animate-spin" />
            ) : (
              <>
                <Icon d={IC.paperclip} className="w-4 h-4" /> Add attachments
              </>
            )}
          </button>
        </Field>

        <div className="flex gap-3 pt-2">
          <Btn
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Btn>
          <Btn type="submit" disabled={loading || uploading} className="flex-1">
            {loading ? "Saving..." : "Save Changes"}
          </Btn>
        </div>
      </form>
    </Modal>
  );
}
