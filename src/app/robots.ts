import type { MetadataRoute } from "next";
import { hotel } from "@/lib/hotel";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${hotel.website}/sitemap.xml`,
  };
}
