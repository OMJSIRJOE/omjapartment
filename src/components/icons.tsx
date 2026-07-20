import { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function MenuIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}

export function MapPinIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path
        d="M12 21s7-5.4 7-11a7 7 0 10-14 0c0 5.6 7 11 7 11z"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export function BedIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M3 18v-5a3 3 0 013-3h12a3 3 0 013 3v5" strokeLinecap="round" />
      <path d="M3 14h18M7 10V8a2 2 0 012-2h2a2 2 0 012 2v2" strokeLinecap="round" />
    </svg>
  );
}

export function BathIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path
        d="M4 12h16v3a4 4 0 01-4 4H8a4 4 0 01-4-4v-3zM7 12V7a2 2 0 012-2h1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M6 19v1M18 19v1" strokeLinecap="round" />
    </svg>
  );
}

export function AreaIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4" strokeLinecap="round" />
      <rect x="8" y="8" width="8" height="8" rx="1" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <path d="M5 12.5l4.5 4.5L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path
        d="M6.5 3.5h2.8l1.4 3.5-1.8 1.2a12 12 0 005.9 5.9l1.2-1.8 3.5 1.4v2.8A1.5 1.5 0 0118 18.5 14.5 14.5 0 013.5 4 1.5 1.5 0 015 2.5h1.5z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 7 9-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function WhatsAppIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12.04 2C6.58 2 2.15 6.4 2.15 11.82c0 1.96.52 3.87 1.5 5.55L2 22l4.8-1.58a9.9 9.9 0 004.24.94h.01c5.46 0 9.89-4.4 9.89-9.82C20.94 6.4 16.5 2 12.04 2zm5.75 13.9c-.24.67-1.4 1.23-1.93 1.31-.49.07-1.11.1-1.79-.11-.41-.13-.94-.31-1.62-.6-2.85-1.23-4.7-4.1-4.84-4.29-.14-.19-1.14-1.52-1.14-2.9s.72-2.06.98-2.34c.24-.27.53-.34.71-.34h.51c.16 0 .38-.06.59.45.24.58.81 2 .88 2.14.07.15.12.32.02.51-.09.19-.14.31-.27.48-.14.16-.29.36-.41.49-.14.14-.28.29-.12.57.16.27.71 1.17 1.52 1.9 1.05.94 1.93 1.23 2.21 1.37.27.14.43.12.59-.07.16-.19.68-.79.86-1.06.19-.27.37-.22.63-.13.26.09 1.66.78 1.95.92.29.14.48.21.55.33.07.12.07.69-.17 1.36z" />
    </svg>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function KeyIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <circle cx="8" cy="15" r="4" />
      <path d="M11.5 12.5L20 4l2 2-2 2-2-1-2 2 1 2-2.5 2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function StarIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 3.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L12 16.8 6.7 19.6l1-5.8L3.5 9.7l5.9-.9L12 3.5z" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function GuestsIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19c.8-3 2.8-4.5 5.5-4.5S13.7 16 14.5 19" strokeLinecap="round" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M15.5 19c.4-1.8 1.6-3 3.5-3.2" strokeLinecap="round" />
    </svg>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" strokeLinecap="round" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
