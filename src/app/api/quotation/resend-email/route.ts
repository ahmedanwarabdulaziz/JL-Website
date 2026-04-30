import { NextRequest, NextResponse } from "next/server";
import { getAdminFirestore } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { sendQuotationEmails } from "@/lib/quotation-email";

/**
 * Resend email for a quotation that failed to send.
 * Called from admin panel.
 *
 * POST /api/quotation/resend-email
 * Body: { quotationId: string }
 */
export async function POST(request: NextRequest) {
  try {
    const { quotationId } = (await request.json()) as { quotationId?: string };

    if (!quotationId?.trim()) {
      return NextResponse.json({ error: "Missing quotationId." }, { status: 400 });
    }

    const adminDb = getAdminFirestore();
    const docRef = adminDb.collection("quotationRequests").doc(quotationId.trim());
    const snap = await docRef.get();

    if (!snap.exists) {
      return NextResponse.json({ error: "Quotation not found." }, { status: 404 });
    }

    const data = snap.data() as {
      name?: string;
      phone?: string;
      email?: string;
      description?: string;
      fileUrls?: string[];
    };

    if (!data.name || !data.email) {
      return NextResponse.json({ error: "Quotation data is incomplete." }, { status: 400 });
    }

    // Try sending email (3 attempts)
    let emailSent = false;
    let lastError = "";
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        if (attempt > 1) await new Promise((r) => setTimeout(r, 1000));
        await sendQuotationEmails(
          data.name,
          data.phone ?? "",
          data.email,
          data.description ?? "",
          data.fileUrls ?? []
        );
        emailSent = true;
        break;
      } catch (err) {
        lastError = err instanceof Error ? err.message : String(err);
        console.error(`Resend attempt ${attempt}/3 failed:`, lastError);
      }
    }

    // Update Firestore status
    await docRef.update({
      emailSent,
      updatedAt: FieldValue.serverTimestamp(),
    });

    if (emailSent) {
      return NextResponse.json({ success: true, message: "Emails sent successfully." });
    } else {
      return NextResponse.json({ error: `Failed after 3 attempts: ${lastError}` }, { status: 500 });
    }
  } catch (err) {
    console.error("Resend email error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to resend email." },
      { status: 500 }
    );
  }
}

/**
 * GET: Find all quotations where email failed (for admin dashboard).
 * Returns list of quotations with emailSent: false.
 */
export async function GET() {
  try {
    const adminDb = getAdminFirestore();
    const snapshot = await adminDb
      .collection("quotationRequests")
      .where("emailSent", "==", false)
      .orderBy("createdAt", "desc")
      .limit(50)
      .get();

    const failed = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ count: failed.length, quotations: failed });
  } catch (err) {
    console.error("Fetch failed emails error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch." },
      { status: 500 }
    );
  }
}
