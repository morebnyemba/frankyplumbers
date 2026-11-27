"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

/**
 * A pipe with a leaking joint. Drops swell and wobble while they hang, release,
 * stretch as they speed up, then land with a ripple and a little crown splash.
 * Pure CSS animation; paused while off-screen.
 *
 * "Fixing" it: hovering the parent `.leak-host` (mouse) or tapping it (touch)
 * shows a wrench tightening the joint and a "Fixed ✓" chip; the drips stop.
 *
 *  - "drip": slow, irregular drips (leak detection)
 *  - "burst": a cracked joint spraying + fast drips (emergency)
 */
type Props = { variant?: "drip" | "burst"; joints?: number[]; className?: string };

// Slightly different periods per drop so the rhythm never looks like a loop.
const DRIP = { dur: [2.6, 3.1, 2.85], gap: 0.95 };
const BURST = { dur: [1.25, 1.45, 1.35], gap: 0.42 };
const SPRAY = [-50, -33, -18, -6, 9, 22, 37, 52];

export function Leak({ variant = "drip", joints = [68], className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [fixed, setFixed] = useState(false);

  // Pause when off-screen.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => el.classList.toggle("is-paused", !e.isIntersecting), { rootMargin: "80px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Hover (mouse) or tap (touch) on the host fixes the leak.
  useEffect(() => {
    const host = ref.current?.closest(".leak-host") as HTMLElement | null;
    if (!host) return;
    let leaveTimer = 0;
    const enter = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      window.clearTimeout(leaveTimer);
      setFixed(true);
    };
    const leave = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      leaveTimer = window.setTimeout(() => setFixed(false), 700);
    };
    const tap = (e: PointerEvent) => {
      if (e.pointerType === "mouse") return;
      if ((e.target as HTMLElement).closest("a, button, input, select, textarea")) return;
      setFixed((f) => !f);
    };
    host.addEventListener("pointerenter", enter);
    host.addEventListener("pointerleave", leave);
    host.addEventListener("pointerup", tap);
    return () => {
      window.clearTimeout(leaveTimer);
      host.removeEventListener("pointerenter", enter);
      host.removeEventListener("pointerleave", leave);
      host.removeEventListener("pointerup", tap);
    };
  }, []);

  const cfg = variant === "burst" ? BURST : DRIP;

  return (
    <div ref={ref} className={`leak leak-${variant}${fixed ? " is-fixed" : ""}${className ? ` ${className}` : ""}`} aria-hidden="true">
      <span className="leak-pipe" />
      {joints.map((x, j) => (
        <span key={x} className="leak-joint" style={{ left: `${x}%` } as CSSProperties}>
          <span className="leak-collar" />
          <span className="leak-wrench">
            <svg viewBox="0 0 24 24"><path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z" fill="currentColor" /></svg>
          </span>
          {j === 0 && <span className="leak-fixed">Fixed ✓</span>}
          {variant === "burst" && j === 0 && (
            <span className="leak-spray">
              {SPRAY.map((dx, i) => (
                <i key={dx} style={{ "--dx": `${dx}px`, "--d": `${((i * 0.37) % 1).toFixed(2)}s`, "--sd": `${(0.8 + (i % 3) * 0.12).toFixed(2)}s`, "--h": `${10 + (i % 4) * 4}px` } as CSSProperties}><b /></i>
              ))}
              <span className="leak-mist" />
            </span>
          )}
          {cfg.dur.map((dur, i) => {
            const t = { "--delay": `${(i * cfg.gap + j * 0.7).toFixed(2)}s`, "--dur": `${dur}s` } as CSSProperties;
            return (
              <span key={i}>
                <span className="leak-drop" style={t} />
                <span className="leak-splash" style={t} />
                <span className="leak-crown" style={t} />
              </span>
            );
          })}
        </span>
      ))}
    </div>
  );
}
