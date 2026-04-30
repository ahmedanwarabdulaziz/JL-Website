import { NextRequest, NextResponse } from "next/server";
import { deleteFromR2 } from "@/lib/r2";

/** Deletes R2 objects by storage key. Used when deleting a project to remove uploaded images. */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const keys = Array.isArray(body.keys) ? (body.keys as string[]) : [];
    if (keys.length === 0) {
      return NextResponse.json({ ok: true });
    }
    for (const key of keys) {
      if (typeof key !== "string" || !key) continue;
      try {
        await deleteFromR2(key);
      } catch (err) {
        console.error("R2 delete failed for key:", key, err);
      }
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Projects cleanup R2 error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Cleanup failed" },
      { status: 500 }
    );
  }
}
