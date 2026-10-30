import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";
import { hotel, photo } from "@/lib/hotel";
import { Providers } from "@/components/providers";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Cursor } from "@/components/cursor";

// next/font downloads both families at build time and serves them locally.
const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});
const sans = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

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

export const viewport: Viewport = { themeColor: "#061a2e" };

// Runs before first paint: entrance states are only hidden when motion is
// allowed, and are released after 3.5s if the scripts never arrive.
const motionFlag = `(function(d){try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.dataset.motion='on';setTimeout(function(){if(!d.dataset.motionReady)delete d.dataset.motion},3500)}catch(e){}})(document.documentElement)`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionFlag }} />
      </head>
      <body>
        <Providers>
          <SmoothScroll />
          <Cursor />
          {children}
        </Providers>
      </body>
    </html>
  );
}
