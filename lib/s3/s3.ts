import {
  S3Client,
  DeleteObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.AWS_S3_BUCKET!;

export async function getUploadUrl(
  key: string,
  mimeType: string,
  expiresIn = 120,
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: mimeType,
  });
  return getSignedUrl(s3, command, { expiresIn });
}

export async function deleteFromS3(keyOrUrl: string): Promise<void> {
  const key = keyOrUrl.startsWith("http")
    ? new URL(keyOrUrl).pathname.slice(1)
    : keyOrUrl;

  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}
export function s3Url(key: string): string {
  return `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}
