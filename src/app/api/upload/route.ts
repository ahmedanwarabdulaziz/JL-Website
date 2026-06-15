import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import { uploadToR2, getR2PublicUrl } from "@/lib/r2";

const MAX_WIDTH = 1200;
const THUMB_WIDTH = 400;
const QUALITY = 85;
const THUMB_QUALITY = 80;

// All MIME types sharp can decode. Everything is converted to WebP on output.
const ACCEPTED_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/heic",
  "image/heif",
  "image/tiff",
  "image/bmp",
]);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file || !file.size) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const type = file.type.toLowerCase();
    if (!type.startsWith("image/") && !ACCEPTED_TYPES.has(type)) {
      return NextResponse.json({ error: "File must be an image (JPEG, PNG, HEIC, AVIF, WebP, GIF, TIFF, BMP)" }, { status: 400 });
    }

    // Optional manual rotation (0 | 90 | 180 | 270) supplied by the client UI
    const rotationRaw = formData.get("rotation");
    const manualRotation = rotationRaw ? parseInt(String(rotationRaw), 10) : 0;
    const validRotations = new Set([0, 90, 180, 270]);
    const extraRotation = validRotations.has(manualRotation) ? manualRotation : 0;

    const buffer = Buffer.from(await file.arrayBuffer());
    const id = uuidv4();
    const key = `uploads/${id}.webp`;
    const thumbKey = `uploads/${id}_thumb.webp`;

    // .rotate() with no args reads EXIF orientation and corrects it physically.
    // Then we apply the manual rotation chosen in the UI (if any).
    const [processed, thumb] = await Promise.all([
      sharp(buffer)
        .rotate()                                               // EXIF auto-orient
        .rotate(extraRotation)                                  // manual rotation
        .resize(MAX_WIDTH, undefined, { withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toBuffer(),
      sharp(buffer)
        .rotate()                                               // EXIF auto-orient
        .rotate(extraRotation)                                  // manual rotation
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
