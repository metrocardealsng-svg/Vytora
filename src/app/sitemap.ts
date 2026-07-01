import type { MetadataRoute } from "next";
import { competitors, categories } from "@/lib/seo-data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://vytora.app";
  const staticPaths = ["", "/tracker", "/pricing", "/compare", "/login", "/signup"];

  const now = new Date();

  return [
    ...staticPaths.map((p) => ({
      url: `${base}${p}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: p === "" ? 1 : 0.7,
    })),
    ...competitors.map((c) => ({
      url: `${base}/compare/vytora-vs-${c.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...categories.map((c) => ({
      url: `${base}/best/${c.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
