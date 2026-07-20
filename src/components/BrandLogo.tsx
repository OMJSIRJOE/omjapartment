import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** Trimmed transparent wordmark ratio (495×195). */
const LOGO_ASPECT = 495 / 195;

interface BrandLogoProps {
  className?: string;
  /** Logo height in pixels; width scales with the wordmark. */
  height?: number;
  priority?: boolean;
}

/** Full brand wordmark. Replace `/public/logo.png` anytime. */
export default function BrandLogo({
  className,
  height = 50,
  priority = false,
}: BrandLogoProps) {
  const width = Math.round(height * LOGO_ASPECT);

  return (
    <Link
      href="/"
      className={cn("inline-flex items-center", className)}
      aria-label="OMJ Apartment home"
    >
      <Image
        src="/logo.png"
        alt="OMJ Apartment & Properties"
        width={width}
        height={height}
        className="h-full w-auto object-contain"
        style={{ height }}
        priority={priority}
      />
    </Link>
  );
}
