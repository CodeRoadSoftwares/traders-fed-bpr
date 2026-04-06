"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { Icon, IC } from "@/components/ui";
import { uploadToS3 } from "@/hooks/useUpload";
import apiClient from "@/lib/axios/apiClient";
import { showToast } from "@/lib/toast";

type DocKey =
  | "aadhar"
  | "pan"
  | "photograph"
  | "municipalityCertificate"
  | "rentOrElectricityBill";

const DOC_FIELDS: {
  key: DocKey;
  label: string;
  accept: string;
  hint: string;
}[] = [
  {
    key: "photograph",
    label: "Shopkeeper Photograph",
    accept: "image/*",
    hint: "Recent passport-size photograph",
  },
  {
    key: "aadhar",
    label: "Aadhaar Card",
    accept: "image/*,application/pdf",
    hint: "Scan/photo of your Aadhaar card",
  },
  {
    key: "pan",
    label: "PAN Card",
    accept: "image/*,application/pdf",
    hint: "Scan/photo of your PAN card",
  },
  {
    key: "municipalityCertificate",
    label: "Municipality Certificate",
    accept: "image/*,application/pdf",
    hint: "Certificate from local municipality",
  },
  {
    key: "rentOrElectricityBill",
    label: "Rent Deed / Electricity Bill",
    accept: "image/*,application/pdf",
    hint: "Proof of shop premises",
  },
];

interface ShopDocumentsProps {
  shopId: string;
  initialDocuments?: {
    aadhar?: string;
    pan?: string;
    photograph?: string;
    municipalityCertificate?: string;
    rentOrElectricityBill?: string;
    otherLicenses?: string[];
  };
  onUpdate?: () => void;
}

export default function ShopDocuments({
  shopId,
  initialDocuments = {},
  onUpdate,
}: ShopDocumentsProps) {
  const [documents, setDocuments] = useState(initialDocuments || {});
  const [uploading, setUploading] = useState<Partial<Record<DocKey, boolean>>>(
    {},
  );
  const [otherLicenses, setOtherLicenses] = useState<string[]>(
    initialDocuments?.otherLicenses || [],
  );
  const [otherUploading, setOtherUploading] = useState(false);
  const otherRef = useRef<HTMLInputElement>(null);

  const handleDocUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    key: DocKey,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading((prev) => ({ ...prev, [key]: true }));
    try {
      const url = await uploadToS3(file, "registration");
      const updatedDocs = {
        aadhar: documents?.aadhar || "",
        pan: documents?.pan || "",
        photograph: documents?.photograph || "",
        municipalityCertificate: documents?.municipalityCertificate || "",
        rentOrElectricityBill: documents?.rentOrElectricityBill || "",
        otherLicenses: documents?.otherLicenses || [],
        [key]: url,
      };
      setDocuments(updatedDocs);

      // Update on backend
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload: Record<string, any> = {
        id: shopId,
        documents: updatedDocs,
      };

      if (key === "photograph") {
        payload.shopkeeperPhoto = url;
      }

      await apiClient.put("/shop/update", payload);

      showToast.success("Document uploaded successfully");
      onUpdate?.();
    } catch (err) {
      console.error("Upload error:", err);
      showToast.error("Upload failed");
    } finally {
      setUploading((prev) => ({ ...prev, [key]: false }));
    }
  };

  const handleRemoveDoc = async (key: DocKey) => {
    try {
      const updatedDocs = {
        aadhar: documents?.aadhar || "",
        pan: documents?.pan || "",
        photograph: documents?.photograph || "",
        municipalityCertificate: documents?.municipalityCertificate || "",
        rentOrElectricityBill: documents?.rentOrElectricityBill || "",
        otherLicenses: documents?.otherLicenses || [],
        [key]: "",
      };
      setDocuments(updatedDocs);

      await apiClient.put("/shop/update", {
        id: shopId,
        documents: updatedDocs,
      });

      showToast.success("Document removed");
      onUpdate?.();
    } catch (err) {
      console.error("Remove error:", err);
      showToast.error("Failed to remove document");
    }
  };

  const handleOtherLicenses = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setOtherUploading(true);
    try {
      const urls = await Promise.all(
        Array.from(files).map((f) => uploadToS3(f, "registration")),
      );
      const updatedOther = [...otherLicenses, ...urls];
      setOtherLicenses(updatedOther);

      const updatedDocs = {
        aadhar: documents?.aadhar || "",
        pan: documents?.pan || "",
        photograph: documents?.photograph || "",
        municipalityCertificate: documents?.municipalityCertificate || "",
        rentOrElectricityBill: documents?.rentOrElectricityBill || "",
        otherLicenses: updatedOther,
      };

      await apiClient.put("/shop/update", {
        id: shopId,
        documents: updatedDocs,
      });

      showToast.success("Licenses uploaded");
      onUpdate?.();
    } catch (err) {
      console.error("Other licenses upload error:", err);
      showToast.error("Upload failed");
    } finally {
      setOtherUploading(false);
      if (otherRef.current) otherRef.current.value = "";
    }
  };

  const removeOtherLicense = async (url: string) => {
    try {
      const updatedOther = otherLicenses.filter((u) => u !== url);
      setOtherLicenses(updatedOther);

      const updatedDocs = {
        aadhar: documents?.aadhar || "",
        pan: documents?.pan || "",
        photograph: documents?.photograph || "",
        municipalityCertificate: documents?.municipalityCertificate || "",
        rentOrElectricityBill: documents?.rentOrElectricityBill || "",
        otherLicenses: updatedOther,
      };

      await apiClient.put("/shop/update", {
        id: shopId,
        documents: updatedDocs,
      });

      showToast.success("License removed");
      onUpdate?.();
    } catch (err) {
      console.error("Remove license error:", err);
      showToast.error("Failed to remove license");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <Icon d={IC.fileText} className="w-5 h-5 text-gray-400" />
        <p className="text-sm font-bold text-gray-900 uppercase tracking-widest">
          Shop Documents
        </p>
      </div>

      <div className="bg-primary-50/50 border border-primary-100 rounded-xl p-3.5 mb-5">
        <p className="text-xs font-medium text-primary-700 leading-relaxed">
          Upload or update your shop documents. These are required for
          verification and certificate approval.
        </p>
      </div>

      <div className="space-y-4">
        {DOC_FIELDS.map(({ key, label, accept, hint }) => {
          const url = documents[key];
          const isPdf = url && url.endsWith(".pdf");

          return (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {label}
              </label>
              <p className="text-xs text-gray-400 mb-2">{hint}</p>

              {url ? (
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors group">
                  {isPdf ? (
                    <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center shrink-0 border border-primary-100">
                      <Icon
                        d={IC.fileText}
                        className="w-7 h-7 text-primary-500"
                      />
                    </div>
                  ) : (
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-gray-200">
                      <Image
                        src={url}
                        alt={label}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Uploaded
                    </p>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1.5"
                    >
                      View Document
                      <Icon d={IC.externalLink} className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveDoc(key)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-2"
                  >
                    <Icon d={IC.trash} className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="w-full h-24 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-primary-400 hover:text-primary-500 transition-colors cursor-pointer">
                  {uploading[key] ? (
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-primary-500 rounded-full animate-spin" />
                  ) : (
                    <>
                      <Icon d={IC.paperclip} className="w-5 h-5" />
                      <span className="text-xs font-medium">
                        Click to upload
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    accept={accept}
                    className="hidden"
                    onChange={(e) => handleDocUpload(e, key)}
                  />
                </label>
              )}
            </div>
          );
        })}

        {/* Other Licenses */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Other Government Licenses{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <p className="text-xs text-gray-400 mb-2">
            FSSAI, GST, or other licenses issued by Govt. of India
          </p>

          {otherLicenses.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-3">
              {otherLicenses.map((url, idx) => {
                const isPdf = url.endsWith(".pdf");
                return (
                  <div key={url} className="relative group">
                    {isPdf ? (
                      <div className="w-20 h-20 bg-primary-50 rounded-xl flex flex-col items-center justify-center border border-primary-100">
                        <Icon
                          d={IC.fileText}
                          className="w-8 h-8 text-primary-500"
                        />
                        <span className="text-[10px] text-primary-600 font-medium mt-1">
                          PDF
                        </span>
                      </div>
                    ) : (
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200">
                        <Image
                          src={url}
                          alt={`License ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeOtherLicense(url)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <Icon d={IC.x} className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <input
            ref={otherRef}
            type="file"
            accept="image/*,application/pdf"
            multiple
            className="hidden"
            onChange={handleOtherLicenses}
          />
          <button
            type="button"
            onClick={() => otherRef.current?.click()}
            disabled={otherUploading}
            className="w-full h-20 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center gap-2 text-gray-400 hover:border-primary-400 hover:text-primary-500 transition-colors disabled:opacity-50 text-sm font-medium"
          >
            {otherUploading ? (
              <div className="w-5 h-5 border-2 border-gray-300 border-t-primary-500 rounded-full animate-spin" />
            ) : (
              <>
                <Icon d={IC.plus} className="w-5 h-5" />
                Add License Files
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
