"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import apiClient from "@/lib/axios/apiClient";
import { uploadToS3 } from "@/hooks/useUpload";
import { showToast } from "@/lib/toast";
import { CarouselSlide } from "@/types";
import { Icon, IC, Btn, Field, inputCls, Spinner } from "@/components/ui";

const DEFAULT_SLIDES: CarouselSlide[] = [
  { imageUrl: "", title: "", subtitle: "" },
  { imageUrl: "", title: "", subtitle: "" },
  { imageUrl: "", title: "", subtitle: "" },
];

export default function CarouselManager() {
  const [slides, setSlides] = useState<CarouselSlide[]>(DEFAULT_SLIDES);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<number | null>(null);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    apiClient
      .get("/carousel")
      .then((r) => {
        if (r.data.data?.length === 3) setSlides(r.data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const updateSlide = (
    i: number,
    field: keyof CarouselSlide,
    value: string,
  ) => {
    setSlides((prev) =>
      prev.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)),
    );
  };

  const handleImageUpload = async (i: number, files: FileList | null) => {
    if (!files?.[0]) return;
    setUploading(i);
    try {
      const url = await uploadToS3(files[0], "carousel");
      updateSlide(i, "imageUrl", url);
    } catch {
      showToast.error("Image upload failed");
    } finally {
      setUploading(null);
    }
  };

  const save = async () => {
    for (const s of slides) {
      if (!s.imageUrl || !s.title) {
        showToast.error("Each slide needs an image and title");
        return;
      }
    }
    setSaving(true);
    try {
      await apiClient.put("/carousel", { slides });
      showToast.success("Carousel updated");
    } catch {
      showToast.error("Failed to save carousel");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold text-primary-600 uppercase tracking-widest mb-1">
          Home Page
        </p>
        <h1 className="text-2xl font-bold text-gray-900">Carousel Images</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage the 3 slides shown on the home page carousel.
        </p>
      </div>

      <div className="space-y-4">
        {slides.map((slide, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-gray-100 p-5 space-y-4"
          >
            <p className="text-sm font-semibold text-gray-700">Slide {i + 1}</p>

            {/* Image picker */}
            <div
              onClick={() => inputRefs[i].current?.click()}
              className="relative w-full aspect-[16/5] rounded-lg overflow-hidden border-2 border-dashed border-gray-200 hover:border-primary-300 cursor-pointer bg-gray-50 transition-colors"
            >
              {slide.imageUrl ? (
                <Image
                  src={slide.imageUrl}
                  alt={`slide ${i + 1}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                  <Icon d={IC.plus} className="w-8 h-8 mb-1" />
                  <span className="text-xs">Click to upload image</span>
                </div>
              )}
              {uploading === i && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                </div>
              )}
            </div>
            <input
              ref={inputRefs[i]}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => handleImageUpload(i, e.target.files)}
            />

            <Field label="Title">
              <input
                type="text"
                value={slide.title}
                onChange={(e) => updateSlide(i, "title", e.target.value)}
                className={inputCls}
                placeholder="Slide title"
              />
            </Field>
            <Field label="Subtitle">
              <input
                type="text"
                value={slide.subtitle ?? ""}
                onChange={(e) => updateSlide(i, "subtitle", e.target.value)}
                className={inputCls}
                placeholder="Optional subtitle"
              />
            </Field>
          </div>
        ))}
      </div>

      <Btn
        onClick={save}
        disabled={saving || uploading !== null}
        className="w-full justify-center py-3"
      >
        {saving ? "Saving..." : "Save Carousel"}
      </Btn>
    </div>
  );
}
