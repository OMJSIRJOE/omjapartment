"use client";

import { FormEvent, useState } from "react";

interface ContactFormProps {
  propertyTitle?: string;
  compact?: boolean;
}

export default function ContactForm({ propertyTitle, compact = false }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || ""),
      message: String(form.get("message") || ""),
      propertyTitle,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to send inquiry");

      if (data.delivered === "whatsapp-fallback" && data.whatsappUrl) {
        window.open(data.whatsappUrl, "_blank", "noopener,noreferrer");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send inquiry");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="border border-gold/40 bg-mist px-6 py-10 text-center">
        <p className="font-display text-2xl text-navy">Thank you</p>
        <p className="mt-3 text-sm text-navy/65">
          An OMJ Apartment advisor will reach out shortly
          {propertyTitle ? ` regarding ${propertyTitle}` : ""}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={compact ? "space-y-4" : "space-y-5"}>
      {propertyTitle && (
        <p className="text-xs tracking-[0.16em] text-gold-dark uppercase">
          Inquiry · {propertyTitle}
        </p>
      )}
      <div className={compact ? "grid gap-4" : "grid gap-5 md:grid-cols-2"}>
        <label className="block md:col-span-1">
          <span className="mb-1.5 block text-[10px] tracking-[0.18em] text-navy/50 uppercase">
            Full Name
          </span>
          <input required name="name" type="text" className="field" placeholder="Your name" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[10px] tracking-[0.18em] text-navy/50 uppercase">
            Email
          </span>
          <input
            required
            name="email"
            type="email"
            className="field"
            placeholder="you@example.com"
          />
        </label>
        <label className="block md:col-span-2">
          <span className="mb-1.5 block text-[10px] tracking-[0.18em] text-navy/50 uppercase">
            Phone
          </span>
          <input name="phone" type="tel" className="field" placeholder="+234 ..." />
        </label>
        <label className="block md:col-span-2">
          <span className="mb-1.5 block text-[10px] tracking-[0.18em] text-navy/50 uppercase">
            Message
          </span>
          <textarea
            required
            name="message"
            rows={compact ? 4 : 5}
            className="field resize-y"
            placeholder={
              propertyTitle
                ? `I am interested in ${propertyTitle}...`
                : "Share your dates, guest count, and preferred neighborhood..."
            }
            defaultValue={
              propertyTitle
                ? `Hello OMJ Apartment, I would like to reserve ${propertyTitle}.`
                : undefined
            }
          />
        </label>
      </div>
      {error && <p className="text-sm text-red-700">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="btn-gold text-xs tracking-[0.18em] uppercase disabled:opacity-60"
      >
        {loading ? "Sending..." : "Send Inquiry"}
      </button>
    </form>
  );
}
