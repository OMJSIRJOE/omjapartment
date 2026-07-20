"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Property } from "@/types/property";

interface PropertyFormProps {
  initial?: Property & { active?: boolean };
}

export default function PropertyForm({ initial }: PropertyFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    slug: initial?.slug || "",
    title: initial?.title || "",
    location: initial?.location || "",
    city: initial?.city || "Lagos",
    address: initial?.address || "",
    bedrooms: initial?.bedrooms ?? 1,
    bathrooms: initial?.bathrooms ?? 1,
    area: initial?.area ?? 1000,
    pricePerNight: initial?.pricePerNight ?? 250000,
    cleaningFee: initial?.cleaningFee ?? 50000,
    maxGuests: initial?.maxGuests ?? 2,
    minNights: initial?.minNights ?? 1,
    rating: initial?.rating ?? 5,
    reviewCount: initial?.reviewCount ?? 0,
    featured: initial?.featured ?? false,
    active: initial?.active ?? true,
    description: initial?.description || "",
    amenities: (initial?.amenities || []).join(", "),
    houseRules: (initial?.houseRules || []).join(", "),
    images: (initial?.images || []).join("\n"),
    checkInNotes: initial?.checkInNotes || "",
  });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      ...form,
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      area: Number(form.area),
      pricePerNight: Number(form.pricePerNight),
      cleaningFee: Number(form.cleaningFee),
      maxGuests: Number(form.maxGuests),
      minNights: Number(form.minNights),
      rating: Number(form.rating),
      reviewCount: Number(form.reviewCount),
      amenities: form.amenities
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      houseRules: form.houseRules
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      images: form.images
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      const res = await fetch(
        initial ? `/api/admin/properties/${initial.id}` : "/api/admin/properties",
        {
          method: initial ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      router.push("/admin/properties");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setLoading(false);
    }
  };

  const field = (key: keyof typeof form, label: string, type = "text") => (
    <label className="block">
      <span className="mb-1.5 block text-[10px] tracking-[0.18em] text-navy/50 uppercase">
        {label}
      </span>
      <input
        className="field"
        type={type}
        value={String(form[key])}
        onChange={(e) =>
          setForm((prev) => ({
            ...prev,
            [key]:
              type === "number"
                ? Number(e.target.value)
                : e.target.value,
          }))
        }
        required={!["rating", "reviewCount"].includes(key)}
      />
    </label>
  );

  return (
    <form onSubmit={onSubmit} className="space-y-5 border border-navy/10 bg-white p-6 md:p-8">
      <div className="grid gap-4 md:grid-cols-2">
        {field("title", "Title")}
        {field("slug", "Slug")}
        {field("location", "Location")}
        {field("city", "City")}
      </div>
      {field("address", "Address")}
      <div className="grid gap-4 md:grid-cols-4">
        {field("bedrooms", "Bedrooms", "number")}
        {field("bathrooms", "Bathrooms", "number")}
        {field("area", "Area (sqft)", "number")}
        {field("maxGuests", "Max guests", "number")}
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {field("pricePerNight", "Price / night (NGN)", "number")}
        {field("cleaningFee", "Caution fee — refundable (NGN)", "number")}
        {field("minNights", "Min nights", "number")}
        {field("rating", "Rating", "number")}
      </div>
      <label className="block">
        <span className="mb-1.5 block text-[10px] tracking-[0.18em] text-navy/50 uppercase">
          Description
        </span>
        <textarea
          className="field min-h-28"
          value={form.description}
          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          required
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-[10px] tracking-[0.18em] text-navy/50 uppercase">
          Amenities (comma separated)
        </span>
        <textarea
          className="field min-h-20"
          value={form.amenities}
          onChange={(e) => setForm((p) => ({ ...p, amenities: e.target.value }))}
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-[10px] tracking-[0.18em] text-navy/50 uppercase">
          House rules (comma separated)
        </span>
        <textarea
          className="field min-h-20"
          value={form.houseRules}
          onChange={(e) => setForm((p) => ({ ...p, houseRules: e.target.value }))}
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-[10px] tracking-[0.18em] text-navy/50 uppercase">
          Check-in instructions (sent to guest after payment)
        </span>
        <textarea
          className="field min-h-24"
          value={form.checkInNotes}
          onChange={(e) => setForm((p) => ({ ...p, checkInNotes: e.target.value }))}
          placeholder={"Self check-in after 2 PM.\nDoor code: ****\nWi-Fi: network / password\nParking: visitor bay 3"}
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-[10px] tracking-[0.18em] text-navy/50 uppercase">
          Image URLs (one per line)
        </span>
        <textarea
          className="field min-h-28"
          value={form.images}
          onChange={(e) => setForm((p) => ({ ...p, images: e.target.value }))}
          required
        />
      </label>
      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => setForm((p) => ({ ...p, featured: e.target.checked }))}
          />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm((p) => ({ ...p, active: e.target.checked }))}
          />
          Active / bookable
        </label>
      </div>
      {error && <p className="text-sm text-red-700">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="btn-gold text-xs tracking-[0.16em] uppercase disabled:opacity-60"
      >
        {loading ? "Saving..." : initial ? "Update shortlet" : "Create shortlet"}
      </button>
    </form>
  );
}
