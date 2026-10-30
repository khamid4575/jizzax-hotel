"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGsap } from "@/hooks/use-gsap";
import { gsap, MQ, SplitText } from "@/lib/gsap";
import { hotel, photo } from "@/lib/hotel";
import { Arrow } from "./icons";
import { Magnetic } from "./magnetic";
import { Rosette } from "./rosette";

const OPEN = "inset(0vh 0vw 0vh 0vw round 0vw 0vw 0vw 0vw)";

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, (media) => {
    const q = gsap.utils.selector(root);
    // The arch geometry lives in CSS (per breakpoint); motion reads it here.
    const arch = (name: string) =>
      getComputedStyle(root.current!).getPropertyValue(name).trim();

    media.add(MQ.motion, () => {
      const split = SplitText.create(q(".hero-title"), {
        type: "lines,words,chars",
        mask: "lines",
        charsClass: "hero-char",
        linesClass: "hero-split-line",
      });
      gsap.set(q("[data-hero-hide]"), { autoAlpha: 1 });
      gsap
        .timeline({ defaults: { ease: "expo.out" } })
        .fromTo(
          q(".hero-rosette [pathLength]"),
          { strokeDasharray: "1 1", strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 2.8, stagger: 0.14, ease: "power2.inOut" },
          0,
        )
        .fromTo(
          q(".hero-media"),
          { clipPath: arch("--arch-closed") },
          { clipPath: arch("--arch"), duration: 1.9, ease: "expo.inOut" },
          0.2,
        )
        .fromTo(q(".hero-image"), { scale: 1.5 }, { scale: 1.12, duration: 2.6 }, 0.2)
        .fromTo(
          q(".hero-arch-line"),
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 2.1, ease: "expo.inOut" },
          0.55,
        )
        .from(
          split.chars,
          { yPercent: 105, opacity: 0, stagger: 0.032, duration: 1.6 },
          0.9,
        )
        .from(
          q(".hero-eyebrow, .hero-lede, .hero-reserve, .hero-meta > *, .hero-coords"),
          { y: 18, autoAlpha: 0, stagger: 0.07, duration: 1.2 },
          1.5,
        );
      return () => split.revert();
    });

    media.add(MQ.desktop, () => {
      // Pinned: the arch opens onto the full facade before the page moves on.
      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=120%",
            pin: true,
            scrub: 0.7,
          },
        })
        .fromTo(q(".hero-media"), { clipPath: arch("--arch") }, { clipPath: OPEN, duration: 1 }, 0)
        .fromTo(q(".hero-image"), { scale: 1.12 }, { scale: 1, duration: 1 }, 0)
        .to(q(".hero-arch-line"), { autoAlpha: 0, scale: 1.3, duration: 0.4 }, 0)
        .to(q(".hero-rosette"), { rotate: 45, scale: 1.5, autoAlpha: 0, duration: 0.8 }, 0)
        .to(q(".hero-split-line"), { yPercent: -60, autoAlpha: 0, stagger: 0.06, duration: 0.45 }, 0)
        .to(q(".hero-eyebrow, .hero-foot, .hero-meta, .hero-coords"), { autoAlpha: 0, duration: 0.3 }, 0)
        .fromTo(q(".hero-after"), { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.35 }, 0.7)
        .to({}, { duration: 0.2 });
    });

    media.add(MQ.compact, () => {
      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom 30%",
            scrub: true,
          },
        })
        .fromTo(q(".hero-media"), { clipPath: arch("--arch") }, { clipPath: OPEN }, 0)
        .to(q(".hero-content"), { yPercent: 20, autoAlpha: 0 }, 0)
        .to(q(".hero-rosette, .hero-arch-line"), { autoAlpha: 0 }, 0);
    });
  });

  return (
    <section
      ref={root}
      className="hero"
      id="top"
      aria-labelledby="hero-title"
      data-header="dark"
    >
      <Rosette className="hero-rosette" />
      <div className="hero-media">
        <div className="hero-image">
          <Image
            src={photo("f5aa3152a6cc4417")}
            alt="The blue-windowed facade of Jizzax Hotel in Tashkent"
            fill
            priority
            sizes="100vw"
            quality={85}
          />
        </div>
        <div className="hero-shade" />
      </div>
      <span className="hero-arch-line" aria-hidden="true" />

      <div className="hero-content">
        <p className="hero-eyebrow" data-hero-hide>
          <span className="live-dot" aria-hidden="true" /> Jizzax Hotel ·
          Tashkent
        </p>
        <h1 id="hero-title" className="hero-title" data-hero-hide>
          <span className="hero-line">The city outside.</span>
          <span className="hero-line">
            Your world <em>within.</em>
          </span>
        </h1>
        <div className="hero-foot">
          <p className="hero-lede" data-hero-hide>
            Rooted in Uzbek warmth, near New Uzbekistan Park. A contemporary
            retreat made for your time in Tashkent.
          </p>
          <Magnetic strength={0.25}>
            <a className="hero-reserve" href={hotel.booking} data-hero-hide>
              <span>Reserve your stay</span>
              <Arrow diagonal />
            </a>
          </Magnetic>
        </div>
      </div>

      <p className="hero-coords" data-hero-hide aria-hidden="true">
        41°19′49″N · 69°26′40″E
      </p>
      <p className="hero-after" aria-hidden="true">
        A different <em>perspective.</em>
      </p>

      <div className="hero-meta" data-hero-hide>
        <span>Mirzo Ulugbek district</span>
        <a href="#about" className="scroll-cue">
          <span className="scroll-cue-line" aria-hidden="true" /> Scroll to
          open
        </a>
      </div>
    </section>
  );
}
