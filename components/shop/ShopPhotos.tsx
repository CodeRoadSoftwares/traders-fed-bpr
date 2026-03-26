"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import apiClient from "@/lib/axios/apiClient";
import { uploadToS3 } from "@/hooks/useUpload";
import { showToast } from "@/lib/toast";
import { Icon, IC, Btn } from "@/components/ui";

interface Props {
  shopId: string;
  initialPhotos: string[];
  initialPrimary?: string;
}

export default function ShopPhotos({
  shopId,
  initialPhotos,
  initialPrimary,
}: Props) {
  const [photos, setPhotos] = useState<string[]>(initialPhotos);
  const [primary, setPrimary] = useState<string>(
    initialPrimary || initialPhotos[0] || "",
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  void shopId;

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    const remaining = 5 - photos.length;
    if (remaining <= 0) {
      showToast.error("Maximum 5 photos allowed");
      return;
    }
    const toUpload = Array.from(files).slice(0, remaining);
    setUploading(true);
    try {
      const urls = await Promise.all(
        toUpload.map((f) => uploadToS3(f, "shops")),
      );
      const updated = [...photos, ...urls];
      setPhotos(updated);
      if (!primary) setPrimary(updated[0]);
    } catch {
      showToast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const remove = (url: string) => {
    const updated = photos.filter((p) => p !== url);
    setPhotos(updated);
    if (primary === url) setPrimary(updated[0] || "");
  };

  const save = async () => {
    setSaving(true);
    try {
      await apiClient.put("/shop/photos", { photos, primaryPhoto: primary });
      showToast.success("Photos saved");
    } catch {
      showToast.error("Failed to save photos");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-700">Shop Photos</p>
          <p className="text-xs text-gray-400">
            Up to 5 photos. Click a photo to set it as primary.
          </p>
        </div>
        <Btn
          onClick={() => inputRef.current?.click()}
          variant="secondary"
          disabled={uploading || photos.length >= 5}
        >
          {uploading ? (
            <span className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-primary-300 border-t-primary-600 rounded-full animate-spin" />
              Uploading...
            </span>
          ) : (
            <>
              <Icon d={IC.plus} className="w-4 h-4" /> Add Photo
            </>
          )}
        </Btn>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {photos.length === 0 ? (
        <button
          onClick={() => inputRef.current?.click()}
          className="w-full border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-primary-300 hover:bg-primary-50/30 transition-colors"
        >
          <Icon d={IC.plus} className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-400">Click to upload shop photos</p>
        </button>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {photos.map((url) => (
            <div
              key={url}
              onClick={() => setPrimary(url)}
              className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                primary === url
                  ? "border-primary-500 ring-2 ring-primary-200"
                  : "border-transparent hover:border-gray-300"
              }`}
            >
              <Image src={url} alt="shop photo" fill className="object-cover" />
              {primary === url && (
                <div className="absolute top-1 left-1 bg-primary-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                  Primary
                </div>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  remove(url);
                }}
                className="absolute top-1 right-1 w-5 h-5 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors"
              >
                <Icon d={IC.close} className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {photos.length > 0 && (
        <Btn onClick={save} disabled={saving} className="w-full justify-center">
          {saving ? "Saving..." : "Save Photos"}
        </Btn>
      )}
    </div>
  );
}
