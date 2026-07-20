import { WhatsAppIcon } from "@/components/icons";
import { buildWhatsAppUrl } from "@/lib/utils";

interface WhatsAppButtonProps {
  propertyTitle: string;
  className?: string;
}

export default function WhatsAppButton({ propertyTitle, className = "" }: WhatsAppButtonProps) {
  const message = `Hello OMJ Apartment, I would like to reserve the shortlet: ${propertyTitle}. Please help me confirm availability.`;

  return (
    <a
      href={buildWhatsAppUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 bg-[#25D366] px-6 py-3 text-xs font-medium tracking-[0.16em] text-white uppercase transition-opacity hover:opacity-90 ${className}`}
    >
      <WhatsAppIcon className="h-5 w-5" />
      WhatsApp Inquiry
    </a>
  );
}
