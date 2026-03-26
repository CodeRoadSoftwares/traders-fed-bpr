import { getUser } from "@/lib/auth/getUser";
import { getUploadUrl, s3Url } from "@/lib/s3/s3";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_DOC_TYPES = ["application/pdf"];
const ALLOWED_ALL = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOC_TYPES];

export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ message: "unauthorized" }, { status: 401 });
    }

    const { folder, mimeType } = await req.json();

    if (!folder || !mimeType) {
      return NextResponse.json(
        { message: "folder and mimeType are required" },
        { status: 400 },
      );
    }
    if (folder === "carousel") {
      const isAdmin = user.role === "ADMIN" || user.role === "SUPER_ADMIN";
      if (!isAdmin) {
        return NextResponse.json({ message: "unauthorized" }, { status: 403 });
      }
      if (!ALLOWED_IMAGE_TYPES.includes(mimeType)) {
        return NextResponse.json(
          { message: "only images allowed for carousel" },
          { status: 400 },
        );
      }
    }
    if (folder === "notices" && !ALLOWED_ALL.includes(mimeType)) {
      return NextResponse.json(
        { message: "only images and PDFs allowed for notices" },
        { status: 400 },
      );
    }
    if (folder === "shops" && !ALLOWED_IMAGE_TYPES.includes(mimeType)) {
      return NextResponse.json(
        { message: "only images allowed for shops" },
        { status: 400 },
      );
    }

    const ext = mimeType.split("/")[1].replace("jpeg", "jpg");
    const key = `${folder}/${user.id}/${randomUUID()}.${ext}`;
    const uploadUrl = await getUploadUrl(key, mimeType);
    const publicUrl = s3Url(key);

    return NextResponse.json({ uploadUrl, publicUrl, key });
  } catch (error) {
    console.error("presign error:", error);
    return NextResponse.json(
      { message: "failed to generate URL" },
      { status: 500 },
    );
  }
}
