"use client";

import { useEffect, useRef, type CSSProperties } from "react";

/**
 * A pipe along the top edge of a media block, leaking drops that swell, fall and
 * splash at the bottom. Pure CSS animation; paused while off-screen.
 *  - "drip": slow drips from one joint (leak detection)
 *  - "burst": a cracked joint spraying + heavy drips (emergency)
 * Parent `.leak-host:hover` "fixes" the leak (drips stop, joint flashes green).
 */
type Props = { variant?: "drip" | "burst"; joints?: number[]; className?: string };

export function Leak({ variant = "drip", joints = [68], className }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => el.classList.toggle("is-paused", !e.isIntersecting), { rootMargin: "80px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`leak leak-${variant}${className ? ` ${className}` : ""}`} aria-hidden="true">
      <span className="leak-pipe" />
      {joints.map((x, j) => (
        <span key={x} className="leak-joint" style={{ left: `${x}%` } as CSSProperties}>
          <span className="leak-collar" />
          {variant === "burst" && j === 0 && (
            <span className="leak-spray">
              {[-48, -30, -14, 12, 28, 46].map((dx, i) => (
                <i key={dx} style={{ "--dx": `${dx}px`, "--d": `${(i * 0.13).toFixed(2)}s` } as CSSProperties}><b /></i>
              ))}
            </span>
          )}
          {[0, 1, 2].map((i) => {
            const delay = { "--delay": `${(i * (variant === "burst" ? 0.45 : 0.9) + j * 0.7).toFixed(2)}s` } as CSSProperties;
            return (
              <span key={i}>
                <span className="leak-drop" style={delay} />
                <span className="leak-splash" style={delay} />
              </span>
            );
          })}
        </span>
      ))}
    </div>
  );
}
