import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2Client, R2_QUOTATIONS_BUCKET, R2_BUCKET } from "@/lib/r2";

const QUOTATIONS_PREFIX = "quotation-uploads/";
const SIGNED_URL_EXPIRES_IN = 300; // 5 minutes
const MAX_IMAGES = 7;

/**
 * Generates a presigned PUT URL so the browser can upload an image
 * directly to Cloudflare R2 — bypassing Vercel entirely.
 *
 * Body: { sessionId: string; fileIndex: number }
 * Returns: { uploadUrl: string; publicUrl: string; key: string }
 */
export async function POST(request: NextRequest) {
  try {
    if (!r2Client) {
      return NextResponse.json(
        { error: "Storage is not configured." },
        { status: 500 }
      );
    }

    const body = (await request.json()) as {
      sessionId?: string;
      fileIndex?: number;
    };

    const sessionId = body.sessionId?.trim();
    const fileIndex = body.fileIndex;

    if (
      !sessionId ||
      typeof fileIndex !== "number" ||
      fileIndex < 0 ||
      fileIndex >= MAX_IMAGES
    ) {
      return NextResponse.json(
        { error: "Invalid sessionId or fileIndex." },
        { status: 400 }
      );
    }

    // Validate sessionId format (UUID-like, prevent path traversal)
    if (!/^[a-zA-Z0-9_-]{8,64}$/.test(sessionId)) {
      return NextResponse.json(
        { error: "Invalid sessionId format." },
        { status: 400 }
      );
    }

    const bucket = R2_QUOTATIONS_BUCKET ?? R2_BUCKET;
    const objectKey = R2_QUOTATIONS_BUCKET
      ? `quotations/${sessionId}/image_${fileIndex}.webp`
      : `${QUOTATIONS_PREFIX}quotations/${sessionId}/image_${fileIndex}.webp`;

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: objectKey,
      ContentType: "image/webp",
    });

    const uploadUrl = await getSignedUrl(r2Client, command, {
      expiresIn: SIGNED_URL_EXPIRES_IN,
    });

    // Construct the public URL for this image
    const publicBase = (
      process.env.NEXT_PUBLIC_R2_QUOTATIONS_PUBLIC_URL ||
      process.env.NEXT_PUBLIC_R2_PUBLIC_URL ||
      ""
    ).replace(/\/$/, "");

    const publicUrl = `${publicBase}/${objectKey}`;

    return NextResponse.json({ uploadUrl, publicUrl, key: objectKey });
  } catch (err) {
    console.error("Presign API error:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Failed to generate upload URL.",
      },
      { status: 500 }
    );
  }
}
