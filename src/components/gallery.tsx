"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useGsap } from "@/hooks/use-gsap";
import { gsap, MQ, ScrollTrigger } from "@/lib/gsap";
import { galleryImages } from "@/lib/gallery";
import { hotel, photo } from "@/lib/hotel";
import { scrollToTarget } from "@/lib/scroll";
import { Arrow } from "./icons";
import { RevealText } from "./reveal-text";

const Lightbox = dynamic(() => import("./lightbox"), { ssr: false });

export function Gallery() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useGsap(root, (media) => {
    const q = gsap.utils.selector(root);

    media.add(MQ.desktop, () => {
      const element = root.current!;
      const rail = q(".gallery-rail")[0];
      element.classList.add("is-horizontal");
      const distance = () => rail.scrollWidth - window.innerWidth;
      const tween = gsap.to(rail, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: q(".gallery-pin")[0],
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.9,
          invalidateOnRefresh: true,
          onUpdate: (self) =>
            gsap.set(q(".gallery-progress span"), { scaleX: self.progress }),
        },
      });
      trigger.current = tween.scrollTrigger ?? null;

      q(".gallery-frame").forEach((frame) => {
        const image = frame.querySelector(".gallery-image");
        gsap.fromTo(
          image,
          { xPercent: -9 },
          {
            xPercent: 9,
            ease: "none",
            scrollTrigger: {
              trigger: frame,
              containerAnimation: tween,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          },
        );
        gsap.fromTo(
          frame.querySelector(".gallery-mask"),
          { clipPath: "inset(12% 0% 12% 100%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "power3.out",
            scrollTrigger: {
              trigger: frame,
              containerAnimation: tween,
              start: "left 95%",
              end: "left 45%",
              scrub: true,
            },
          },
        );
      });
      gsap.to(q(".gallery-outline"), {
        xPercent: -30,
        ease: "none",
        scrollTrigger: {
          trigger: q(".gallery-pin")[0],
          start: "top top",
          end: () => `+=${distance()}`,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
      return () => {
        element.classList.remove("is-horizontal");
        trigger.current = null;
      };
    });

    media.add(MQ.compact, () => {
      gsap.from(q(".gallery-mask"), {
        clipPath: "inset(0% 0% 100% 0%)",
        duration: 1.4,
        ease: "expo.inOut",
        stagger: 0.12,
        scrollTrigger: { trigger: track.current, start: "top 85%", once: true },
      });
    });
  });

  // Native horizontal scrolling (touch, no-JS, reduced motion) drives the
  // same progress bar as the pinned desktop sequence.
  useEffect(() => {
    const element = track.current;
    if (!element) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = element.scrollWidth - element.clientWidth;
        const bar = root.current?.querySelector<HTMLElement>(
          ".gallery-progress span",
        );
        if (bar && max > 0 && !trigger.current)
          bar.style.transform = `scaleX(${element.scrollLeft / max})`;
      });
    };
    element.addEventListener("scroll", update, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      element.removeEventListener("scroll", update);
    };
  }, []);

  // Keyboard users tabbing through a pinned, transformed rail: scroll the page
  // to the point in the sequence where the focused frame is in view.
  function onFocus(event: React.FocusEvent<HTMLElement>) {
    const st = trigger.current;
    const frame = (event.target as HTMLElement).closest<HTMLElement>(
      ".gallery-frame, .gallery-end",
    );
    if (!st || !frame) return;
    const rail = frame.parentElement!;
    const max = rail.scrollWidth - window.innerWidth;
    const centre =
      frame.offsetLeft + frame.offsetWidth / 2 - window.innerWidth / 2;
    const progress = gsap.utils.clamp(0, 1, centre / max);
    scrollToTarget(st.start + (st.end - st.start) * progress);
  }

  return (
    <section
      ref={root}
      className="gallery"
      id="gallery"
      aria-labelledby="gallery-title"
      data-header="dark"
    >
      <div className="gallery-pin">
        <div className="gallery-head">
          <span className="kicker-label">05 — Through our lens</span>
          <RevealText id="gallery-title">
            Look a little <em>closer.</em>
          </RevealText>
          <p className="gallery-sign">
            <span className="gallery-sign-arrow" aria-hidden="true">
              <Arrow />
            </span>
            <span className="sign-desktop">
              Keep scrolling — the gallery moves sideways
            </span>
            <span className="sign-touch">Swipe sideways through the gallery</span>
          </p>
          <a className="skip-inline" href="#location">
            Skip the gallery
          </a>
        </div>
        <span className="gallery-outline" aria-hidden="true">
          Jizzax · Through our lens · Jizzax
        </span>

        <div
          ref={track}
          className="gallery-track"
          onFocus={onFocus}
          tabIndex={-1}
        >
          <ul className="gallery-rail" aria-label="Hotel photo gallery">
            {galleryImages.map((item, index) => (
              <li className="gallery-frame" key={item.image}>
                <button
                  type="button"
                  aria-label={`Open photograph: ${item.title}`}
                  aria-haspopup="dialog"
                  data-cursor="View"
                  onClick={(event) => {
                    opener.current = event.currentTarget;
                    setLoading(true);
                    setActive(index);
                  }}
                >
                  <span className="gallery-mask">
                    <span className="gallery-image">
                      <Image
                        src={photo(item.image)}
                        alt={item.caption}
                        fill
                        sizes="(max-width: 999px) 78vw, 38vw"
                      />
                    </span>
                  </span>
                  <span className="gallery-caption">
                    <small>0{index + 1}</small>
                    <span>{item.title}</span>
                  </span>
                </button>
              </li>
            ))}
            <li className="gallery-end">
              <p>Your next memories start here.</p>
              <a className="button button-ice" href={hotel.booking}>
                Reserve your stay <Arrow diagonal />
              </a>
            </li>
          </ul>
        </div>

        <div className="gallery-foot">
          <div className="gallery-progress" aria-hidden="true">
            <span />
          </div>
          <p className="gallery-hint" role="status">
            {loading
              ? "Opening photograph…"
              : `${galleryImages.length} photographs. Select one for a closer look.`}
          </p>
        </div>
      </div>

      {active !== null && (
        <Lightbox
          initialIndex={active}
          onReady={() => setLoading(false)}
          onClose={() => {
            setActive(null);
            setLoading(false);
            requestAnimationFrame(() =>
              opener.current?.focus({ preventScroll: true }),
            );
          }}
        />
      )}
    </section>
  );
}
