import { NextRequest, NextResponse } from "next/server";
import { deleteFromR2Quotations } from "@/lib/r2";

export async function POST(request: NextRequest) {
  try {
    const { urls } = await request.json();

    if (!Array.isArray(urls)) {
      return NextResponse.json({ error: "urls array is required" }, { status: 400 });
    }

    const publicBase = (
      process.env.NEXT_PUBLIC_R2_QUOTATIONS_PUBLIC_URL ||
      process.env.NEXT_PUBLIC_R2_PUBLIC_URL ||
      ""
    ).replace(/\/$/, "");

    for (const url of urls) {
      if (!url || typeof url !== 'string') continue;
      
      let keyToDelete = url;
      // Strip the base URL to get the raw key
      if (publicBase && url.startsWith(publicBase)) {
        keyToDelete = url.slice(publicBase.length);
      } else {
        // Fallback: try to find the path after the domain
        try {
          const parsed = new URL(url);
          keyToDelete = parsed.pathname;
        } catch (e) {
          // keep it as is if it's not a full URL
        }
      }
      
      // Remove leading slash if present
      if (keyToDelete.startsWith("/")) {
        keyToDelete = keyToDelete.slice(1);
      }

      if (keyToDelete) {
        try {
          await deleteFromR2Quotations(keyToDelete);
        } catch (err) {
          console.error(`Failed to delete quotation image ${keyToDelete} from R2:`, err);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to delete images:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to delete images" },
      { status: 500 }
    );
  }
}
