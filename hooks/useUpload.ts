import apiClient from "@/lib/axios/apiClient";

type Folder = "shops" | "notices" | "carousel";

/**
 * Upload a file to S3 via presigned URL.
 * Returns the public URL of the uploaded file.
 */
export async function uploadToS3(file: File, folder: Folder): Promise<string> {
  // 1. Get presigned URL from our API
  const { data } = await apiClient.post("/upload/presign", {
    folder,
    mimeType: file.type,
  });

  // 2. PUT directly to S3 (no auth headers — presigned URL handles it)
  await fetch(data.uploadUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type },
  });

  return data.publicUrl as string;
}
