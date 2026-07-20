"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import BrandLogo from "@/components/BrandLogo";
import { CloseIcon, MenuIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/listings", label: "Shortlets" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled || open
          ? "bg-navy/95 shadow-[0_10px_40px_rgba(10,10,10,0.25)] backdrop-blur-md"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-8 md:py-3.5">
        <BrandLogo height={50} priority />

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative text-sm tracking-[0.14em] uppercase transition-colors duration-300",
                  active ? "text-gold" : "text-white/85 hover:text-gold"
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <Link href="/listings" className="btn-gold text-xs tracking-[0.16em] uppercase">
            Book a Stay
          </Link>
        </nav>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center text-white lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-white/10 bg-navy transition-all duration-500 lg:hidden",
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav className="flex flex-col gap-1 px-5 py-4">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "py-3 text-sm tracking-[0.14em] uppercase transition-colors",
                  active ? "text-gold" : "text-white/90"
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/listings"
            className="btn-gold mt-2 text-center text-xs tracking-[0.16em] uppercase"
          >
            Book a Stay
          </Link>
        </nav>
      </div>
    </header>
  );
}
