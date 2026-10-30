"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGsap } from "@/hooks/use-gsap";
import { gsap, MQ, SplitText } from "@/lib/gsap";
import { photo } from "@/lib/hotel";
import { Arrow } from "./icons";
import { Magnetic } from "./magnetic";

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, (media) => {
    const q = gsap.utils.selector(root);
    media.add(MQ.motion, () => {
      const split = SplitText.create(q(".hero-title"), {
        type: "lines,chars",
        mask: "lines",
        charsClass: "hero-char",
        linesClass: "hero-split-line",
      });
      gsap.set(q("[data-hero-hide]"), { autoAlpha: 1 });
      const intro = gsap.timeline({ defaults: { ease: "expo.out" } });
      intro
        .fromTo(
          q(".hero-media"),
          { clipPath: "inset(24% 30% 24% 30% round 220px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 0px)",
            duration: 2,
            ease: "expo.inOut",
          },
        )
        .fromTo(
          q(".hero-image"),
          { scale: 1.45, rotate: -2 },
          { scale: 1.08, rotate: 0, duration: 2.6 },
          0,
        )
        .from(q(".hero-shade"), { opacity: 0, duration: 1.6 }, 0.6)
        .from(
          q(".hero-rule"),
          {
            scaleY: 0,
            transformOrigin: "50% 0%",
            stagger: 0.08,
            duration: 1.8,
            ease: "expo.inOut",
          },
          0.3,
        )
        .from(
          split.chars,
          {
            yPercent: 118,
            rotate: 8,
            transformOrigin: "0% 100%",
            stagger: { each: 0.028, from: "start" },
            duration: 1.5,
          },
          1.05,
        )
        .from(
          q(".hero-eyebrow, .hero-lede, .hero-meta > *"),
          { y: 24, autoAlpha: 0, stagger: 0.08, duration: 1.2 },
          1.5,
        )
        .from(
          q(".hero-badge"),
          { scale: 0.4, rotate: -120, autoAlpha: 0, duration: 1.8 },
          1.6,
        );
      return () => split.revert();
    });

    media.add(MQ.desktop, () => {
      // The hero holds still while the next chapter slides over it.
      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            pin: true,
            pinSpacing: false,
            scrub: 0.6,
          },
        })
        .fromTo(q(".hero-media"), { scale: 1, yPercent: 0 }, { scale: 1.18, yPercent: 7 }, 0)
        .to(q(".hero-line-1"), { xPercent: -18, opacity: 0 }, 0)
        .to(q(".hero-line-2"), { xPercent: 14, opacity: 0 }, 0)
        .to(q(".hero-veil"), { opacity: 0.85 }, 0)
        .to(q(".hero-eyebrow, .hero-lede, .hero-meta, .hero-badge"), {
          y: -60,
          opacity: 0,
          duration: 0.5,
        }, 0);
    });

    media.add(MQ.compact, () => {
      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        })
        .fromTo(q(".hero-media"), { yPercent: 0, scale: 1 }, { yPercent: 14, scale: 1.12 }, 0)
        .to(q(".hero-content"), { yPercent: -18, opacity: 0.2 }, 0);
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
        <div className="hero-veil" />
      </div>
      <div className="hero-rules" aria-hidden="true">
        <span className="hero-rule" />
        <span className="hero-rule" />
        <span className="hero-rule" />
        <span className="hero-rule" />
      </div>

      <div className="hero-content">
        <p className="hero-eyebrow" data-hero-hide>
          <span className="live-dot" aria-hidden="true" /> Jizzax Hotel ·
          Tashkent
        </p>
        <h1 id="hero-title" className="hero-title" data-hero-hide>
          <span className="hero-line hero-line-1">The city outside.</span>
          <span className="hero-line hero-line-2">
            Your world <em>within.</em>
          </span>
        </h1>
        <p className="hero-lede" data-hero-hide>
          Rooted in Uzbek warmth, near New Uzbekistan Park. A contemporary
          retreat made for your time in Tashkent.
        </p>
      </div>

      <Magnetic className="hero-badge-wrap" strength={0.25}>
        <a
          className="hero-badge"
          href="#stay"
          data-hero-hide
          aria-label="Discover rooms and suites"
        >
          <svg viewBox="0 0 200 200" aria-hidden="true" className="badge-ring">
            <defs>
              <path
                id="badge-circle"
                d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0"
              />
            </defs>
            <text>
              <textPath href="#badge-circle" textLength="482" lengthAdjust="spacing">
                DISCOVER ROOMS · RESERVE YOUR STAY ·
              </textPath>
            </text>
          </svg>
          <span className="badge-core">
            <Arrow diagonal />
          </span>
        </a>
      </Magnetic>

      <div className="hero-meta" data-hero-hide>
        <span>Mirzo Ulugbek district</span>
        <span className="hero-coords">41°19′49″N · 69°26′40″E</span>
        <a href="#about" className="scroll-cue">
          <span className="scroll-cue-line" aria-hidden="true" /> Scroll to
          enter
        </a>
      </div>
    </section>
  );
}
