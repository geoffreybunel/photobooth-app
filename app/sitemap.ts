import type { MetadataRoute } from "next";
import { SITE_URL } from "@/src/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: "/", priority: 1, changeFrequency: "monthly" as const },
    { path: "/Booth", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/About", priority: 0.6, changeFrequency: "yearly" as const },
    { path: "/Contact", priority: 0.5, changeFrequency: "yearly" as const },
    { path: "/Privacy", priority: 0.3, changeFrequency: "yearly" as const },
  ];

  return routes.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
