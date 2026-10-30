import type { Metadata, Viewport } from "next";
import "./globals.css";
import { hotel, photo } from "@/lib/hotel";

export const metadata: Metadata = {
  metadataBase: new URL(hotel.website),
  title: "Jizzax Hotel | Your world within Tashkent",
  icons: { icon: "/img/38f655103e3d41ca.webp" },
  description:
    "Discover Jizzax Hotel in Tashkent, near New Uzbekistan Park. Explore rooms and suites, dining, a fifth-floor lounge and spaces to unwind. Book your stay directly.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: hotel.name,
    title: "Jizzax Hotel — Your world within Tashkent",
    description:
      "Uzbek warmth. A contemporary retreat. Discover your next stay in Tashkent.",
    images: [{ url: photo("f5aa3152a6cc4417"), alt: "Jizzax Hotel, Tashkent" }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#071d35" };

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
