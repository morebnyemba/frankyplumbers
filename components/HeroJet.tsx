"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * High-pressure jet at the bottom of the hero.
 * Pressure = valve state × where the jet sits on screen: full while it's in the
 * lower part of the viewport, easing to 0 as it scrolls up toward the top
 * (or when the valve is tapped). Works the same on tall mobile heroes.
 * The rAF loop only runs while visible and while there's water to draw.
 */
const W = 160;
const H = 230;
const NOZZLE = { x: W / 2, y: H - 64 };
const FLOOR = H - 6;
const G = 0.32;

type Drop = { x: number; y: number; vx: number; vy: number; r: number };

export function HeroJet() {
  const reduce = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(true);
  const [scrolledAway, setScrolledAway] = useState(false);

  const state = useRef({ p: 0, target: 1, open: true, visible: true, drops: [] as Drop[], raf: 0, last: 0 });

  const computeTarget = useCallback(() => {
    const s = state.current;
    const el = wrapRef.current;
    const vh = window.innerHeight;
    const top = el ? el.getBoundingClientRect().top : vh;
    const scrollFactor = Math.max(0, Math.min(1, (top - vh * 0.2) / (vh * 0.45)));
    s.target = s.open ? scrollFactor : 0;
    setScrolledAway(scrollFactor < 0.15);
  }, []);

  const frame = useCallback((now: number) => {
    const s = state.current;
    const c = canvasRef.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    const dt = Math.min(2.5, (now - (s.last || now)) / 16.67 || 1);
    s.last = now;

    // Ease pressure toward target: quick to shut off, softer to build up.
    const k = s.target < s.p ? 0.12 : 0.06;
    s.p += (s.target - s.p) * Math.min(1, k * dt);
    if (s.p < 0.004) s.p = 0;

    // Emit
    if (s.p > 0.02) {
      const n = Math.floor(s.p * 5 * dt + Math.random());
      for (let i = 0; i < n; i++) {
        const v = (8.2 + Math.random() * 2.2) * Math.sqrt(s.p);
        s.drops.push({
          x: NOZZLE.x + (Math.random() - 0.5) * 3,
          y: NOZZLE.y,
          vx: (Math.random() - 0.5) * (1.3 + 1.2 * (1 - s.p)),
          vy: -v,
          r: 1 + Math.random() * 1.6,
        });
      }
    }

    // Integrate
    for (const d of s.drops) {
      d.vy += G * dt;
      d.x += d.vx * dt;
      d.y += d.vy * dt;
    }
    s.drops = s.drops.filter((d) => d.y < FLOOR && d.x > -10 && d.x < W + 10);
    if (s.drops.length > 400) s.drops.splice(0, s.drops.length - 400);

    // Draw
    ctx.clearRect(0, 0, W, H);
    if (s.p > 0.02) {
      const peak = Math.min(NOZZLE.y - 6, ((9.3 * Math.sqrt(s.p)) ** 2) / (2 * G));
      const top = NOZZLE.y - peak;
      // Solid core of the jet (tapered)
      const g = ctx.createLinearGradient(0, NOZZLE.y, 0, top);
      g.addColorStop(0, `rgba(210,235,255,${0.95 * s.p})`);
      g.addColorStop(0.7, `rgba(150,205,255,${0.55 * s.p})`);
      g.addColorStop(1, "rgba(150,205,255,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(NOZZLE.x - 3.2, NOZZLE.y);
      ctx.quadraticCurveTo(NOZZLE.x - 1.6, top + peak * 0.4, NOZZLE.x, top);
      ctx.quadraticCurveTo(NOZZLE.x + 1.6, top + peak * 0.4, NOZZLE.x + 3.2, NOZZLE.y);
      ctx.closePath();
      ctx.fill();
      // Mist at the crown
      const m = ctx.createRadialGradient(NOZZLE.x, top + 6, 0, NOZZLE.x, top + 6, 34);
      m.addColorStop(0, `rgba(170,215,255,${0.22 * s.p})`);
      m.addColorStop(1, "rgba(170,215,255,0)");
      ctx.fillStyle = m;
      ctx.fillRect(NOZZLE.x - 40, top - 30, 80, 80);
    }
    ctx.lineCap = "round";
    for (const d of s.drops) {
      // Rising water reads as short streaks; falling water as round droplets.
      if (d.vy < -1.5) {
        ctx.strokeStyle = "rgba(205,232,255,0.7)";
        ctx.lineWidth = d.r;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - d.vx * 0.5, d.y - d.vy * 0.5);
        ctx.stroke();
      } else {
        ctx.fillStyle = "rgba(215,238,255,0.9)";
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r * 0.9, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const active = s.p > 0 || s.drops.length > 0 || s.target > 0;
    if (s.visible && active && !document.hidden) s.raf = requestAnimationFrame(frame);
    else { s.raf = 0; s.last = 0; }
  }, []);

  const ensureLoop = useCallback(() => {
    const s = state.current;
    if (!s.raf && s.visible && !reduce) s.raf = requestAnimationFrame(frame);
  }, [frame, reduce]);

  // Canvas setup (crisp on HiDPI)
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = W * dpr;
    c.height = H * dpr;
    c.getContext("2d")?.setTransform(dpr, 0, 0, dpr, 0, 0);
  }, []);

  // Scroll, visibility and tab-visibility wiring
  useEffect(() => {
    if (reduce) return;
    const s = state.current;
    const onScroll = () => { computeTarget(); ensureLoop(); };
    const onVis = () => ensureLoop();
    const io = new IntersectionObserver(([e]) => { s.visible = e.isIntersecting; ensureLoop(); });
    if (wrapRef.current) io.observe(wrapRef.current);
    computeTarget();
    ensureLoop();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVis);
      cancelAnimationFrame(s.raf);
      s.raf = 0;
    };
  }, [reduce, computeTarget, ensureLoop]);

  const toggle = () => {
    const s = state.current;
    s.open = !s.open;
    setOpen(s.open);
    computeTarget();
    ensureLoop();
  };

  return (
    <motion.div
      ref={wrapRef}
      className="hero-jet"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.6, duration: 0.8 }}
    >
      <canvas ref={canvasRef} className="jet-canvas" style={{ width: W, height: H }} aria-hidden="true" />
      <div className="jet-pipe" aria-hidden="true">
        <span className="jet-flange" />
      </div>
      <motion.button
        type="button"
        className={`jet-valve${open ? "" : " closed"}`}
        onClick={toggle}
        aria-pressed={!open}
        aria-label={open ? "Shut off the water" : "Turn the water back on"}
        animate={{ rotate: open ? 0 : 270 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: "spring", stiffness: 160, damping: 14 }}
      >
        <svg viewBox="0 0 40 40" aria-hidden="true">
          <circle cx="20" cy="20" r="15" fill="none" stroke="currentColor" strokeWidth="4" />
          <path d="M20 5v30M5 20h30M9.4 9.4l21.2 21.2M30.6 9.4 9.4 30.6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <circle cx="20" cy="20" r="5" fill="currentColor" />
        </svg>
      </motion.button>
      <AnimatePresence mode="wait">
        {!scrolledAway && (
          <motion.span
            key={open ? "open" : "closed"}
            className={`jet-label${open ? "" : " ok"}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            aria-live="polite"
          >
            {open ? "Tap the valve to shut it off" : "Leak stopped ✓"}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
