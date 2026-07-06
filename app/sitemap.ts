import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://www.vsevochart.com",
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://www.vsevochart.com/stats",
      changeFrequency: "daily",
      priority: 0.5,
    },
  ];
}
