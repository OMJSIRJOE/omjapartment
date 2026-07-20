"use client";

import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Property } from "@/types/property";

interface PropertyFormProps {
  initial?: Property & { active?: boolean };
}

export default function PropertyForm({ initial }: PropertyFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<string[]>(initial?.images || []);
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
    checkInNotes: initial?.checkInNotes || "",
  });

  const uploadFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    setError("");

    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const body = new FormData();
        body.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
        uploaded.push(data.url as string);
      }
      setImages((prev) => [...prev, ...uploaded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    setImages((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (images.length < 1) {
      setError("Add at least one photo");
      setLoading(false);
      return;
    }

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
      images,
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
            [key]: type === "number" ? Number(e.target.value) : e.target.value,
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
          placeholder={
            "Self check-in after 2 PM.\nDoor code: ****\nWi-Fi: network / password\nParking: visitor bay 3"
          }
        />
      </label>

      <div className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[10px] tracking-[0.18em] text-navy/50 uppercase">Photos</p>
            <p className="mt-1 text-sm text-navy/60">
              First photo is the cover. JPG, PNG, or WebP up to 8 MB.
            </p>
          </div>
          <label className="btn-outline-navy cursor-pointer px-4 py-2 text-xs tracking-[0.14em] uppercase">
            {uploading ? "Uploading..." : "Upload photos"}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              className="hidden"
              disabled={uploading}
              onChange={(e) => uploadFiles(e.target.files)}
            />
          </label>
        </div>

        {images.length > 0 ? (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((url, index) => (
              <li key={`${url}-${index}`} className="border border-navy/10 bg-cream/40 p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`Listing photo ${index + 1}`} className="h-36 w-full object-cover" />
                <div className="mt-2 flex items-center justify-between gap-2 text-xs">
                  <span className="text-navy/50">{index === 0 ? "Cover" : `Photo ${index + 1}`}</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="text-navy/70 underline disabled:opacity-30"
                      disabled={index === 0}
                      onClick={() => moveImage(index, -1)}
                    >
                      Up
                    </button>
                    <button
                      type="button"
                      className="text-navy/70 underline disabled:opacity-30"
                      disabled={index === images.length - 1}
                      onClick={() => moveImage(index, 1)}
                    >
                      Down
                    </button>
                    <button
                      type="button"
                      className="text-red-700 underline"
                      onClick={() => removeImage(index)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="border border-dashed border-navy/20 px-4 py-8 text-center text-sm text-navy/50">
            No photos yet — upload from your phone or computer.
          </p>
        )}

        <label className="block">
          <span className="mb-1.5 block text-[10px] tracking-[0.18em] text-navy/50 uppercase">
            Or paste image URLs (one per line)
          </span>
          <textarea
            className="field min-h-20"
            value={images.join("\n")}
            onChange={(e) =>
              setImages(
                e.target.value
                  .split("\n")
                  .map((s) => s.trim())
                  .filter(Boolean)
              )
            }
            placeholder="https://..."
          />
        </label>
      </div>

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
        disabled={loading || uploading}
        className="btn-gold text-xs tracking-[0.16em] uppercase disabled:opacity-60"
      >
        {loading ? "Saving..." : initial ? "Update shortlet" : "Create shortlet"}
      </button>
    </form>
  );
}
