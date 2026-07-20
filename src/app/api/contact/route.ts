import { NextResponse } from "next/server";
import { z } from "zod";
import { sendContactInquiryEmail, isEmailConfigured } from "@/lib/email";
import { buildWhatsAppUrl, siteConfig } from "@/lib/config";

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().max(40).optional(),
  message: z.string().trim().min(10).max(4000),
  propertyTitle: z.string().trim().max(200).optional(),
});

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());

    if (isEmailConfigured()) {
      await sendContactInquiryEmail(body);
      return NextResponse.json({ ok: true, delivered: "email" });
    }

    // Fallback: still accept the inquiry; client can open WhatsApp
    return NextResponse.json({
      ok: true,
      delivered: "whatsapp-fallback",
      whatsappUrl: buildWhatsAppUrl(
        [
          `Hello ${siteConfig.name},`,
          `Name: ${body.name}`,
          `Email: ${body.email}`,
          body.phone ? `Phone: ${body.phone}` : null,
          body.propertyTitle ? `Property: ${body.propertyTitle}` : null,
          "",
          body.message,
        ]
          .filter(Boolean)
          .join("\n"),
      ),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to send inquiry";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
