"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@omjapartments.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md border border-navy/10 bg-white p-8 shadow-[0_16px_50px_rgba(10,10,10,0.08)]">
      <p className="text-xs tracking-[0.18em] text-gold-dark uppercase">OMJ Apartment</p>
      <h1 className="mt-2 font-display text-3xl text-navy">Admin login</h1>
      <p className="mt-2 text-sm text-navy/60">Manage shortlets, bookings, and availability.</p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-[10px] tracking-[0.18em] text-navy/50 uppercase">
            Email
          </span>
          <input
            className="field"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[10px] tracking-[0.18em] text-navy/50 uppercase">
            Password
          </span>
          <input
            className="field"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="btn-gold w-full text-xs tracking-[0.18em] uppercase disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
