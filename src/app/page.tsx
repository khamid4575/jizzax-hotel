import Image from "next/image";
import { Navigation } from "@/components/navigation";
import { RoomCollection } from "@/components/room-collection";
import { Gallery } from "@/components/gallery";
import { Motion } from "@/components/motion";
import { Arrow, Mark } from "@/components/icons";
import { hotel, photo } from "@/lib/hotel";

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

const chapters = [
  {
    index: "01",
    word: "ARRIVE",
    title: "A welcome with soul.",
    text: "Step into a place shaped by Uzbek hospitality. Local patterns, familiar warmth, and time to settle in.",
    image: "7aca0fed2df37ef5",
    alt: "Jizzax Hotel lobby with an ornamental ceiling and glass entrance",
  },
  {
    index: "02",
    word: "LINGER",
    title: "Let the day slow down.",
    text: "Make time for conversation. Find a quiet corner, enjoy the restaurant, or take in the city from the fifth-floor lounge.",
    image: "5f9a6ecdf363f4e4",
    alt: "Seating area at Jizzax Hotel with traditional patterned cushions",
  },
  {
    index: "03",
    word: "CONNECT",
    title: "Bring ideas together.",
    text: "A place to meet, exchange ideas, and make plans. Our conference room and team are here to help.",
    image: "b4227c450f5945ba",
    alt: "Jizzax Hotel conference room with rows of blue upholstered chairs",
  },
];

export default function Home() {
  return (
    <>
      <Navigation />
      <Motion />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
      <main id="main">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="hero-visual">
            <Image
              src={photo("f5aa3152a6cc4417")}
              alt="The blue-windowed facade of Jizzax Hotel in Tashkent"
              fill
              priority
              sizes="(max-width: 680px) 100vw, 80vw"
              quality={85}
            />
            <div className="hero-shade" />
          </div>
          <div className="hero-architecture" aria-hidden="true" />
          <div className="hero-copy">
            <p className="eyebrow hero-caption">
              <span className="live-dot" /> JIZZAX HOTEL · TASHKENT
            </p>
            <h1 id="hero-title">
              <span className="hero-line">
                <span>The city outside.</span>
              </span>
              <span className="hero-line">
                <span>
                  Your world <em>within.</em>
                </span>
              </span>
            </h1>
            <div className="hero-caption hero-description">
              <p>
                Rooted in Uzbek warmth.
                <br />
                Made for your time in Tashkent.
              </p>
              <a
                className="hero-cta"
                data-magnetic
                href="#stay"
                aria-label="Discover rooms and suites"
              >
                <Arrow diagonal />
              </a>
            </div>
          </div>
          <div className="hero-wordmark" aria-hidden="true">
            JIZZAX
          </div>
          <div className="hero-bottom">
            <a href="#about" className="scroll-cue">
              <span className="scroll-line" /> A DIFFERENT PERSPECTIVE
            </a>
            <span>41°19′49.2″N &nbsp; 69°26′40.5″E</span>
            <span>SCROLL TO ENTER ↓</span>
          </div>
        </section>

        <section
          className="intro section-shell"
          id="about"
          aria-labelledby="intro-title"
        >
          <div className="section-kicker">
            <span className="eyebrow">01 / A SENSE OF PLACE</span>
            <span className="section-number">
              INSPIRED BY JIZZAX. AT HOME IN TASHKENT.
            </span>
          </div>
          <div className="intro-layout">
            <div className="intro-copy">
              <h2 id="intro-title" className="intro-title">
                <span className="word">Uzbek</span>{" "}
                <span className="word">warmth.</span>
                <br />
                <span className="word">A new</span>
                <br />
                <em className="word">perspective.</em>
              </h2>
              <div className="intro-body">
                <span className="ornament" aria-hidden="true">
                  ✳
                </span>
                <div>
                  <p>
                    There’s a particular feeling to a place that welcomes you. A
                    thoughtful detail. A familiar warmth. Space to make yourself
                    at home.
                  </p>
                  <p>
                    At Jizzax Hotel, the spirit of Jizzax meets a contemporary
                    Tashkent address, near New Uzbekistan Park.
                  </p>
                  <a
                    className="text-link"
                    href="https://jizzaxhotel.uz/en-gb/about/"
                  >
                    Get to know Jizzax <Arrow diagonal />
                  </a>
                </div>
              </div>
            </div>
            <div className="intro-collage">
              <figure className="intro-photo">
                <Image
                  src={photo("7aca0fed2df37ef5")}
                  alt="The Jizzax lobby, with regional patterns on the ceiling"
                  fill
                  sizes="(max-width: 680px) 90vw, 48vw"
                />
              </figure>
              <figure className="intro-detail">
                <Image
                  src={photo("5f9a6ecdf363f4e4")}
                  alt="Traditional cushions in the hotel seating area"
                  fill
                  sizes="(max-width: 680px) 45vw, 20vw"
                />
              </figure>
              <span className="intro-photo-label">
                THE DETAILS MAKE THE DIFFERENCE.
              </span>
            </div>
          </div>
        </section>

        <section
          className="stay section-shell"
          id="stay"
          aria-labelledby="stay-title"
        >
          <div className="section-kicker">
            <span className="eyebrow">02 / YOUR PRIVATE WORLD</span>
            <span className="section-number">ROOMS & SUITES</span>
          </div>
          <div className="section-heading">
            <h2 id="stay-title">
              Find your <em>blue.</em>
            </h2>
            <p>
              Soft light. A room of your own.
              <br />A stay that moves at your pace.
            </p>
          </div>
          <RoomCollection />
        </section>

        <section
          className="story"
          id="experiences"
          aria-labelledby="experience-title"
        >
          <div className="story-visual" aria-hidden="true">
            {chapters.map((chapter, index) => (
              <div
                className={`story-image story-image-${index + 1}`}
                key={chapter.index}
              >
                <Image src={photo(chapter.image)} alt="" fill sizes="57vw" />
              </div>
            ))}
            <span className="story-image-label">
              JIZZAX / MOMENTS THAT STAY
            </span>
          </div>
          <div className="story-content">
            <div className="section-kicker">
              <span className="eyebrow">03 / MORE THAN A STAY</span>
              <span className="section-number">THE JIZZAX RHYTHM</span>
            </div>
            <h2 className="sr-only" id="experience-title">
              Experiences at Jizzax Hotel
            </h2>
            <div className="story-window">
              <div className="story-track">
                {chapters.map((chapter) => (
                  <article className="story-chapter" key={chapter.index}>
                    <div className="story-mobile-image">
                      <Image
                        src={photo(chapter.image)}
                        alt={chapter.alt}
                        fill
                        sizes="(max-width: 680px) 90vw, 30vw"
                      />
                    </div>
                    <span className="chapter-index">
                      {chapter.index} / {chapter.word}
                    </span>
                    <h3>{chapter.title}</h3>
                    <p>{chapter.text}</p>
                  </article>
                ))}
              </div>
            </div>
            <div className="story-links">
              <a
                className="text-link"
                href="https://jizzaxhotel.uz/en-gb/restaurants/"
              >
                Dining <Arrow diagonal />
              </a>
              <a className="text-link" href="https://jizzaxhotel.uz/en-gb/spa/">
                Wellness <Arrow diagonal />
              </a>
              <a
                className="text-link"
                href={`mailto:${hotel.email}?subject=Meeting%20enquiry`}
              >
                Gatherings <Arrow diagonal />
              </a>
            </div>
            <div className="story-progress" aria-hidden="true">
              <span />
            </div>
          </div>
        </section>

        <section
          className="gallery section-shell"
          id="gallery"
          aria-labelledby="gallery-title"
        >
          <div className="section-kicker">
            <span className="eyebrow">04 / THROUGH OUR LENS</span>
            <span className="section-number">
              REAL SPACES. YOUR NEXT MEMORIES.
            </span>
          </div>
          <div className="section-heading">
            <h2 id="gallery-title">
              Look a little <em>closer.</em>
            </h2>
            <p>
              The light. The details. The feeling.
              <br />A few frames from Jizzax.
            </p>
          </div>
          <Gallery />
        </section>

        <section
          className="location section-shell"
          id="location"
          aria-labelledby="location-title"
        >
          <div className="section-kicker">
            <span className="eyebrow">05 / OUTSIDE YOUR DOOR</span>
            <span className="section-number">TASHKENT, UZBEKISTAN</span>
          </div>
          <div className="location-layout">
            <div className="location-art">
              <Image
                src={photo("f5aa3152a6cc4417")}
                alt="Jizzax Hotel and its surrounding grounds in Tashkent"
                fill
                sizes="(max-width: 680px) 90vw, 48vw"
              />
              <a
                className="location-pin"
                href={hotel.maps}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>YOUR TASHKENT ADDRESS</span>
                <Arrow diagonal />
                <span className="sr-only"> — open map in a new tab</span>
              </a>
            </div>
            <div className="location-copy">
              <p className="eyebrow">NEAR NEW UZBEKISTAN PARK</p>
              <h2 id="location-title">
                Step out.
                <br />
                <em>Take it in.</em>
              </h2>
              <p>
                Morning walks in the park. A day discovering Tashkent. A
                welcoming place to return to.
              </p>
              <address>{hotel.address}</address>
              <a
                className="text-link"
                href={hotel.maps}
                target="_blank"
                rel="noopener noreferrer"
              >
                Get directions <Arrow diagonal />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              <a className="location-contact" href={hotel.phoneHref}>
                {hotel.phone}
              </a>
            </div>
          </div>
        </section>

        <section className="invitation" aria-labelledby="invitation-title">
          <div className="invitation-orbit" aria-hidden="true" />
          <p className="eyebrow">THERE’S A PLACE FOR YOU HERE</p>
          <h2 id="invitation-title">
            <span className="invitation-line">
              <span>Let the city surprise you.</span>
            </span>
            <span className="invitation-line">
              <span>
                Let us <em>welcome you.</em>
              </span>
            </span>
          </h2>
          <a className="button button-ice" data-magnetic href={hotel.booking}>
            Reserve your stay <Arrow diagonal />
          </a>
          <p className="invitation-note">
            Your Jizzax story starts with a stay.
          </p>
        </section>
      </main>
      <footer className="footer section-shell">
        <div className="footer-top">
          <a
            className="brand"
            href="#top"
            aria-label="Jizzax Hotel, back to top"
          >
            <Mark />
            <span>
              JIZZAX<small>HOTEL · TASHKENT</small>
            </span>
          </a>
          <div>
            <span className="eyebrow">FIND YOUR WAY HERE</span>
            <address>{hotel.address}</address>
          </div>
          <div>
            <span className="eyebrow">LET’S CONNECT</span>
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
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Jizzax Hotel</span>
          <span>A DIFFERENT PERSPECTIVE.</span>
          <a href="https://jizzaxhotel.uz/en-gb/about/">
            Stay information & policies <Arrow diagonal />
          </a>
        </div>
      </footer>
    </>
  );
}
