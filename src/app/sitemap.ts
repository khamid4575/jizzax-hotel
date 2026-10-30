import type { MetadataRoute } from "next";
import { hotel } from "@/lib/hotel";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${hotel.website}/`, changeFrequency: "monthly", priority: 1 },
  ];
}
