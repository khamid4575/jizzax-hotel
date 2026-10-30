"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";
import { hotel, photo } from "@/lib/hotel";
import { lockScroll, scrollToTarget, unlockScroll } from "@/lib/scroll";
import { keepDialogFocus } from "@/lib/dialog-focus";
import { Arrow, Mark } from "./icons";
import { Magnetic } from "./magnetic";

const links = [
  { title: "The hotel", href: "#about", image: "7aca0fed2df37ef5" },
  { title: "Experiences", href: "#experiences", image: "5f9a6ecdf363f4e4" },
  { title: "Rooms & suites", href: "#stay", image: "8622a179a5251e21" },
  { title: "Gallery", href: "#gallery", image: "d0464e578d38e548" },
  { title: "Find us", href: "#location", image: "f5aa3152a6cc4417" },
];

export function Navigation() {
  const header = useRef<HTMLElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState(0);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Header theme follows the section beneath it; it hides while reading
  // downwards and returns as soon as the visitor scrolls back up.
  useEffect(() => {
    const triggers = gsap.utils
      .toArray<HTMLElement>("[data-header]")
      .map((section) =>
        ScrollTrigger.create({
          trigger: section,
          start: "top 48px",
          end: "bottom 48px",
          onToggle: (self) => {
            if (self.isActive)
              setTheme(section.dataset.header === "light" ? "light" : "dark");
          },
        }),
      );
    let last = window.scrollY;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 40);
        if (Math.abs(y - last) > 6) setHidden(y > last && y > 400);
        last = y;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      triggers.forEach((trigger) => trigger.kill());
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => () => {
    timeline.current?.kill();
  }, []);

  function openMenu() {
    const element = dialog.current;
    if (!element || element.open) return;
    element.showModal();
    lockScroll();
    setOpen(true);
    if (prefersReducedMotion()) return;
    const rect = toggle.current?.getBoundingClientRect();
    const origin = rect
      ? `${rect.left + rect.width / 2}px ${rect.top + rect.height / 2}px`
      : "100% 0%";
    timeline.current?.kill();
    timeline.current = gsap
      .timeline({ defaults: { ease: "expo.out" } })
      .fromTo(
        element,
        { clipPath: `circle(0% at ${origin})` },
        { clipPath: `circle(150% at ${origin})`, duration: 1.1, ease: "expo.inOut" },
      )
      .fromTo(
        element.querySelectorAll(".menu-link-text"),
        { yPercent: 110 },
        { yPercent: 0, stagger: 0.06, duration: 1.1 },
        0.35,
      )
      .fromTo(
        element.querySelectorAll(".menu-index, .menu-aside > *"),
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, stagger: 0.04, duration: 0.9 },
        0.55,
      )
      .fromTo(
        element.querySelector(".menu-preview"),
        { clipPath: "inset(100% 0% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "expo.inOut" },
        0.3,
      );
  }

  function closeMenu(then?: () => void) {
    const element = dialog.current;
    if (!element || !element.open || element.dataset.closing) return;
    const finish = () => {
      timeline.current?.kill();
      gsap.set(element, { clearProps: "clipPath" });
      element.close();
      delete element.dataset.closing;
      setOpen(false);
      if (!then) toggle.current?.focus({ preventScroll: true });
    };
    unlockScroll();
    then?.();
    if (prefersReducedMotion()) {
      finish();
      return;
    }
    element.dataset.closing = "true";
    timeline.current?.kill();
    timeline.current = gsap
      .timeline({ onComplete: finish })
      .to(element.querySelectorAll(".menu-link-text"), {
        yPercent: -110,
        stagger: 0.03,
        duration: 0.45,
        ease: "power3.in",
      })
      .to(
        element,
        { clipPath: "inset(0% 0% 100% 0%)", duration: 0.7, ease: "expo.inOut" },
        0.15,
      );
  }

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header
        ref={header}
        className="header"
        data-theme={theme}
        data-hidden={hidden && !open ? "true" : undefined}
        data-scrolled={scrolled ? "true" : undefined}
      >
        <a className="brand" href="#top" aria-label="Jizzax Hotel home">
          <Mark />
          <span>
            JIZZAX<small>Hotel · Tashkent</small>
          </span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="nav-link">
              <span data-text={link.title}>{link.title}</span>
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <Magnetic strength={0.2}>
            <a className="header-book" href={hotel.booking}>
              Reserve <Arrow diagonal />
            </a>
          </Magnetic>
          <button
            ref={toggle}
            className="menu-toggle"
            type="button"
            aria-label="Open navigation"
            aria-controls="site-menu"
            aria-expanded={open}
            onClick={openMenu}
          >
            <span className="menu-toggle-label">Menu</span>
            <span className="menu-toggle-lines" aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
        </div>
      </header>

      <dialog
        ref={dialog}
        id="site-menu"
        className="menu-dialog"
        aria-label="Site navigation"
        onKeyDown={keepDialogFocus}
        onCancel={(event) => {
          event.preventDefault();
          closeMenu();
        }}
        onClose={() => setOpen(false)}
      >
        <div className="menu-top">
          <span className="menu-brand">
            <Mark /> Jizzax Hotel
          </span>
          <button
            type="button"
            className="menu-close"
            onClick={() => closeMenu()}
            aria-label="Close navigation"
          >
            Close <span aria-hidden="true">×</span>
          </button>
        </div>
        <div className="menu-body">
          <nav aria-label="Site sections" className="menu-links">
            {links.map((link, index) => (
              <a
                key={link.href}
                href={link.href}
                className="menu-link"
                data-active={preview === index ? "true" : undefined}
                onPointerEnter={() => setPreview(index)}
                onFocus={() => setPreview(index)}
                onClick={(event) => {
                  event.preventDefault();
                  closeMenu(() => scrollToTarget(link.href));
                  history.replaceState(null, "", link.href);
                }}
              >
                <span className="menu-index">0{index + 1}</span>
                <span className="menu-link-mask">
                  <span className="menu-link-text">{link.title}</span>
                </span>
                <Arrow diagonal />
              </a>
            ))}
          </nav>
          <div className="menu-preview" aria-hidden="true">
            {links.map((link, index) => (
              <div
                key={link.href}
                className="menu-preview-image"
                data-active={preview === index ? "true" : undefined}
              >
                <Image src={photo(link.image)} alt="" fill sizes="34vw" />
              </div>
            ))}
          </div>
          <div className="menu-aside">
            <a className="button button-ice" href={hotel.booking}>
              Reserve your stay <Arrow diagonal />
            </a>
            <a className="menu-contact" href={hotel.phoneHref}>
              {hotel.phone}
            </a>
            <a className="menu-contact" href={`mailto:${hotel.email}`}>
              {hotel.email}
            </a>
            <address>{hotel.address}</address>
          </div>
        </div>
      </dialog>
    </>
  );
}
