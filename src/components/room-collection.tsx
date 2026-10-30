"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Flip, gsap, prefersReducedMotion, SplitText } from "@/lib/gsap";
import { photo, rooms } from "@/lib/hotel";
import { Arrow } from "./icons";
import { Magnetic } from "./magnetic";

const categories = ["All rooms", "Standard", "Deluxe", "Suites"] as const;
const INITIAL = 4;
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

export function RoomCollection() {
  const [selected, setSelected] = useState(INITIAL);
  const [category, setCategory] = useState<string>("All rooms");
  const shown = useRef(INITIAL);
  const layers = useRef<(HTMLDivElement | null)[]>([]);
  const detail = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLOListElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const gesture = useRef<{ x: number; y: number } | null>(null);
  const room = rooms[selected];
  const filtered = rooms
    .map((item, index) => ({ ...item, index }))
    .filter((item) => category === "All rooms" || item.category === category);

  // Photograph transition: the incoming room wipes across in the direction of
  // travel while the outgoing image drifts the other way.
  useIsomorphicLayoutEffect(() => {
    const previous = shown.current;
    shown.current = selected;
    const incoming = layers.current[selected];
    const outgoing = layers.current[previous];
    if (!incoming) return;
    const context = gsap.context(() => {
      layers.current.forEach((layer, index) => {
        if (layer && index !== selected && index !== previous)
          gsap.set(layer, { autoAlpha: 0, zIndex: 0 });
      });
      if (previous === selected || !outgoing || prefersReducedMotion()) {
        gsap.set(incoming, { autoAlpha: 1, zIndex: 2, clipPath: "none" });
        if (outgoing && outgoing !== incoming)
          gsap.set(outgoing, { autoAlpha: 0 });
        return;
      }
      const direction = selected > previous ? 1 : -1;
      gsap.set(outgoing, { zIndex: 1, autoAlpha: 1 });
      gsap.set(incoming, { zIndex: 2, autoAlpha: 1 });
      gsap
        .timeline({ defaults: { duration: 1.25, ease: "expo.inOut" } })
        .fromTo(
          incoming,
          {
            clipPath:
              direction > 0 ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)",
          },
          { clipPath: "inset(0% 0% 0% 0%)" },
        )
        .fromTo(
          incoming.querySelector("img"),
          { scale: 1.35, xPercent: 12 * direction },
          { scale: 1, xPercent: 0, duration: 1.6, ease: "expo.out" },
          0,
        )
        .fromTo(
          outgoing.querySelector("img"),
          { scale: 1, xPercent: 0 },
          { scale: 1.12, xPercent: -14 * direction },
          0,
        )
        .set(outgoing, { autoAlpha: 0 });

      const target = detail.current;
      if (!target) return;
      const split = SplitText.create(target.querySelector("h3"), {
        type: "lines,words,chars",
        mask: "lines",
        linesClass: "room-title-line",
      });
      gsap.from(split.chars, {
        yPercent: 110,
        stagger: 0.018,
        duration: 1.1,
        delay: 0.25,
      });
      gsap.from(target.querySelectorAll("[data-detail]"), {
        y: 24,
        autoAlpha: 0,
        stagger: 0.07,
        duration: 1,
        delay: 0.35,
      });
    });
    return () => context.revert();
  }, [selected]);

  // Filter re-layout with GSAP Flip: surviving rooms glide, new ones rise in.
  useIsomorphicLayoutEffect(() => {
    const state = flipState.current;
    flipState.current = null;
    if (!state || prefersReducedMotion()) return;
    const flip = Flip.from(state, {
      targets: list.current?.querySelectorAll("li"),
      duration: 0.8,
      ease: "expo.inOut",
      stagger: 0.03,
      onEnter: (elements) =>
        gsap.fromTo(
          elements,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.05, delay: 0.2 },
        ),
    });
    return () => {
      flip.progress(1);
      flip.kill();
    };
  }, [category]);

  // Keep the selected chip centred in the compact horizontal selector.
  useEffect(() => {
    const container = list.current;
    const active = container?.querySelector<HTMLButtonElement>(
      '[aria-pressed="true"]',
    );
    if (!container || !active || !window.matchMedia("(max-width: 999px)").matches)
      return;
    container.scrollTo({
      left:
        active.offsetLeft - (container.clientWidth - active.clientWidth) / 2,
      behavior: prefersReducedMotion() ? "instant" : "smooth",
    });
  }, [selected, category]);

  function move(direction: number) {
    const current = filtered.findIndex((item) => item.index === selected);
    setSelected(
      filtered[(current + direction + filtered.length) % filtered.length].index,
    );
  }

  return (
    <div className="room-collection">
      <div
        className="room-filters"
        role="group"
        aria-label="Filter room categories"
      >
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={category === item}
            onClick={() => {
              if (item === category) return;
              if (list.current)
                flipState.current = Flip.getState(
                  list.current.querySelectorAll("li"),
                );
              setCategory(item);
              if (item !== "All rooms" && rooms[selected].category !== item)
                setSelected(rooms.findIndex((entry) => entry.category === item));
            }}
          >
            {category === item && (
              <motion.span
                className="filter-pill"
                layoutId="room-filter-pill"
                transition={{ type: "spring", stiffness: 420, damping: 36 }}
              />
            )}
            <span className="filter-label">{item}</span>
          </button>
        ))}
      </div>

      <div className="room-explorer">
        <ol
          ref={list}
          className="room-list"
          aria-label="Choose your room"
        >
          {filtered.map((item) => (
            <li key={item.name} data-flip-id={item.name}>
              <button
                type="button"
                className={item.index === selected ? "is-selected" : ""}
                aria-pressed={item.index === selected}
                onClick={() => setSelected(item.index)}
              >
                <span className="room-number">0{item.index + 1}</span>
                <span className="room-name">{item.shortName}</span>
                <span className="room-tag">{item.category}</span>
              </button>
            </li>
          ))}
        </ol>

        <div
          className="room-stage"
          role="region"
          aria-label="Room photographs; swipe or use the arrow buttons to explore"
          data-cursor="Drag"
          onPointerDown={(event) => {
            gesture.current = { x: event.clientX, y: event.clientY };
          }}
          onPointerUp={(event) => {
            if (!gesture.current) return;
            const x = event.clientX - gesture.current.x;
            const y = event.clientY - gesture.current.y;
            if (Math.abs(x) > 50 && Math.abs(x) > Math.abs(y) * 1.5)
              move(x < 0 ? 1 : -1);
            gesture.current = null;
          }}
          onPointerCancel={() => {
            gesture.current = null;
          }}
        >
          {rooms.map((item, index) => (
            <div
              key={item.name}
              ref={(element) => {
                layers.current[index] = element;
              }}
              className="room-layer"
              data-start={index === INITIAL ? "" : undefined}
              aria-hidden={index !== selected}
            >
              <Image
                src={photo(item.image)}
                alt={index === selected ? item.name : ""}
                fill
                sizes="(max-width: 999px) 100vw, 56vw"
                draggable={false}
              />
            </div>
          ))}
          <div className="room-shade" />
          <div className="room-controls">
            <button
              type="button"
              className="round-button"
              aria-label="Previous room"
              onClick={() => move(-1)}
            >
              <Arrow className="arrow-back" />
            </button>
            <span aria-live="polite" aria-atomic="true">
              0{selected + 1} <i>/ 08</i>
              <span className="sr-only"> — {room.name}</span>
            </span>
            <button
              type="button"
              className="round-button"
              aria-label="Next room"
              onClick={() => move(1)}
            >
              <Arrow />
            </button>
          </div>
        </div>

        <div className="room-detail" ref={detail} key={room.name}>
          <p className="eyebrow" data-detail>
            {room.category} · {room.bed} ·{" "}
            {room.balcony ? "Private balcony" : "Your own retreat"}
          </p>
          <h3>{room.shortName}</h3>
          <ul className="room-amenities" data-detail>
            <li>Smart TV</li>
            <li>Wi-Fi</li>
            <li>Air conditioning</li>
            <li>Tea set</li>
          </ul>
          <div data-detail>
            <Magnetic strength={0.2}>
              <a className="button button-blue" href={room.bookingUrl}>
                Reserve this room <Arrow diagonal />
              </a>
            </Magnetic>
          </div>
        </div>
      </div>

      <details className="all-room-links">
        <summary>
          View all room booking links <span aria-hidden="true">+</span>
        </summary>
        <div>
          {rooms.map((item) => (
            <a key={item.name} href={item.bookingUrl}>
              {item.name}
              <Arrow diagonal />
            </a>
          ))}
        </div>
      </details>
    </div>
  );
}
