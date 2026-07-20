import { redirect } from "next/navigation";
import PropertyForm from "@/components/admin/PropertyForm";
import { getAdminSession } from "@/lib/auth";

export default async function NewPropertyPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <div>
      <h1 className="font-display text-4xl text-navy">Add shortlet</h1>
      <p className="mt-2 mb-8 text-sm text-navy/60">
        Add photos, nightly rate, guest limits, and amenities.
      </p>
      <PropertyForm />
    </div>
  );
}
