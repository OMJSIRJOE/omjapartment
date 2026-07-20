import BrandLogo from "@/components/BrandLogo";
import { InstagramIcon, MailIcon, WhatsAppIcon } from "@/components/icons";
import { buildWhatsAppUrl, siteConfig } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-navy text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.1),transparent_55%)]" />
      <div className="relative mx-auto flex max-w-lg flex-col items-center px-5 py-8 text-center md:px-8 md:py-10">
        <BrandLogo height={50} />

        <div className="mt-5 flex items-center justify-center gap-3">
          <a
            href={buildWhatsAppUrl("Hello OMJ Apartment, I would like to book a shortlet.")}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`WhatsApp ${siteConfig.phone}`}
            className="flex h-10 w-10 items-center justify-center border border-white/25 text-white transition-colors hover:border-gold hover:text-gold"
          >
            <WhatsAppIcon className="h-5 w-5" />
          </a>
          <a
            href={siteConfig.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Instagram @${siteConfig.instagram}`}
            className="flex h-10 w-10 items-center justify-center border border-white/25 text-white transition-colors hover:border-gold hover:text-gold"
          >
            <InstagramIcon className="h-5 w-5" />
          </a>
          <a
            href={`mailto:${siteConfig.email}`}
            aria-label={`Email ${siteConfig.email}`}
            className="flex h-10 w-10 items-center justify-center border border-white/25 text-white transition-colors hover:border-gold hover:text-gold"
          >
            <MailIcon className="h-5 w-5" />
          </a>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-5 py-3 text-xs tracking-wide text-white/50 md:px-8">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
