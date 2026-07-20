import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";
import { getActiveProperties } from "@/lib/properties";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.siteUrl;
  const properties = await getActiveProperties();

  const staticRoutes = ["", "/listings", "/about", "/contact"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const propertyRoutes = properties.map((property) => ({
    url: `${base}/properties/${property.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...propertyRoutes];
}
