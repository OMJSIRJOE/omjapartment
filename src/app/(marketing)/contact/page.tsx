import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import PageHero from "@/components/PageHero";
import { InstagramIcon, MailIcon, MapPinIcon, PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { siteConfig, telHref } from "@/lib/config";
import { buildWhatsAppUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact OMJ Apartment to reserve a luxury shortlet or ask about availability in Lagos.",
};

export default function ContactPage() {
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(siteConfig.mapsQuery)}&z=12&output=embed`;

  return (
    <>
      <PageHero
        title="Contact Us"
        subtitle="Ask about availability, group stays, or help reserving your next shortlet."
        image="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=2000&q=80"
      />

      <section className="section-pad bg-mist">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 md:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <p className="text-xs tracking-[0.22em] text-gold-dark uppercase">Get in Touch</p>
            <h2 className="mt-3 font-display text-3xl text-navy md:text-4xl">
              We would love to hear from you
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-navy/65">
              Planning a short stay in Lagos? Share your dates and guest count — we&apos;ll help you
              reserve the right apartment. Most inquiries get a same-day reply on WhatsApp.
            </p>

            <ul className="mt-10 space-y-6">
              <li className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-navy text-gold">
                  <MapPinIcon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs tracking-[0.16em] text-navy/45 uppercase">Serving</p>
                  <p className="mt-1 text-sm text-navy/80">{siteConfig.address}</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-navy text-gold">
                  <PhoneIcon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs tracking-[0.16em] text-navy/45 uppercase">
                    Call / WhatsApp
                  </p>
                  <a
                    href={telHref()}
                    className="mt-1 block text-sm text-navy/80 transition-colors hover:text-gold-dark"
                  >
                    {siteConfig.phone}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-navy text-gold">
                  <InstagramIcon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs tracking-[0.16em] text-navy/45 uppercase">Instagram</p>
                  <a
                    href={siteConfig.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block text-sm text-navy/80 transition-colors hover:text-gold-dark"
                  >
                    @{siteConfig.instagram}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-navy text-gold">
                  <MailIcon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs tracking-[0.16em] text-navy/45 uppercase">Email</p>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="mt-1 block text-sm text-navy/80 transition-colors hover:text-gold-dark"
                  >
                    {siteConfig.email}
                  </a>
                </div>
              </li>
            </ul>

            <a
              href={buildWhatsAppUrl(
                "Hello OMJ Apartment, I would like help reserving a luxury shortlet."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex items-center gap-2 bg-[#25D366] px-6 py-3 text-xs font-medium tracking-[0.16em] text-white uppercase transition-opacity hover:opacity-90"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Chat on WhatsApp
            </a>
          </div>

          <div className="border border-navy/10 bg-white p-6 shadow-[0_16px_50px_rgba(10,10,10,0.08)] md:p-10">
            <h2 className="font-display text-2xl text-navy md:text-3xl">Send a message</h2>
            <p className="mt-2 text-sm text-navy/60">
              Include your preferred dates and number of guests for faster booking help.
            </p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 pb-16 md:px-8">
          <p className="mb-4 text-xs tracking-[0.22em] text-gold-dark uppercase">Find us in Lagos</p>
          <div className="overflow-hidden border border-navy/10">
            <iframe
              title="OMJ Apartment locations map"
              src={mapSrc}
              className="h-[320px] w-full md:h-[420px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </>
  );
}
