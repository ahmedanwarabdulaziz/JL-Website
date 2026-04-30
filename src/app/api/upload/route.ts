import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import { uploadToR2, getR2PublicUrl } from "@/lib/r2";

const MAX_WIDTH = 1200;
const THUMB_WIDTH = 400;
const QUALITY = 85;
const THUMB_QUALITY = 80;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file || !file.size) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    const type = file.type;
    if (!type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const id = uuidv4();
    const key = `uploads/${id}.webp`;
    const thumbKey = `uploads/${id}_thumb.webp`;

    const [processed, thumb] = await Promise.all([
      sharp(buffer)
        .resize(MAX_WIDTH, undefined, { withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toBuffer(),
      sharp(buffer)
        .resize(THUMB_WIDTH, undefined, { withoutEnlargement: true })
        .webp({ quality: THUMB_QUALITY })
        .toBuffer(),
    ]);

    const contentType = "image/webp";
    const [publicUrl] = await Promise.all([
      uploadToR2(key, processed, contentType),
      uploadToR2(thumbKey, thumb, contentType),
    ]);
    const thumbnailUrl = getR2PublicUrl(thumbKey);

    return NextResponse.json({ storageKey: key, publicUrl, thumbnailUrl });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 500 }
    );
  }
}
