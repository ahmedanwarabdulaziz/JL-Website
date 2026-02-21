import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import sharp from "sharp";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getAdminFirestoreIfAvailable } from "@/lib/firebase-admin";
import { FieldValue, type DocumentReference } from "firebase-admin/firestore";
import { uploadToR2Quotations } from "@/lib/r2";

const MAIL_FROM = process.env.MAIL_FROM ?? "jl@jlupholstery.com";
const MAIL_APP_PASSWORD = process.env.MAIL_APP_PASSWORD;
const MAIL_SENDER_NAME = "JL Upholstery";
const MAIL_FROM_HEADER = `${MAIL_SENDER_NAME} <${MAIL_FROM}>`;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB per file
const MAX_IMAGES = 7;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: NextRequest) {
  if (!MAIL_APP_PASSWORD) {
    return NextResponse.json(
      { error: "Email is not configured. Set MAIL_APP_PASSWORD in .env.local" },
      { status: 500 }
    );
  }

  try {
    const formData = await request.formData();
    const quotationId = (formData.get("quotationId") as string)?.trim();
    if (!quotationId) {
      return NextResponse.json({ error: "Missing quotationId." }, { status: 400 });
    }

    const fileList = formData.getAll("files") as File[];
    const allFiles = fileList.filter((f): f is File => f && typeof f.size === "number" && f.size > 0);
    if (allFiles.length > MAX_IMAGES) {
      return NextResponse.json({ error: `Maximum ${MAX_IMAGES} images allowed.` }, { status: 400 });
    }
    for (const f of allFiles) {
      if (f.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: "Each file must be under 10MB." }, { status: 400 });
      }
      if (!f.type.startsWith("image/")) {
        return NextResponse.json({ error: "Only image files are allowed." }, { status: 400 });
      }
    }

    let name = "";
    let phone = "";
    let email = "";
    let description = "";
    let ref: DocumentReference | null = null;

    const adminDb = getAdminFirestoreIfAvailable();
    if (adminDb) {
      const docRef = adminDb.collection("quotationRequests").doc(quotationId);
      const snap = await docRef.get();
      if (snap.exists) {
        const data = snap.data() as { name?: string; phone?: string; email?: string; description?: string };
        name = data.name ?? "";
        phone = data.phone ?? "";
        email = data.email ?? "";
        description = data.description ?? "";
        ref = docRef;
      }
    }
    if (!name || !email) {
      name = (formData.get("name") as string)?.trim() ?? "";
      phone = (formData.get("phone") as string)?.trim() ?? "";
      email = (formData.get("email") as string)?.trim() ?? "";
      description = (formData.get("description") as string)?.trim() ?? "";
      if (!name || !email) {
        return NextResponse.json({ error: "Missing quotation details. Please submit the form again." }, { status: 400 });
      }
    }

    const imageFiles = allFiles.filter((f) => f.type.startsWith("image/"));
    const fileUrls: string[] = [];
    if (imageFiles.length > 0) {
      for (let i = 0; i < imageFiles.length; i++) {
        const buffer = Buffer.from(await imageFiles[i].arrayBuffer());
        const processed = await sharp(buffer)
          .resize(800, undefined, { withoutEnlargement: true })
          .webp({ quality: 85 })
          .toBuffer();
        const key = `quotations/${quotationId}/image_${i}.webp`;
        const url = await uploadToR2Quotations(key, processed, "image/webp");
        fileUrls.push(url);
      }
      if (fileUrls.length > 0) {
        try {
          if (ref) {
            await ref.update({
              fileUrl: fileUrls[0],
              fileUrls,
              fileName: imageFiles.length === 1 ? imageFiles[0].name : `${imageFiles.length} photos`,
              updatedAt: FieldValue.serverTimestamp(),
            });
          } else {
            await updateDoc(doc(db, "quotationRequests", quotationId), {
              fileUrl: fileUrls[0],
              fileUrls,
              fileName: imageFiles.length === 1 ? imageFiles[0].name : `${imageFiles.length} photos`,
              updatedAt: serverTimestamp(),
            });
          }
        } catch (updateErr) {
          console.error("Failed to save quotation image links to Firestore:", updateErr);
        }
      }
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: { user: MAIL_FROM, pass: MAIL_APP_PASSWORD },
    });

    const attachments: { filename: string; content: Buffer }[] = [];
    for (const f of imageFiles) {
      const buffer = Buffer.from(await f.arrayBuffer());
      attachments.push({ filename: f.name || "image", content: buffer });
    }

    const toJL = {
      from: MAIL_FROM_HEADER,
      to: MAIL_FROM,
      subject: `Quotation request from ${name}`,
      text: `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\n\nDescription:\n${description}`,
      html: `
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Description:</strong></p>
        <p>${escapeHtml(description).replace(/\n/g, "<br>")}</p>
        ${attachments.length ? `<p>${attachments.length} photo(s) attached. View in admin quotations.</p>` : ""}
      `,
      attachments,
    };

    const toCustomer = {
      from: MAIL_FROM_HEADER,
      to: email,
      subject: "We received your quotation request – JL Upholstery",
      text: `Hi ${name},\n\nThank you for your quotation request. We have received your message and will get back to you soon.\n\nBest regards,\nJL Upholstery`,
      html: `
        <p>Hi ${escapeHtml(name)},</p>
        <p>Thank you for your quotation request. We have received your message and will get back to you soon.</p>
        <p>Best regards,<br><strong>JL Upholstery</strong></p>
      `,
    };

    await transporter.sendMail(toJL);
    await transporter.sendMail(toCustomer);

    return NextResponse.json({ success: true, message: "Request sent successfully." });
  } catch (err) {
    console.error("Quotation upload API error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to upload photos. Please try again." },
      { status: 500 }
    );
  }
}
