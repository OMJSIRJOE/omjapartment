import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import { siteConfig } from "@/lib/config";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: "OMJ Apartment | Luxury Shortlet Bookings",
    template: "%s | OMJ Apartment",
  },
  description:
    "Book luxury shortlet apartments in Lagos with OMJ Apartment. Reserve nights in Victoria Island, Ikoyi, Lekki, and Ikeja GRA.",
  keywords: [
    "OMJ Apartment",
    "luxury shortlet Lagos",
    "Airbnb alternative Lagos",
    "Victoria Island shortlet",
    "Ikoyi apartment booking",
    "Ikeja GRA short stay",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "OMJ Apartment | Luxury Shortlet Bookings",
    description:
      "Reserve exclusive shortlet apartments across Lagos. Choose dates, guests, and book your stay.",
    type: "website",
    locale: "en_US",
    siteName: "OMJ Apartment",
  },
  twitter: {
    card: "summary_large_image",
    title: "OMJ Apartment | Luxury Shortlet Bookings",
    description: "Book premium shortlet apartments across Lagos' finest addresses.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${cormorant.variable} antialiased`}>{children}</body>
    </html>
  );
}
