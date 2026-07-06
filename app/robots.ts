import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/stats/preview",
    },
    sitemap: "https://www.vsevochart.com/sitemap.xml",
  };
}
