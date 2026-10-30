"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { photo, rooms } from "@/lib/hotel";
import { Arrow } from "./icons";

const categories = ["All rooms", "Standard", "Deluxe", "Suites"] as const;
export function RoomCollection() {
  const [selected, setSelected] = useState(4);
  const [previous, setPrevious] = useState(4);
  const [category, setCategory] = useState<string>("All rooms");
  const gesture = useRef<{ x: number; y: number } | null>(null);
  const selector = useRef<HTMLDivElement>(null);
  const room = rooms[selected];
  const filtered = rooms
    .map((item, index) => ({ ...item, index }))
    .filter((item) => category === "All rooms" || item.category === category);
  useEffect(() => {
    const list = selector.current;
    const active = list?.querySelector<HTMLButtonElement>(
      '[aria-pressed="true"]',
    );
    if (!list || !active || !window.matchMedia("(max-width: 999px)").matches)
      return;
    list.scrollTo({
      left:
        active.offsetLeft -
        list.offsetLeft -
        (list.clientWidth - active.clientWidth) / 2,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }, [selected, category]);
  function choose(index: number) {
    setPrevious(selected);
    setSelected(index);
  }
  function move(direction: number) {
    const current = filtered.findIndex((item) => item.index === selected);
    choose(
      filtered[(current + direction + filtered.length) % filtered.length].index,
    );
  }
  return (
    <div className="room-collection">
      <div className="room-toolbar">
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
                setCategory(item);
                if (item !== "All rooms" && rooms[selected].category !== item)
                  choose(rooms.findIndex((room) => room.category === item));
              }}
            >
              {item}
            </button>
          ))}
        </div>
        <span className="room-count">EIGHT WAYS TO FEEL AT HOME</span>
      </div>
      <div className="room-showcase">
        <div
          ref={selector}
          className="room-selector"
          role="group"
          aria-label="Choose your room"
        >
          {filtered.map((item) => (
            <button
              key={item.index}
              type="button"
              className={item.index === selected ? "selected" : ""}
              aria-pressed={item.index === selected}
              onClick={() => choose(item.index)}
            >
              <span className="room-selection-number">0{item.index + 1}</span>
              <span>{item.shortName}</span>
              <Arrow diagonal />
            </button>
          ))}
        </div>
        <div
          className="room-stage"
          role="region"
          aria-label="Room photographs; swipe or use the arrow buttons to explore"
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
          {previous !== selected && (
            <Image
              src={photo(rooms[previous].image)}
              alt=""
              aria-hidden="true"
              fill
              sizes="(max-width: 999px) 100vw, 67vw"
              draggable={false}
            />
          )}
          <div className="room-photograph" key={room.image}>
            <Image
              src={photo(room.image)}
              alt={room.name}
              fill
              sizes="(max-width: 999px) 100vw, 67vw"
              draggable={false}
            />
          </div>
          <div className="room-image-shade" />
          <span className="room-image-label">JIZZAX / THE ROOM COLLECTION</span>
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
              0{selected + 1} / 08
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
        <div className="room-description" key={room.name}>
          <div>
            <p className="eyebrow">
              {room.bed} ·{" "}
              {room.balcony ? "PRIVATE BALCONY" : "YOUR OWN RETREAT"}
            </p>
            <h3>{room.shortName}</h3>
          </div>
          <a className="button button-blue" href={room.bookingUrl}>
            Reserve this room <Arrow diagonal />
          </a>
        </div>
      </div>
      <div className="room-amenities">
        <span>Smart TV</span>
        <span>Wi-Fi</span>
        <span>Air conditioning</span>
        <span>Tea set</span>
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
