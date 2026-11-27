"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * High-pressure jet at the bottom of the hero.
 *
 * Pressure = valve state × where the jet sits on screen: full while it's in the
 * lower part of the viewport, easing to 0 as it scrolls up toward the top
 * (or when the valve is tapped). Works the same on tall mobile heroes.
 *
 * Realism: turbulent core, droplets that splash + ripple when they land,
 * a sputter when the valve closes and air-spurts when it reopens, and a
 * cursor "wind" that pushes the spray (mouse only).
 *
 * Cost: the rAF loop only runs while visible and while there's water, splash
 * or ripple left to draw; 0 frames when idle. Off for prefers-reduced-motion.
 */
const W = 160;
const H = 230;
const NOZZLE = { x: W / 2, y: H - 64 };
const FLOOR = H - 6;
const G = 0.32;
const SPUTTER_MS = { close: 650, open: 900 };

type Drop = { x: number; y: number; vx: number; vy: number; r: number; splash?: boolean; glint?: boolean };
type Ripple = { x: number; r: number; life: number };

export function HeroJet() {
  const reduce = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(true);
  const [scrolledAway, setScrolledAway] = useState(false);

  const state = useRef({
    p: 0, target: 1, open: true, visible: true,
    drops: [] as Drop[], ripples: [] as Ripple[],
    raf: 0, last: 0, t: 0,
    sputter: 0, sputterMode: "close" as "close" | "open",
    mouse: { x: -999, y: -999, on: false },
    maxP: 1,
  });

  /**
   * Headroom: find hero content that sits horizontally over the jet and cap the
   * pressure so the spray's peak stays below it (fits every screen size).
   * Peak height in canvas px ~= 135 * p; scaled by the canvas' on-screen size.
   */
  const measureHeadroom = useCallback(() => {
    const c = canvasRef.current;
    const hero = wrapRef.current?.closest(".hero");
    if (!c || !hero) return;
    const cr = c.getBoundingClientRect();
    const scale = cr.height / H || 1;
    const nozzleY = cr.top + NOZZLE.y * scale;
    const x0 = cr.left + cr.width / 2 - 34 * scale;
    const x1 = cr.left + cr.width / 2 + 34 * scale;
    let ceiling = cr.top - 400;
    hero.querySelectorAll(".hero-grid h1, .hero-lead, .hero-actions > *, .hero-trust .t, .eyebrow, .hero-quote").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (!r.height || r.right < x0 || r.left > x1) return;
      if (r.bottom < nozzleY) ceiling = Math.max(ceiling, r.bottom);
    });
    const free = nozzleY - ceiling - 14;
    state.current.maxP = Math.max(0.22, Math.min(1, free / (135 * scale)));
  }, []);

  const computeTarget = useCallback(() => {
    const s = state.current;
    const el = wrapRef.current;
    const vh = window.innerHeight;
    const top = el ? el.getBoundingClientRect().top : vh;
    const scrollFactor = Math.max(0, Math.min(1, (top - vh * 0.2) / (vh * 0.45)));
    s.target = s.open ? Math.min(scrollFactor, s.maxP) : 0;
    setScrolledAway(scrollFactor < 0.15);
  }, []);

  const frame = useCallback((now: number) => {
    const s = state.current;
    const c = canvasRef.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    const ms = Math.min(50, now - (s.last || now)) || 16.67;
    const dt = ms / 16.67;
    s.last = now;
    s.t += ms;

    // Pressure easing: quick to shut off, softer to build up.
    const k = s.target < s.p ? 0.12 : 0.06;
    s.p += (s.target - s.p) * Math.min(1, k * dt);
    if (s.p < 0.004) s.p = 0;

    // Sputter: wobble on close, random air-spurts on reopen.
    let pe = s.p;
    if (s.sputter > 0) {
      s.sputter -= ms;
      const amt = Math.max(0, s.sputter) / SPUTTER_MS[s.sputterMode];
      if (s.sputterMode === "close") pe *= 1 - 0.5 * amt * (0.5 + 0.5 * Math.sin(s.t * 0.06));
      else pe *= Math.random() < 0.45 * amt ? 0.15 : 1;
    }

    // Turbulence: two slow sines give an organic sway of the jet tip.
    const sway = Math.sin(s.t * 0.0042) * 1.3 + Math.sin(s.t * 0.0113 + 1.7) * 0.7;

    // Emit
    if (pe > 0.02) {
      const n = Math.floor(pe * 5.5 * dt + Math.random());
      for (let i = 0; i < n; i++) {
        const v = (8.2 + Math.random() * 2.2) * Math.sqrt(pe);
        const glint = Math.random() < 0.06;
        s.drops.push({
          x: NOZZLE.x + (Math.random() - 0.5) * 3,
          y: NOZZLE.y,
          vx: (Math.random() - 0.5) * (1.3 + 1.2 * (1 - pe)) + sway * 0.06,
          vy: -v,
          r: glint ? 2.2 : 1 + Math.random() * 1.5,
          glint,
        });
      }
    }

    // Integrate (+ cursor wind)
    const m = s.mouse;
    for (const d of s.drops) {
      if (m.on) {
        const dx = d.x - m.x, dy = d.y - m.y;
        const dist2 = dx * dx + dy * dy;
        if (dist2 < 3600 && dist2 > 1) {
          const dist = Math.sqrt(dist2);
          const f = (1 - dist / 60) * 0.7 * dt;
          d.vx += (dx / dist) * f;
          d.vy += (dy / dist) * f * 0.5;
        }
      }
      d.vy += G * dt;
      d.x += d.vx * dt;
      d.y += d.vy * dt;
    }

    // Landing: splash droplets + ripple rings on the water line
    const next: Drop[] = [];
    for (const d of s.drops) {
      if (d.y >= FLOOR) {
        if (!d.splash && d.vy > 2) {
          if (Math.random() < 0.35 && s.ripples.length < 24) s.ripples.push({ x: d.x, r: 1.5, life: 1 });
          if (Math.random() < 0.5) {
            const k2 = 1 + Math.floor(Math.random() * 2);
            for (let i = 0; i < k2; i++) {
              next.push({ x: d.x, y: FLOOR - 1, vx: (Math.random() - 0.5) * 2.2, vy: -(0.9 + Math.random() * 1.6), r: 0.8 + Math.random() * 0.6, splash: true });
            }
          }
        }
        continue;
      }
      if (d.x > -10 && d.x < W + 10) next.push(d);
    }
    s.drops = next.length > 450 ? next.slice(next.length - 450) : next;
    for (const r of s.ripples) { r.r += 0.55 * dt; r.life -= 0.035 * dt; }
    s.ripples = s.ripples.filter((r) => r.life > 0);

    // Draw
    ctx.clearRect(0, 0, W, H);
    if (pe > 0.02) {
      const peak = Math.min(NOZZLE.y - 6, ((9.3 * Math.sqrt(pe)) ** 2) / (2 * G));
      const top = NOZZLE.y - peak;
      const tipX = NOZZLE.x + sway * (peak / 60);
      const g = ctx.createLinearGradient(0, NOZZLE.y, 0, top);
      g.addColorStop(0, `rgba(215,238,255,${0.95 * pe})`);
      g.addColorStop(0.65, `rgba(150,205,255,${0.55 * pe})`);
      g.addColorStop(1, "rgba(150,205,255,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(NOZZLE.x - 3.2, NOZZLE.y);
      ctx.quadraticCurveTo(NOZZLE.x - 1.8 + sway * 0.3, top + peak * 0.45, tipX, top);
      ctx.quadraticCurveTo(NOZZLE.x + 1.8 + sway * 0.3, top + peak * 0.45, NOZZLE.x + 3.2, NOZZLE.y);
      ctx.closePath();
      ctx.fill();
      // Bright inner thread
      ctx.strokeStyle = `rgba(255,255,255,${0.35 * pe})`;
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      ctx.moveTo(NOZZLE.x - 0.6, NOZZLE.y);
      ctx.quadraticCurveTo(NOZZLE.x + sway * 0.25, top + peak * 0.5, tipX, top + peak * 0.25);
      ctx.stroke();
      // Mist at the crown
      const mg = ctx.createRadialGradient(tipX, top + 6, 0, tipX, top + 6, 36);
      mg.addColorStop(0, `rgba(170,215,255,${0.24 * pe})`);
      mg.addColorStop(1, "rgba(170,215,255,0)");
      ctx.fillStyle = mg;
      ctx.fillRect(tipX - 42, top - 30, 84, 84);
    }
    ctx.lineCap = "round";
    for (const d of s.drops) {
      if (d.vy < -1.5 && !d.splash) {
        ctx.strokeStyle = "rgba(205,232,255,0.7)";
        ctx.lineWidth = d.r;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - d.vx * 0.5, d.y - d.vy * 0.5);
        ctx.stroke();
      } else {
        if (d.glint) {
          ctx.fillStyle = "rgba(220,240,255,0.25)";
          ctx.beginPath(); ctx.arc(d.x, d.y, d.r * 2.2, 0, Math.PI * 2); ctx.fill();
        }
        ctx.fillStyle = d.glint ? "rgba(255,255,255,0.98)" : "rgba(215,238,255,0.9)";
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r * 0.9, 0, Math.PI * 2); ctx.fill();
      }
    }
    for (const r of s.ripples) {
      ctx.strokeStyle = `rgba(200,230,255,${0.55 * r.life})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(r.x, FLOOR, r.r, r.r * 0.28, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    const active = s.p > 0 || s.drops.length > 0 || s.ripples.length > 0 || s.target > 0 || s.sputter > 0;
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

  // Scroll, visibility, tab-visibility and cursor wiring
  useEffect(() => {
    if (reduce) return;
    const s = state.current;
    const onScroll = () => { computeTarget(); ensureLoop(); };
    const onResize = () => { measureHeadroom(); computeTarget(); ensureLoop(); };
    measureHeadroom();
    // Re-measure once the entrance animations have settled.
    const settle = window.setTimeout(onResize, 2600);
    const onVis = () => ensureLoop();
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || !canvasRef.current) return;
      const r = canvasRef.current.getBoundingClientRect();
      s.mouse.x = e.clientX - r.left;
      s.mouse.y = e.clientY - r.top;
      s.mouse.on = s.mouse.x > -60 && s.mouse.x < W + 60 && s.mouse.y > -60 && s.mouse.y < H + 20;
    };
    const io = new IntersectionObserver(([e]) => { s.visible = e.isIntersecting; ensureLoop(); });
    if (wrapRef.current) io.observe(wrapRef.current);
    computeTarget();
    ensureLoop();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      window.clearTimeout(settle);
      document.removeEventListener("visibilitychange", onVis);
      cancelAnimationFrame(s.raf);
      s.raf = 0;
    };
  }, [reduce, computeTarget, ensureLoop, measureHeadroom]);

  const toggle = () => {
    const s = state.current;
    s.open = !s.open;
    s.sputter = SPUTTER_MS[s.open ? "open" : "close"];
    s.sputterMode = s.open ? "open" : "close";
    setOpen(s.open);
    if ("vibrate" in navigator) navigator.vibrate?.(s.open ? [8, 40, 8] : 14);
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
        whileTap={{ scale: 0.9 }}
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
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
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
