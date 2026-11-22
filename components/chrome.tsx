"use client";

import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import { useState } from "react";
import { Icon } from "./Icon";
import { site, waLink } from "@/lib/site";

/** Thin scroll-progress bar pinned to the top of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  return <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden="true" />;
}

/** WhatsApp bubble (desktop) + sticky call bar (mobile), revealed after the hero. */
export function FloatingActions() {
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setShow(y > 520));

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.a
            key="wa"
            className="wa-float"
            href={waLink()}
            target="_blank"
            rel="noopener"
            aria-label="Chat with us on WhatsApp"
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 90 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
          >
            <span className="wa-ping" aria-hidden="true" />
            <Icon name="whatsapp" />
          </motion.a>
          <motion.div
            key="bar"
            className="mobile-bar"
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            exit={{ y: "110%" }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
          >
            <a className="btn btn-primary" href={site.phoneHref}><Icon name="phone" /> Call Now</a>
            <a className="btn btn-whatsapp" href={waLink()} target="_blank" rel="noopener"><Icon name="whatsapp" /> WhatsApp</a>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="footer-link">
      <Icon name="arrow" />
      <span>{children}</span>
    </Link>
  );
}
