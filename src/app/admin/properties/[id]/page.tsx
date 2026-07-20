import { notFound, redirect } from "next/navigation";
import PropertyForm from "@/components/admin/PropertyForm";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { mapDbProperty } from "@/lib/property-mapper";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPropertyPage({ params }: PageProps) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const row = await prisma.property.findUnique({ where: { id } });
  if (!row) notFound();

  return (
    <div>
      <h1 className="font-display text-4xl text-navy">Edit shortlet</h1>
      <p className="mt-2 mb-8 text-sm text-navy/60">{row.title}</p>
      <PropertyForm initial={{ ...mapDbProperty(row), active: row.active }} />
    </div>
  );
}
