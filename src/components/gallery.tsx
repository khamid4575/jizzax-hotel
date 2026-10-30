"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRef, useState } from "react";
import { galleryImages } from "@/lib/gallery";
import { photo } from "@/lib/hotel";
import { Arrow } from "./icons";
const Lightbox = dynamic(() => import("./lightbox"), { ssr: false });

export function Gallery() {
  const [active, setActive] = useState<number | null>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const [loading, setLoading] = useState(false);
  return (
    <>
      <div className="gallery-strip" aria-label="Hotel photo gallery">
        {galleryImages.map((item, index) => (
          <button
            className="gallery-tile"
            key={item.image}
            type="button"
            aria-label={`Open photograph: ${item.title}`}
            aria-haspopup="dialog"
            onClick={(event) => {
              opener.current = event.currentTarget;
              setLoading(true);
              setActive(index);
            }}
          >
            <span className="gallery-image">
              <Image
                src={photo(item.image)}
                alt={item.caption}
                fill
                sizes="(max-width: 680px) 82vw, (max-width: 1000px) 45vw, 28vw"
              />
              <span className="gallery-open">
                <Arrow diagonal />
              </span>
            </span>
            <span className="gallery-caption">
              <span>{item.title}</span>
              <small>0{index + 1}</small>
            </span>
          </button>
        ))}
      </div>
      <p className="gallery-hint" role="status">
        {loading
          ? "Opening photograph…"
          : "A closer look. Select a photograph to explore."}
      </p>
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
    </>
  );
}
