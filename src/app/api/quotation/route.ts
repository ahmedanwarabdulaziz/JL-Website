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

    // Save to Firestore
    try {
      const adminDb = getAdminFirestore();
      await adminDb.collection("quotationRequests").add({
        ...baseData,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
    } catch (_) {
      await addDoc(collection(db, "quotationRequests"), {
        ...baseData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    // Send email — must await because Vercel terminates the function after response.
    // This is fast now (no heavy attachments, just text + image URLs).
    await sendQuotationEmails(name, phone, email, description, imageUrls);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Quotation API error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to save your request. Please try again." },
      { status: 500 }
    );
  }
}
