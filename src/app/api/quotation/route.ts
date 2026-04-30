import { NextRequest, NextResponse } from "next/server";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getAdminFirestore } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { sendQuotationEmails } from "@/lib/quotation-email";

const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY;

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone: string): boolean {
  return /^[\d\s\-\+\(\)]{8,20}$/.test(phone.trim());
}

/**
 * Creates the quotation in Firestore and sends email notifications.
 *
 * Images are already uploaded directly to R2 from the browser via presigned URLs.
 * This route only receives text fields + image URLs (< 1KB total payload).
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      name?: string;
      phone?: string;
      email?: string;
      description?: string;
      imageUrls?: string[];
      recaptchaToken?: string;
    };

    const name = body.name?.trim() ?? "";
    const phone = body.phone?.trim() ?? "";
    const email = body.email?.trim() ?? "";
    const description = body.description?.trim() ?? "";
    const imageUrls = Array.isArray(body.imageUrls) ? body.imageUrls.filter((u) => typeof u === "string" && u.startsWith("http")) : [];
    const recaptchaToken = body.recaptchaToken?.trim() ?? "";

    const errors: string[] = [];
    if (!name || name.length < 2) errors.push("Name must be at least 2 characters.");
    if (!phone) errors.push("Phone is required.");
    else if (!validatePhone(phone)) errors.push("Please enter a valid phone number.");
    if (!email) errors.push("Email is required.");
    else if (!validateEmail(email)) errors.push("Please enter a valid email address.");
    if (!description || description.length < 10) errors.push("Please provide a brief description (at least 10 characters).");
    if (RECAPTCHA_SECRET && !recaptchaToken) {
      errors.push("Please complete the \"I'm not a robot\" check.");
    }
    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(" ") }, { status: 400 });
    }

    if (RECAPTCHA_SECRET && recaptchaToken) {
      const verifyRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret: RECAPTCHA_SECRET, response: recaptchaToken }),
      });
      const verify = (await verifyRes.json()) as { success?: boolean };
      if (!verify.success) {
        return NextResponse.json({ error: "reCAPTCHA verification failed. Please try again." }, { status: 400 });
      }
    }

    const baseData = {
      name,
      phone,
      email,
      description,
      status: "new" as const,
      ...(imageUrls.length > 0 && {
        fileUrl: imageUrls[0],
        fileUrls: imageUrls,
        fileName: imageUrls.length === 1 ? "1 photo" : `${imageUrls.length} photos`,
      }),
    };

    // ── CRITICAL PATH: Save to Firestore ──
    // If THIS succeeds, the quotation is SAVED. Customer data is NEVER lost.
    let docId = "";
    let useAdmin = false;
    try {
      const adminDb = getAdminFirestore();
      const ref = await adminDb.collection("quotationRequests").add({
        ...baseData,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
      docId = ref.id;
      useAdmin = true;
    } catch (_) {
      const ref = await addDoc(collection(db, "quotationRequests"), {
        ...baseData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      docId = ref.id;
    }

    // ── EMAIL: Retry up to 3 times with 1s delay ──
    let emailSent = false;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        if (attempt > 1) await new Promise((r) => setTimeout(r, 1000));
        await sendQuotationEmails(name, phone, email, description, imageUrls);
        emailSent = true;
        break;
      } catch (emailErr) {
        console.error(`Email attempt ${attempt}/3 failed:`, emailErr);
      }
    }

    // Update Firestore with email delivery status
    try {
      if (useAdmin) {
        const adminDb = getAdminFirestore();
        await adminDb.collection("quotationRequests").doc(docId).update({
          emailSent,
          updatedAt: FieldValue.serverTimestamp(),
        });
      }
    } catch {
      // Non-critical — quotation is already saved
    }

    return NextResponse.json({ success: true, emailSent });
  } catch (err) {
    // This only triggers if FIRESTORE save itself fails (very rare).
    console.error("Quotation API error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to save your request. Please try again." },
      { status: 500 }
    );
  }
}
