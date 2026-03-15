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

/** Sends quotation notification to JL and confirmation to customer. Fire-and-forget; logs errors. */
export function sendQuotationEmailsInBackground(
  name: string,
  phone: string,
  email: string,
  description: string,
  attachments: { filename: string; content: Buffer }[] = []
): void {
  if (!MAIL_APP_PASSWORD) return;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: { user: MAIL_FROM, pass: MAIL_APP_PASSWORD },
  });

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

  void Promise.all([
    transporter.sendMail(toJL),
    transporter.sendMail(toCustomer),
  ]).catch((err) => console.error("Quotation emails failed:", err));
}
