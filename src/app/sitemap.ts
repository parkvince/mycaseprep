import type { MetadataRoute } from "next";

const BASE_URL = "https://mycaseprep.org";

const FIRM_SLUGS = [
  "mckinsey", "bcg", "bain", "ey-parthenon", "deloitte", "kpmg", "pwc",
  "roland-berger", "accenture", "oliver-wyman", "kearney", "lek",
  "monitor-deloitte", "ibm", "huron", "capital-one",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: BASE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/guide`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    ...FIRM_SLUGS.map((slug) => ({
      url: `${BASE_URL}/guide/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
