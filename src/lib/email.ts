import { Resend } from "resend";
import { siteConfig } from "@/lib/config";
import { formatMoney } from "@/data/properties";

type BookingEmailPayload = {
  code: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  propertyTitle: string;
  propertyAddress?: string;
  checkInNotes?: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  total: number;
  status: string;
};

type ContactEmailPayload = {
  name: string;
  email: string;
  phone?: string;
  message: string;
  propertyTitle?: string;
};

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

function bookingHtml(payload: BookingEmailPayload, audience: "guest" | "host") {
  const heading =
    audience === "guest"
      ? `Your ${siteConfig.name} reservation is ${payload.status}`
      : `New ${siteConfig.name} booking: ${payload.code}`;

  const checkInBlock =
    audience === "guest" && payload.checkInNotes
      ? `<div style="margin-top:20px;padding:16px;background:#f7f5f0;border-left:3px solid #D4AF37">
          <p style="margin:0 0 8px;font-weight:bold">Check-in instructions</p>
          <p style="margin:0;white-space:pre-wrap">${payload.checkInNotes.replace(/</g, "&lt;")}</p>
        </div>`
      : "";

  const addressLine = payload.propertyAddress
    ? `<p><strong>Address:</strong> ${payload.propertyAddress}</p>`
    : "";

  return `
    <div style="font-family:Arial,sans-serif;color:#0A0A0A;line-height:1.5">
      <h2 style="color:#0A0A0A">${heading}</h2>
      <p><strong>Confirmation:</strong> ${payload.code}</p>
      <p><strong>Property:</strong> ${payload.propertyTitle}</p>
      ${addressLine}
      <p><strong>Guest:</strong> ${payload.guestName} (${payload.guestEmail}, ${payload.guestPhone})</p>
      <p><strong>Check-in:</strong> ${payload.checkIn}</p>
      <p><strong>Check-out:</strong> ${payload.checkOut}</p>
      <p><strong>Guests:</strong> ${payload.guests}</p>
      <p><strong>Nights:</strong> ${payload.nights}</p>
      <p><strong>Total:</strong> ${formatMoney(payload.total)}</p>
      <p style="color:#666">Status: ${payload.status}</p>
      ${checkInBlock}
      ${
        audience === "guest"
          ? `<p style="margin-top:20px;color:#666">Questions? WhatsApp us on ${siteConfig.phone} or reply to this email.</p>`
          : ""
      }
    </div>
  `;
}

export async function sendBookingEmails(payload: BookingEmailPayload) {
  const resend = getResend();
  if (!resend) {
    console.warn("RESEND_API_KEY missing — skipped booking emails");
    return { sent: false as const };
  }

  await Promise.all([
    resend.emails.send({
      from: siteConfig.emailFrom,
      to: payload.guestEmail,
      subject: `${siteConfig.name} booking ${payload.code}`,
      html: bookingHtml(payload, "guest"),
    }),
    resend.emails.send({
      from: siteConfig.emailFrom,
      to: siteConfig.hostEmail,
      subject: `New booking ${payload.code} — ${payload.propertyTitle}`,
      html: bookingHtml(payload, "host"),
    }),
  ]);

  return { sent: true as const };
}

export async function sendContactInquiryEmail(payload: ContactEmailPayload) {
  const resend = getResend();
  if (!resend) {
    console.warn("RESEND_API_KEY missing — skipped contact inquiry email");
    return { sent: false as const };
  }

  const subject = payload.propertyTitle
    ? `Inquiry · ${payload.propertyTitle}`
    : `New website inquiry from ${payload.name}`;

  await resend.emails.send({
    from: siteConfig.emailFrom,
    to: siteConfig.hostEmail,
    replyTo: payload.email,
    subject,
    html: `
      <div style="font-family:Arial,sans-serif;color:#0A0A0A;line-height:1.5">
        <h2>New inquiry from the website</h2>
        <p><strong>Name:</strong> ${payload.name}</p>
        <p><strong>Email:</strong> ${payload.email}</p>
        <p><strong>Phone:</strong> ${payload.phone || "—"}</p>
        ${payload.propertyTitle ? `<p><strong>Property:</strong> ${payload.propertyTitle}</p>` : ""}
        <p><strong>Message:</strong></p>
        <p style="white-space:pre-wrap">${payload.message.replace(/</g, "&lt;")}</p>
      </div>
    `,
  });

  return { sent: true as const };
}

export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}
