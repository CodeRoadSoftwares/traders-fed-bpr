"use client";
import { useState } from "react";
import Image from "next/image";
import { Notice, NoticeAttachment } from "@/types";
import { Icon, IC } from "@/components/ui";

function ImageViewer({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white transition-colors"
      >
        <Icon d={IC.close} className="w-5 h-5" />
      </button>
      <div
        className="relative max-w-4xl max-h-[85vh] w-full h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain"
          sizes="(max-width: 1024px) 100vw, 80vw"
        />
      </div>
      <a
        href={src}
        download
        onClick={(e) => e.stopPropagation()}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur text-white text-sm font-medium rounded-full transition-colors"
      >
        <Icon d={IC.download} className="w-4 h-4" />
        Download
      </a>
    </div>
  );
}

function AttachmentCard({
  attachment,
  onImageClick,
}: {
  attachment: NoticeAttachment;
  onImageClick?: (url: string) => void;
}) {
  if (attachment.type === "image") {
    return (
      <div className="group relative rounded-xl overflow-hidden border border-gray-100 bg-gray-50 aspect-[4/3] cursor-pointer hover:shadow-lg transition-all">
        <Image
          src={attachment.url}
          alt={attachment.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          onClick={() => onImageClick?.(attachment.url)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="text-xs text-white font-medium truncate max-w-[60%]">
            {attachment.name}
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onImageClick?.(attachment.url);
              }}
              className="w-8 h-8 bg-white/20 hover:bg-white/30 backdrop-blur rounded-lg flex items-center justify-center text-white transition-colors"
              title="View full size"
            >
              <Icon d={IC.zoomIn} className="w-4 h-4" />
            </button>
            <a
              href={attachment.url}
              download
              onClick={(e) => e.stopPropagation()}
              className="w-8 h-8 bg-white/20 hover:bg-white/30 backdrop-blur rounded-lg flex items-center justify-center text-white transition-colors"
              title="Download"
            >
              <Icon d={IC.download} className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  // PDF attachment
  return (
    <div className="flex items-center gap-3 px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 hover:border-gray-200 transition-all group">
      <div className="w-10 h-10 bg-danger-50 rounded-lg flex items-center justify-center shrink-0">
        <Icon d={IC.fileText} className="w-5 h-5 text-danger-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">
          {attachment.name}
        </p>
        <p className="text-xs text-gray-400 uppercase mt-0.5">PDF Document</p>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <a
          href={attachment.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-600 hover:text-primary-600 hover:border-primary-200 text-xs font-medium rounded-lg transition-colors"
        >
          <Icon d={IC.externalLink} className="w-3.5 h-3.5" />
          View
        </a>
        <a
          href={attachment.url}
          download
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 border border-primary-100 text-primary-700 hover:bg-primary-100 text-xs font-medium rounded-lg transition-colors"
        >
          <Icon d={IC.download} className="w-3.5 h-3.5" />
          Download
        </a>
      </div>
    </div>
  );
}

export default function NoticeDetailModal({
  notice,
  onClose,
}: {
  notice: Notice;
  onClose: () => void;
}) {
  const [viewerImage, setViewerImage] = useState<string | null>(null);

  const images = notice.attachments?.filter((a) => a.type === "image") ?? [];
  const pdfs = notice.attachments?.filter((a) => a.type === "pdf") ?? [];
  const hasAttachments = images.length > 0 || pdfs.length > 0;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-4 pt-[8vh] overflow-y-auto"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between px-6 py-5 border-b border-gray-100">
            <div className="flex-1 min-w-0 pr-4">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {notice.urgent && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-danger-50 text-danger-700 text-xs font-semibold rounded-full border border-danger-100 animate-pulse">
                    <Icon d={IC.alert} className="w-3 h-3" />
                    Urgent
                  </span>
                )}
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    notice.visibility === "PUBLIC"
                      ? "bg-gray-100 text-gray-600"
                      : "bg-secondary-50 text-secondary-700"
                  }`}
                >
                  {notice.visibility === "PUBLIC" ? "Public" : "Members Only"}
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 leading-snug">
                {notice.title}
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-2">
                <Icon d={IC.calendar} className="w-3.5 h-3.5" />
                {new Date(notice.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
                {notice.createdBy &&
                  typeof notice.createdBy === "object" && (
                    <>
                      <span className="text-gray-200 mx-0.5">·</span>
                      <span>{notice.createdBy.name}</span>
                    </>
                  )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors shrink-0"
            >
              <Icon d={IC.close} className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5 space-y-5">
            {/* Message */}
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
              {notice.message}
            </p>

            {/* Images */}
            {images.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 mb-3">
                  <Icon d={IC.image} className="w-4 h-4 text-gray-400" />
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Images ({images.length})
                  </p>
                </div>
                <div
                  className={`grid gap-3 ${
                    images.length === 1
                      ? "grid-cols-1"
                      : images.length === 2
                        ? "grid-cols-2"
                        : "grid-cols-2 sm:grid-cols-3"
                  }`}
                >
                  {images.map((a) => (
                    <AttachmentCard
                      key={a.url}
                      attachment={a}
                      onImageClick={setViewerImage}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* PDFs */}
            {pdfs.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 mb-3">
                  <Icon d={IC.fileText} className="w-4 h-4 text-gray-400" />
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Documents ({pdfs.length})
                  </p>
                </div>
                <div className="space-y-2">
                  {pdfs.map((a) => (
                    <AttachmentCard key={a.url} attachment={a} />
                  ))}
                </div>
              </div>
            )}

            {!hasAttachments && (
              <div className="text-center py-2">
                <p className="text-xs text-gray-300">No attachments</p>
              </div>
            )}
          </div>

          {/* Footer */}
          {hasAttachments && (
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl flex items-center justify-between">
              <p className="text-xs text-gray-400">
                {images.length > 0 && `${images.length} image${images.length > 1 ? "s" : ""}`}
                {images.length > 0 && pdfs.length > 0 && " · "}
                {pdfs.length > 0 && `${pdfs.length} document${pdfs.length > 1 ? "s" : ""}`}
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>

      {viewerImage && (
        <ImageViewer
          src={viewerImage}
          alt="Notice attachment"
          onClose={() => setViewerImage(null)}
        />
      )}
    </>
  );
}
