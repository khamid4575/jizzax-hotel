"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGsap } from "@/hooks/use-gsap";
import { gsap, MQ, ScrollTrigger } from "@/lib/gsap";
import { hotel, photo } from "@/lib/hotel";
import { Arrow } from "./icons";
import { Magnetic } from "./magnetic";
import { RevealText } from "./reveal-text";

export function Location() {
  const root = useRef<HTMLElement>(null);
  useGsap(root, (media) => {
    const q = gsap.utils.selector(root);
    media.add(MQ.motion, () => {
      gsap.fromTo(
        q(".location-art"),
        { clipPath: "inset(35% 18% 0% 18% round 999px 999px 0px 0px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 999px 999px 0px 0px)",
          ease: "none",
          scrollTrigger: {
            trigger: q(".location-art")[0],
            start: "top 90%",
            end: "center 55%",
            scrub: true,
          },
        },
      );
      gsap.fromTo(
        q(".location-art img"),
        { scale: 1.35, yPercent: -6 },
        {
          scale: 1.05,
          yPercent: 6,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
      gsap.from(q(".location-copy > :not(h2)"), {
        y: 30,
        autoAlpha: 0,
        stagger: 0.08,
        duration: 1.1,
        scrollTrigger: { trigger: q(".location-copy")[0], start: "top 80%", once: true },
      });
    });
  });

  return (
    <section
      ref={root}
      className="location"
      id="location"
      aria-labelledby="location-title"
      data-header="light"
    >
      <div className="kicker">
        <span>06 — Outside your door</span>
        <span>Tashkent, Uzbekistan</span>
      </div>
      <div className="location-layout">
        <div className="location-art">
          <Image
            src={photo("f5aa3152a6cc4417")}
            alt="Jizzax Hotel and its surrounding grounds in Tashkent"
            fill
            sizes="(max-width: 999px) 92vw, 50vw"
          />
          <a
            className="location-pin"
            href={hotel.maps}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="pin-pulse" aria-hidden="true" />
            <span>Your Tashkent address</span>
            <Arrow diagonal />
            <span className="sr-only"> — open map in a new tab</span>
          </a>
        </div>
        <div className="location-copy">
          <p className="eyebrow">Near New Uzbekistan Park</p>
          <RevealText id="location-title">
            Step out. <em>Take it in.</em>
          </RevealText>
          <p>
            Morning walks in the park. A day discovering Tashkent. A welcoming
            place to return to.
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
  );
}

export function Invitation() {
  const root = useRef<HTMLElement>(null);
  useGsap(root, (media) => {
    const q = gsap.utils.selector(root);
    media.add(MQ.motion, () => {
      // Marquee drifts constantly and surges with scroll velocity.
      const rows = q(".marquee-row");
      const loops = rows.map((row, index) =>
        gsap.fromTo(
          row,
          { xPercent: index % 2 ? -50 : 0 },
          {
            xPercent: index % 2 ? 0 : -50,
            duration: 38,
            ease: "none",
            repeat: -1,
            paused: true,
          },
        ),
      );
      let boost = 1;
      const trigger = ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => loops.forEach((loop) => loop.paused(!self.isActive)),
        onUpdate: (self) => {
          boost = gsap.utils.clamp(1, 7, 1 + Math.abs(self.getVelocity()) / 400);
          loops.forEach((loop) => loop.timeScale(boost));
        },
      });
      const settle = gsap.ticker.add(() => {
        if (boost <= 1.01) return;
        boost += (1 - boost) * 0.06;
        loops.forEach((loop) => loop.timeScale(boost));
      });
      gsap.from(q(".invitation-cta"), {
        scale: 0.7,
        autoAlpha: 0,
        duration: 1.4,
        scrollTrigger: { trigger: root.current, start: "top 70%", once: true },
      });
      return () => {
        trigger.kill();
        gsap.ticker.remove(settle);
      };
    });
  });

  const phrase = "Reserve your stay · Jizzax Hotel · Tashkent · ";
  return (
    <section
      ref={root}
      className="invitation"
      aria-labelledby="invitation-title"
      data-header="dark"
    >
      <div className="marquee" aria-hidden="true">
        {[0, 1].map((row) => (
          <div className="marquee-row" key={row}>
            <span>{phrase.repeat(3)}</span>
            <span>{phrase.repeat(3)}</span>
          </div>
        ))}
      </div>
      <div className="invitation-inner">
        <p className="eyebrow">There’s a place for you here</p>
        <RevealText id="invitation-title" className="invitation-title">
          Let the city surprise you. <em>Let us welcome you.</em>
        </RevealText>
        <div className="invitation-cta">
          <Magnetic strength={0.4}>
            <a className="cta-orb" href={hotel.booking} data-cursor="Book">
              <span>Reserve your stay</span>
              <Arrow diagonal />
            </a>
          </Magnetic>
        </div>
        <p className="invitation-note">Your Jizzax story starts with a stay.</p>
      </div>
    </section>
  );
}
