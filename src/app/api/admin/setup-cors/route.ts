import { NextResponse } from "next/server";
import { PutBucketCorsCommand } from "@aws-sdk/client-s3";
import { r2Client, R2_QUOTATIONS_BUCKET, R2_BUCKET } from "@/lib/r2";

/**
 * One-time CORS setup for R2 bucket.
 * Visit /api/admin/setup-cors in the browser after deployment.
 * This allows browser → R2 direct uploads via presigned URLs.
 *
 * DELETE THIS ROUTE after running it once.
 */
export async function GET() {
  if (!r2Client) {
    return NextResponse.json(
      { error: "R2 is not configured. Check environment variables." },
      { status: 500 }
    );
  }

  const bucket = R2_QUOTATIONS_BUCKET ?? R2_BUCKET;
  const siteUrl = process.env.SITE_URL || "https://www.jlupholstery.com";

  const corsRules = [
    {
      AllowedOrigins: [
        siteUrl,
        siteUrl.replace("https://www.", "https://"),
        "http://localhost:3000",
      ],
      AllowedMethods: ["PUT" as const],
      AllowedHeaders: ["Content-Type", "content-type"],
      MaxAgeSeconds: 3600,
    },
  ];

  try {
    await r2Client.send(
      new PutBucketCorsCommand({
        Bucket: bucket,
        CORSConfiguration: { CORSRules: corsRules },
      })
    );

    return NextResponse.json({
      success: true,
      message: `CORS configured on bucket "${bucket}"`,
      allowedOrigins: corsRules[0].AllowedOrigins,
      note: "You can delete /api/admin/setup-cors route now.",
    });
  } catch (err) {
    console.error("CORS setup failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to set CORS" },
      { status: 500 }
    );
  }
}
