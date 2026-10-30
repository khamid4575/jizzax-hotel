"use client";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { galleryImages } from "@/lib/gallery";
import { photo } from "@/lib/hotel";
import { lockScroll, unlockScroll } from "@/lib/scroll";
import { Arrow } from "./icons";
import { keepDialogFocus } from "@/lib/dialog-focus";

const ease = [0.76, 0, 0.24, 1] as const;

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
  const [[index, direction], setPosition] = useState([initialIndex, 0]);
  const item = galleryImages[index];
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const readyRef = useRef(onReady);
  const move = (step: number) =>
    setPosition(([current]) => [
      (current + step + galleryImages.length) % galleryImages.length,
      step,
    ]);
  useEffect(() => {
    const element = dialog.current;
    lockScroll();
    element?.showModal();
    readyRef.current();
    return () => {
      unlockScroll();
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
        <span>Jizzax / A closer look</span>
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
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={item.image}
            className="lightbox-slide"
            custom={direction}
            variants={{
              enter: (d: number) => ({
                clipPath:
                  d < 0 ? "inset(0% 100% 0% 0%)" : "inset(0% 0% 0% 100%)",
                scale: 1.08,
              }),
              centre: { clipPath: "inset(0% 0% 0% 0%)", scale: 1 },
              exit: (d: number) => ({
                opacity: 0.4,
                x: d < 0 ? "8%" : "-8%",
              }),
            }}
            initial="enter"
            animate="centre"
            exit="exit"
            transition={{ duration: 0.9, ease }}
          >
            <Image
              src={photo(item.image)}
              alt={item.caption}
              fill
              sizes="100vw"
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>
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
