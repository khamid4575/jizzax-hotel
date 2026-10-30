import { Navigation } from "@/components/navigation";
import { Hero } from "@/components/hero";
import { Manifesto } from "@/components/manifesto";
import { Expansion } from "@/components/expansion";
import { Story } from "@/components/story";
import { RoomCollection } from "@/components/room-collection";
import { Gallery } from "@/components/gallery";
import { Invitation, Location } from "@/components/finale";
import { RevealText } from "@/components/reveal-text";
import { Arrow, Mark } from "@/components/icons";
import { hotel } from "@/lib/hotel";

const schema = {
  "@context": "https://schema.org",
  "@type": "Hotel",
  name: hotel.name,
  url: hotel.website,
  description:
    "A contemporary hotel near New Uzbekistan Park in Tashkent, with rooms, suites, dining and wellness facilities.",
  image: `${hotel.website}/img/f5aa3152a6cc4417.webp`,
  telephone: "+998555200011",
  email: hotel.email,
  address: {
    "@type": "PostalAddress",
    streetAddress:
      "Milliy Bog str., 80/6, Chingeldi MFY, Mirzo Ulugbek district",
    addressLocality: "Tashkent",
    addressCountry: "UZ",
  },
  geo: { "@type": "GeoCoordinates", latitude: 41.330337, longitude: 69.444573 },
  hasMap: hotel.maps,
};

export default function Home() {
  return (
    <>
      <Navigation />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
      <main id="main">
        <Hero />
        <div className="page-sheet">
          <Manifesto />
          <Expansion />
          <Story />
          <section
            className="rooms"
            id="stay"
            aria-labelledby="stay-title"
            data-header="light"
          >
            <div className="kicker">
              <span>04 — Your private world</span>
              <span>Eight rooms & suites</span>
            </div>
            <div className="rooms-head">
              <RevealText id="stay-title">
                Find your <em>blue.</em>
              </RevealText>
              <p>
                Soft light. A room of your own. A stay that moves at your pace.
              </p>
            </div>
            <RoomCollection />
          </section>
          <Gallery />
          <Location />
          <Invitation />
        </div>
      </main>
      <footer className="footer" data-header="dark">
        <div className="footer-top">
          <a
            className="brand"
            href="#top"
            aria-label="Jizzax Hotel, back to top"
          >
            <Mark />
            <span>
              JIZZAX<small>Hotel · Tashkent</small>
            </span>
          </a>
          <div>
            <span className="eyebrow">Find your way here</span>
            <address>{hotel.address}</address>
          </div>
          <div>
            <span className="eyebrow">Let’s connect</span>
            <a href={hotel.phoneHref}>{hotel.phone}</a>
            <a href={`mailto:${hotel.email}`}>{hotel.email}</a>
          </div>
          <a
            className="back-top round-button"
            href="#top"
            aria-label="Back to top"
          >
            <Arrow diagonal />
          </a>
        </div>
        <p className="footer-word" aria-hidden="true">
          Jizzax
        </p>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Jizzax Hotel</span>
          <span>A different perspective.</span>
          <a href="https://jizzaxhotel.uz/en-gb/about/">
            Stay information & policies <Arrow diagonal />
          </a>
        </div>
      </footer>
    </>
  );
}
