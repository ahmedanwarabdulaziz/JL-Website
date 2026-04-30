import nodemailer from "nodemailer";

const MAIL_FROM = process.env.MAIL_FROM ?? "jl@jlupholstery.com";
const MAIL_APP_PASSWORD = process.env.MAIL_APP_PASSWORD;
const MAIL_SENDER_NAME = "JL Upholstery";
const MAIL_FROM_HEADER = `${MAIL_SENDER_NAME} <${MAIL_FROM}>`;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Sends quotation notification to JL and confirmation to customer. Can be safely awaited. */
export async function sendQuotationEmails(
  name: string,
  phone: string,
  email: string,
  description: string,
  imageUrls: string[] = []
): Promise<void> {
  if (!MAIL_APP_PASSWORD) return;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: { user: MAIL_FROM, pass: MAIL_APP_PASSWORD },
  });

  const imageSection =
    imageUrls.length > 0
      ? `
        <p><strong>${imageUrls.length} photo(s) attached:</strong></p>
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin:8px 0;">
          ${imageUrls
            .map(
              (url, i) =>
                `<a href="${escapeHtml(url)}" target="_blank" style="display:inline-block;">
                  <img src="${escapeHtml(url)}" alt="Photo ${i + 1}" style="max-width:200px;max-height:200px;border-radius:8px;border:1px solid #ddd;" />
                </a>`
            )
            .join("")}
        </div>
      `
      : "";

  const toJL = {
    from: MAIL_FROM_HEADER,
    to: MAIL_FROM,
    subject: `Quotation request from ${name}`,
    text: `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\n\nDescription:\n${description}${imageUrls.length ? `\n\nPhotos:\n${imageUrls.join("\n")}` : ""}`,
    html: `
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Description:</strong></p>
      <p>${escapeHtml(description).replace(/\n/g, "<br>")}</p>
      ${imageSection}
    `,
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

  try {
    await Promise.all([
      transporter.sendMail(toJL),
      transporter.sendMail(toCustomer),
    ]);
  } catch (err) {
    console.error("Quotation emails failed:", err);
  }
}
