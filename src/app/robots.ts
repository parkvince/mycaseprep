import type { MetadataRoute } from "next";

const BASE_URL = "https://mycaseprep.org";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/library", "/history", "/settings", "/case", "/api", "/auth"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
