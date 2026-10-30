"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { galleryImages } from "@/lib/gallery";
import { photo } from "@/lib/hotel";
import { Arrow } from "./icons";
import { keepDialogFocus } from "@/lib/dialog-focus";

export default function Lightbox({
  initialIndex,
  onClose,
  onReady,
}: {
  initialIndex: number;
  onClose: () => void;
  onReady: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const gesture = useRef<{ x: number; y: number } | null>(null);
  const [index, setIndex] = useState(initialIndex);
  const item = galleryImages[index];
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const readyRef = useRef(onReady);
  const move = (direction: number) =>
    setIndex(
      (current) =>
        (current + direction + galleryImages.length) % galleryImages.length,
    );
  useEffect(() => {
    const element = dialog.current;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    element?.showModal();
    readyRef.current();
    return () => {
      document.body.style.overflow = overflow;
      element?.close();
    };
  }, []);
  return (
    <dialog
      className="lightbox"
      ref={dialog}
      aria-labelledby="lightbox-title"
      onCancel={(event) => {
        event.preventDefault();
        closeRef.current();
      }}
      onKeyDown={(event) => {
        keepDialogFocus(event);
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          move(-1);
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          move(1);
        }
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) closeRef.current();
      }}
    >
      <div className="lightbox-top">
        <span>JIZZAX / A CLOSER LOOK</span>
        <button
          className="lightbox-close"
          type="button"
          onClick={() => closeRef.current()}
          autoFocus
          aria-label="Close gallery"
        >
          Close <span aria-hidden="true">×</span>
        </button>
      </div>
      <div
        className="lightbox-image"
        onPointerDown={(event) => {
          gesture.current = { x: event.clientX, y: event.clientY };
        }}
        onPointerCancel={() => {
          gesture.current = null;
        }}
        onPointerUp={(event) => {
          if (!gesture.current) return;
          const x = event.clientX - gesture.current.x;
          const y = event.clientY - gesture.current.y;
          if (Math.abs(x) > 50 && Math.abs(x) > Math.abs(y) * 1.5)
            move(x < 0 ? 1 : -1);
          gesture.current = null;
        }}
      >
        <Image
          key={item.image}
          src={photo(item.image)}
          alt={item.caption}
          fill
          sizes="100vw"
          draggable={false}
        />
      </div>
      <div className="lightbox-bottom">
        <div aria-live="polite" aria-atomic="true">
          <h2 id="lightbox-title">{item.title}</h2>
          <p>{item.caption}</p>
        </div>
        <div className="lightbox-controls">
          <button
            className="round-button"
            type="button"
            onClick={() => move(-1)}
            aria-label="Previous photograph"
          >
            <Arrow className="arrow-back" />
          </button>
          <span>
            {index + 1} / {galleryImages.length}
          </span>
          <button
            className="round-button"
            type="button"
            onClick={() => move(1)}
            aria-label="Next photograph"
          >
            <Arrow />
          </button>
        </div>
      </div>
    </dialog>
  );
}
