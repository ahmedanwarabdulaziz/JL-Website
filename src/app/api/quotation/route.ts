import { NextRequest, NextResponse } from "next/server";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getAdminFirestore } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { sendQuotationEmailsInBackground } from "@/lib/quotation-email";

const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY;

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone: string): boolean {
  return /^[\d\s\-\+\(\)]{8,20}$/.test(phone.trim());
}

/** Creates the quotation doc only (no files). Client then uploads images with progress and calls /api/quotation/upload. */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const name = (formData.get("name") as string)?.trim() ?? "";
    const phone = (formData.get("phone") as string)?.trim() ?? "";
    const email = (formData.get("email") as string)?.trim() ?? "";
    const description = (formData.get("description") as string)?.trim() ?? "";
    const recaptchaToken = (formData.get("recaptchaToken") as string)?.trim() ?? "";
    const noFiles = formData.get("noFiles") === "true";

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
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      description: description.trim(),
      status: "new" as const,
    };

    try {
      const adminDb = getAdminFirestore();
      const ref = await adminDb.collection("quotationRequests").add({
        ...baseData,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
      if (noFiles) sendQuotationEmailsInBackground(name.trim(), phone.trim(), email.trim(), description.trim());
      return NextResponse.json({ success: true, quotationId: ref.id });
    } catch (_) {
      const ref = await addDoc(collection(db, "quotationRequests"), {
        ...baseData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      if (noFiles) sendQuotationEmailsInBackground(name.trim(), phone.trim(), email.trim(), description.trim());
      return NextResponse.json({ success: true, quotationId: ref.id });
    }
  } catch (err) {
    console.error("Quotation API error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to save your request. Please try again." },
      { status: 500 }
    );
  }
}
