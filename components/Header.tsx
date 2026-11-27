"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Icon, Logo } from "./Icon";
import { EASE, Magnetic } from "./motion";
import { nav, site } from "@/lib/site";

export function Header() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Solid once scrolled; hide while scrolling down, reveal on any upward scroll.
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    setHidden(y > 480 && y > prev + 2 && !open);
    if (y < prev - 2) setHidden(false);
  });

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); toggleRef.current?.focus(); }
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : !href.includes("#") && pathname.startsWith(href));

  return (
    <>
      <motion.div
        className={`site-chrome${scrolled ? " is-scrolled" : ""}`}
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        <motion.div
          className="topbar"
          initial={false}
          animate={{ height: scrolled ? 0 : "auto", opacity: scrolled ? 0 : 1 }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          <div className="container topbar-inner">
            <div className="topbar-group">
              <span className="item"><span className="pulse" aria-hidden="true" /> Plumbers on call 24/7</span>
              <span className="item hide-sm"><Icon name="clock" /> Office: {site.officeHours}</span>
            </div>
            <div className="topbar-group">
              <a className="item hide-sm" href={`mailto:${site.email}`}><Icon name="mail" /> {site.email}</a>
              <a className="item" href={site.phoneHref}><Icon name="phone" /> {site.phoneDisplay}</a>
              <a className="item hide-sm" href={site.phone2Href}>{site.phone2Display}</a>
            </div>
          </div>
        </motion.div>

        <header className="site-header">
          <div className="container header-inner">
            <Link className="brand" href="/" aria-label={`${site.name} home`}>
              <motion.span whileHover={{ rotate: -8, scale: 1.06 }} transition={{ type: "spring", stiffness: 300, damping: 14 }} style={{ display: "inline-flex" }}>
                <Logo className="brand-mark" />
              </motion.span>
              <span className="brand-text">
                <span className="brand-name">Franky<span>Plumbing</span></span>
                <span className="brand-tag">Services</span>
              </span>
            </Link>

            <nav className="nav" aria-label="Main" onMouseLeave={() => setHovered(null)}>
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={isActive(item.href) ? "active" : undefined}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  onMouseEnter={() => setHovered(item.href)}
                >
                  {hovered === item.href && (
                    <motion.span layoutId="nav-hover" className="nav-hover" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
                  )}
                  <span className="nav-label">{item.label}</span>
                  {isActive(item.href) && <motion.span layoutId="nav-active" className="nav-active" />}
                </Link>
              ))}
            </nav>

            <div className="header-cta">
              <a className="header-phone" href={site.phoneHref}>
                <span className="ico"><Icon name="phone" /></span>
                <span><small>Call 24/7</small><strong>{site.phoneShort}</strong></span>
              </a>
              <Magnetic>
                <Link className="btn btn-primary btn-shine" href="/contact">Free Quote</Link>
              </Magnetic>
              <button
                ref={toggleRef}
                className="nav-toggle"
                type="button"
                aria-label="Open menu"
                aria-expanded={open}
                aria-controls="mobile-nav"
                onClick={() => setOpen(true)}
              >
                <Icon name="menu" />
              </button>
            </div>
          </div>
        </header>
      </motion.div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="drawer-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.nav
              id="mobile-nav"
              className="drawer"
              aria-label="Mobile"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
            >
              <button className="nav-toggle drawer-close" type="button" aria-label="Close menu" onClick={() => setOpen(false)} autoFocus>
                <Icon name="close" />
              </button>
              <motion.ul initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.12 } } }}>
                {nav.map((item) => (
                  <motion.li key={item.href} variants={{ hidden: { opacity: 0, x: 30 }, show: { opacity: 1, x: 0, transition: { ease: EASE, duration: 0.5 } } }}>
                    <Link href={item.href} onClick={() => setOpen(false)} aria-current={isActive(item.href) ? "page" : undefined}>
                      {item.label}
                      <Icon name="arrow" />
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
              <motion.div className="drawer-cta" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, ease: EASE }}>
                <a className="btn btn-primary btn-block" href={site.phoneHref}><Icon name="phone" /> Call {site.phoneShort}</a>
                <Link className="btn btn-ghost btn-block" href="/contact" onClick={() => setOpen(false)}>Get a Free Quote</Link>
              </motion.div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
