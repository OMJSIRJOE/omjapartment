import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatNightlyRate } from "@/data/properties";
import DeletePropertyButton from "@/components/admin/DeletePropertyButton";

export default async function AdminPropertiesPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const properties = await prisma.property.findMany({ orderBy: { updatedAt: "desc" } });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl text-navy">Shortlets</h1>
          <p className="mt-2 text-sm text-navy/60">Create and edit apartments guests can book.</p>
        </div>
        <Link href="/admin/properties/new" className="btn-gold text-xs tracking-[0.16em] uppercase">
          Add shortlet
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto border border-navy/10 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-navy/10 bg-mist text-xs tracking-[0.14em] text-navy/50 uppercase">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Rate</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((property) => (
              <tr key={property.id} className="border-b border-navy/8">
                <td className="px-4 py-4 font-medium">{property.title}</td>
                <td className="px-4 py-4 text-navy/65">{property.location}</td>
                <td className="px-4 py-4">{formatNightlyRate(property.pricePerNight)}</td>
                <td className="px-4 py-4 uppercase tracking-[0.12em] text-navy/50">
                  {property.active ? "Active" : "Hidden"}
                  {property.featured ? " · Featured" : ""}
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/admin/properties/${property.id}`}
                      className="text-xs tracking-[0.12em] text-gold-dark uppercase hover:underline"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/properties/${property.slug}`}
                      className="text-xs tracking-[0.12em] text-navy/60 uppercase hover:underline"
                    >
                      View
                    </Link>
                    <DeletePropertyButton id={property.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
