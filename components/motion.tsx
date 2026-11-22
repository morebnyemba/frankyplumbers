"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type HTMLMotionProps,
  type Variants,
} from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";

/** Shared easing: a soft "expo-out" that feels premium without being slow. */
export const EASE = [0.22, 1, 0.36, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8, ease: EASE } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: 24 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 140, damping: 18 } },
};

export const stagger = (staggerChildren = 0.09, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
});

type RevealProps = HTMLMotionProps<"div"> & { delay?: number; variants?: Variants; amount?: number };

/** Fades/slides children in once when they enter the viewport. */
export function Reveal({ children, delay = 0, variants = fadeUp, amount = 0.2, ...rest }: RevealProps) {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      transition={{ delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Container that staggers any `motion` children using `fadeUp`-style variants. */
export function Stagger({
  children,
  gap = 0.09,
  delay = 0,
  amount = 0.15,
  as = "div",
  ...rest
}: HTMLMotionProps<"div"> & { gap?: number; delay?: number; amount?: number; as?: "div" | "ul" }) {
  const Comp = as === "ul" ? motion.ul : motion.div;
  return (
    <Comp
      variants={stagger(gap, delay)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      {...(rest as object)}
    >
      {children}
    </Comp>
  );
}

/** Number that counts up with an ease-out when scrolled into view. */
export function CountUp({ value, decimals = 0, duration = 1.8 }: { value: number; decimals?: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView) return;
    const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    if (reduce) { el.textContent = fmt(value); return; }
    const controls = animate(0, value, { duration, ease: EASE, onUpdate: (v) => { el.textContent = fmt(v); } });
    return () => controls.stop();
  }, [inView, value, decimals, duration, reduce]);

  return <span ref={ref}>{(0).toFixed(decimals)}</span>;
}

/** Subtle 3D tilt that follows the pointer (desktop only; disabled for reduced motion). */
export function Tilt({ children, className, max = 7, ...rest }: HTMLMotionProps<"div"> & { max?: number }) {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [max, -max]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(mx, [0, 1], [-max, max]), { stiffness: 200, damping: 20 });
  const glareX = useTransform(mx, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(my, [0, 1], ["0%", "100%"]);
  const glare = useTransform([glareX, glareY], ([x, y]) => `radial-gradient(500px circle at ${x} ${y}, rgba(255,255,255,.18), transparent 45%)`);

  return (
    <motion.div
      className={className}
      style={reduce ? undefined : { rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width);
        my.set((e.clientY - r.top) / r.height);
      }}
      onPointerLeave={() => { mx.set(0.5); my.set(0.5); }}
      {...rest}
    >
      {children as ReactNode}
      {!reduce && <motion.span className="tilt-glare" style={{ background: glare }} aria-hidden="true" />}
    </motion.div>
  );
}

/** Wraps a CTA so it drifts slightly toward the cursor. */
export function Magnetic({ children, strength = 0.25 }: { children: ReactNode; strength?: number }) {
  const reduce = useReducedMotion();
  const x = useSpring(0, { stiffness: 250, damping: 18 });
  const y = useSpring(0, { stiffness: 250, damping: 18 });
  return (
    <motion.span
      className="magnetic"
      style={{ x, y }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => { x.set(0); y.set(0); }}
    >
      {children}
    </motion.span>
  );
}

/** Scroll-linked parallax for background layers. */
export function Parallax({ children, className, offset = 120 }: { children: ReactNode; className?: string; offset?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-offset, offset]);
  return (
    <div ref={ref} className={className} aria-hidden="true">
      <motion.div className="parallax-layer" style={reduce ? undefined : { y }}>
        {children}
      </motion.div>
    </div>
  );
}
