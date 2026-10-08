import type { MetadataRoute } from "next";
import { policies } from "@/data/policies";
import { services } from "@/data/services";
import { site } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const paths = [
    "",
    "/services",
    "/pricing",
    "/about",
    "/faq",
    "/contact",
    "/login",
    "/signup",
    ...services.map((s) => `/services/${s.id}`),
    ...policies.map((p) => `/policies/${p.slug}`),
  ];
  return paths.map((path) => ({
    url: `${site.url}${path || "/"}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
