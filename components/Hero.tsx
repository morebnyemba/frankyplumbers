"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";
import { EASE, Magnetic } from "./motion";
import { QuoteForm } from "./QuoteForm";
import { site } from "@/lib/site";

const line1 = ["Plumbing", "done", "right,"];
const line2 = ["the", "first", "time."];

const word = {
  hidden: { y: "110%", rotate: 4 },
  show: { y: "0%", rotate: 0, transition: { duration: 0.9, ease: EASE } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

const trust = [
  { icon: "star" as const, title: "4.9 / 5 rating", sub: "From 200+ Google reviews", stars: true },
  { icon: "bolt" as const, title: "60-min response", sub: "For emergencies in Harare" },
  { icon: "shield" as const, title: "12-month guarantee", sub: "On all workmanship" },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  // Scroll fade/lift only on wide screens: on mobile the quote form sits low in the hero and must stay fully visible.
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 981px)");
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Scroll-linked parallax: photo drifts down + darkens, content lifts and fades.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const shade = useTransform(scrollYProgress, [0, 1], [0, 0.55]);

  // Cursor spotlight.
  const mx = useMotionValue(70);
  const my = useMotionValue(40);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const spotlight = useMotionTemplate`radial-gradient(600px circle at ${sx}% ${sy}%, rgba(74,166,255,.20), transparent 60%)`;

  return (
    <section
      ref={ref}
      className="hero"
      aria-labelledby="hero-title"
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(((e.clientX - r.left) / r.width) * 100);
        my.set(((e.clientY - r.top) / r.height) * 100);
      }}
    >
      <motion.div className="hero-bg" style={reduce ? undefined : { y: bgY }}>
        <motion.div
          className="hero-bg-inner"
          initial={reduce ? false : { scale: 1.18 }}
          animate={{ scale: 1.04 }}
          transition={{ duration: 2.4, ease: EASE }}
        >
          <Image
            src="/img/hero.webp"
            alt="Franky Plumbers technician repairing pipework under a kitchen sink"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center 35%" }}
          />
        </motion.div>
      </motion.div>
      <div className="hero-overlay" aria-hidden="true" />
      <motion.div className="hero-spotlight" style={{ background: spotlight }} aria-hidden="true" />
      <motion.div className="hero-shade" style={{ opacity: shade }} aria-hidden="true" />

      <motion.div className="container hero-grid" style={reduce || !wide ? undefined : { y: contentY, opacity: contentOpacity }}>
        <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.25 } } }}>
          <motion.span className="eyebrow" variants={item}>
            <span className="badge">24/7</span> Harare&apos;s trusted local plumbing team
          </motion.span>

          <h1 id="hero-title" aria-label="Plumbing done right, the first time.">
            <span className="h1-line" aria-hidden="true">
              {line1.map((w) => (
                <span key={w} className="word-mask"><motion.span className="word" variants={word}>{w}</motion.span></span>
              ))}
            </span>{" "}
            <span className="h1-line accent" aria-hidden="true">
              {line2.map((w) => (
                <span key={w} className="word-mask"><motion.span className="word" variants={word}>{w}</motion.span></span>
              ))}
              <motion.span
                className="accent-line"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.15, duration: 0.9, ease: EASE }}
              />
            </span>
          </h1>

          <motion.p className="hero-lead" variants={item}>
            Burst pipe at midnight or a full bathroom refit? Our licensed plumbers arrive on time, quote upfront and leave your
            home spotless. Every job comes with a 12-month workmanship guarantee.
          </motion.p>

          <motion.div className="hero-actions" variants={item}>
            <Magnetic>
              <a className="btn btn-primary btn-lg btn-shine" href={site.phoneHref}>
                <span className="btn-ring" aria-hidden="true"><Icon name="phone" /></span>
                Call Now: {site.phoneShort}
              </a>
            </Magnetic>
            <Magnetic>
              <Link className="btn btn-ghost btn-lg" href="/services">
                Explore Services <Icon name="arrow" className="arrow-slide" />
              </Link>
            </Magnetic>
          </motion.div>

          <motion.div className="hero-trust" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } } }}>
            {trust.map((t) => (
              <motion.div key={t.title} className="t" variants={item}>
                <span className="t-ico"><Icon name={t.icon} /></span>
                <div>
                  <strong>
                    {t.stars && <span className="stars" aria-hidden="true">★★★★★ </span>}
                    {t.title}
                  </strong>
                  <span>{t.sub}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.aside
          className="quote-card"
          aria-labelledby="quote-title"
          initial={reduce ? false : { opacity: 0, x: 60, rotateY: -14, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 70, damping: 16, delay: 0.55 }}
          style={{ transformPerspective: 1200 }}
        >
          <div className="live-chip"><span className="pulse" aria-hidden="true" /> Plumbers on call now</div>
          <h2 id="quote-title">Get a free quote</h2>
          <p className="sub">Tell us what&apos;s wrong and we&apos;ll reply within 15 minutes.</p>
          <QuoteForm compact idPrefix="hero" />
        </motion.aside>
      </motion.div>

      <motion.a
        href="#services"
        className="scroll-cue"
        aria-label="Scroll to services"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
      >
        <span className="mouse"><motion.span className="wheel" animate={reduce ? undefined : { y: [0, 10, 0], opacity: [1, 0, 1] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} /></span>
      </motion.a>

      <div className="hero-waves" aria-hidden="true">
        <svg className="wave wave-back" viewBox="0 0 2880 120" preserveAspectRatio="none">
          <path d="M0 60 C 240 110 480 10 720 60 S 1200 110 1440 60 S 1920 10 2160 60 S 2640 110 2880 60 V120 H0 Z" />
        </svg>
        <svg className="wave wave-front" viewBox="0 0 2880 120" preserveAspectRatio="none">
          <path d="M0 80 C 240 40 480 120 720 80 S 1200 40 1440 80 S 1920 120 2160 80 S 2640 40 2880 80 V120 H0 Z" />
        </svg>
      </div>
    </section>
  );
}
