function resolveSiteUrl() {
  const raw = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").trim();
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const url = new URL(withProtocol);
    // Strip trailing slash for consistent absolute URLs
    return url.origin;
  } catch {
    return "http://localhost:3000";
  }
}

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_BUSINESS_NAME || "OMJ Apartment",
  siteUrl: resolveSiteUrl(),
  whatsapp: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "2348133756976").replace(/\D/g, ""),
  phone: process.env.NEXT_PUBLIC_PHONE || "+234 813 375 6976",
  email: process.env.NEXT_PUBLIC_EMAIL || "hello@omjapartment.com",
  address:
    process.env.NEXT_PUBLIC_ADDRESS || "Lagos, Nigeria — Victoria Island · Ikoyi · Lekki · Ikeja GRA",
  mapsQuery: process.env.NEXT_PUBLIC_MAPS_QUERY || "Lagos Nigeria",
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM || "omjapartment",
  instagramUrl:
    process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com/omjapartment",
  paystackPublicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
  hostEmail: process.env.HOST_EMAIL || process.env.NEXT_PUBLIC_EMAIL || "hello@omjapartment.com",
  emailFrom: process.env.EMAIL_FROM || "OMJ Apartment <onboarding@resend.dev>",
};

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function telHref(): string {
  return `tel:${siteConfig.phone.replace(/\s/g, "")}`;
}
