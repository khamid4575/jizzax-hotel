"use client";

import { useEffect, useRef, useState } from "react";
import { hotel } from "@/lib/hotel";
import { Arrow, Mark } from "./icons";
import { keepDialogFocus } from "@/lib/dialog-focus";

const links = [
  ["The hotel", "#about"],
  ["Rooms & suites", "#stay"],
  ["Experiences", "#experiences"],
  ["Gallery", "#gallery"],
  ["Find us", "#location"],
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 32);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  function close() {
    const element = dialog.current;
    if (!element || element.dataset.closing) return;
    const finish = () => {
      element.close();
      delete element.dataset.closing;
      setOpen(false);
      toggle.current?.focus({ preventScroll: true });
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }
    element.dataset.closing = "true";
    element
      .animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 160,
        easing: "ease-out",
      })
      .finished.then(finish, finish);
  }

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className={`header ${scrolled ? "is-scrolled" : ""}`}>
        <a className="brand" href="#top" aria-label="Jizzax Hotel home">
          <Mark />
          <span>
            JIZZAX<small>HOTEL · TASHKENT</small>
          </span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(([title, href]) => (
            <a key={href} href={href}>
              {title}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <a className="header-book" href={hotel.booking}>
            Reserve your stay <Arrow diagonal />
          </a>
          <button
            ref={toggle}
            className="menu-toggle"
            type="button"
            aria-label="Open navigation"
            aria-controls="mobile-menu"
            aria-expanded={open}
            onClick={() => {
              dialog.current?.showModal();
              setOpen(true);
            }}
          >
            <span />
            <span />
          </button>
        </div>
      </header>
      <dialog
        ref={dialog}
        id="mobile-menu"
        className="menu-dialog"
        aria-label="Site navigation"
        onKeyDown={keepDialogFocus}
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === dialog.current) close();
        }}
      >
        <div className="menu-top">
          <span>JIZZAX HOTEL</span>
          <button type="button" onClick={close} aria-label="Close navigation">
            Close ×
          </button>
        </div>
        <nav aria-label="Mobile navigation">
          {links.map(([title, href], index) => (
            <a key={href} href={href} onClick={close}>
              <small>0{index + 1}</small>
              {title}
              <Arrow diagonal />
            </a>
          ))}
        </nav>
        <a className="button button-ice" href={hotel.booking}>
          Reserve your stay <Arrow />
        </a>
        <a className="menu-phone" href={hotel.phoneHref}>
          {hotel.phone}
        </a>
      </dialog>
    </>
  );
}
