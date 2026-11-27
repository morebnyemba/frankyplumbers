"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "./Icon";
import { EASE } from "./motion";
import { categories, type GalleryItem, type WorkCategory } from "@/lib/work";

/* ------------------------------------------------------------------ */
/* Tile                                                                */
/* ------------------------------------------------------------------ */
function VideoPreview({ item }: { item: Extract<GalleryItem, { kind: "video" }> }) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  // Only download/play while on screen; nothing is fetched until then (preload="none").
  useEffect(() => {
    const v = ref.current;
    if (!v || reduce) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    }, { threshold: 0.4 });
    io.observe(v);
    return () => io.disconnect();
  }, [reduce]);
  return <video ref={ref} src={item.src} poster={item.poster} muted loop playsInline preload="none" aria-hidden="true" />;
}

export function WorkTile({ item, onOpen, sizes, priority }: { item: GalleryItem; onOpen: () => void; sizes: string; priority?: boolean }) {
  const wide = item.width > item.height;
  return (
    <button type="button" className={`work-tile${wide ? " wide" : ""}`} onClick={onOpen} aria-label={`View: ${item.title}`}>
      <span className="work-media">
        {item.kind === "photo" ? (
          <Image src={item.src} alt={item.alt} fill sizes={sizes} placeholder="blur" blurDataURL={item.blur} priority={priority} style={item.focus ? { objectPosition: item.focus } : undefined} />
        ) : (
          <VideoPreview item={item} />
        )}
      </span>
      {item.kind === "video" && <span className="tile-badge"><Icon name="play" /> Video tour</span>}
      <span className="work-caption">
        <strong>{item.title}</strong>
        <span><Icon name="expand" /> View</span>
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Lightbox                                                            */
/* ------------------------------------------------------------------ */
export function Lightbox({ items, index, onClose, onIndex }: { items: GalleryItem[]; index: number | null; onClose: () => void; onIndex: (i: number) => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<Element | null>(null);
  const [dir, setDir] = useState(0);
  const open = index !== null;
  const item = open ? items[index] : null;

  const go = useCallback((delta: number) => {
    if (index === null) return;
    setDir(delta);
    onIndex((index + delta + items.length) % items.length);
  }, [index, items.length, onIndex]);

  useEffect(() => {
    if (!open) return;
    lastFocus.current = document.activeElement;
    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      (lastFocus.current as HTMLElement | null)?.focus?.();
    };
  }, [open, go, onClose]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={item.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <div className="lb-top">
            <span className="lb-count">{(index ?? 0) + 1} / {items.length}</span>
            <button ref={closeRef} type="button" className="lb-btn" onClick={onClose} aria-label="Close gallery"><Icon name="close" /></button>
          </div>

          <button type="button" className="lb-btn lb-prev" onClick={() => go(-1)} aria-label="Previous"><Icon name="arrow" /></button>

          <div className="lb-stage" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <AnimatePresence initial={false} custom={dir} mode="popLayout">
              <motion.figure
                key={item.slug}
                className="lb-figure"
                custom={dir}
                initial={{ opacity: 0, x: dir * 80, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: dir * -80, scale: 0.96 }}
                transition={{ duration: 0.4, ease: EASE }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.35}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -70) go(1);
                  else if (info.offset.x > 70) go(-1);
                }}
              >
                {item.kind === "photo" ? (
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={item.width}
                    height={item.height}
                    sizes="(max-width: 680px) 100vw, 80vw"
                    placeholder="blur"
                    blurDataURL={item.blur}
                    className="lb-media"
                    loading="eager"
                    draggable={false}
                  />
                ) : (
                  <video className="lb-media" src={item.src} poster={item.poster} controls autoPlay muted playsInline width={item.width} height={item.height} />
                )}
                <figcaption>{item.title}</figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <button type="button" className="lb-btn lb-next" onClick={() => go(1)} aria-label="Next"><Icon name="arrow" /></button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/* Home teaser grid                                                    */
/* ------------------------------------------------------------------ */
const wipe = {
  hidden: { clipPath: "inset(100% 0% 0% 0% round 18px)" },
  show: { clipPath: "inset(0% 0% 0% 0% round 18px)", transition: { duration: 1, ease: EASE } },
};

export function HomeWorkGrid({ items }: { items: GalleryItem[] }) {
  const [index, setIndex] = useState<number | null>(null);
  return (
    <>
      <motion.div
        className="work-grid home"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
      >
        {items.map((it, i) => (
          <motion.div key={it.slug} variants={wipe} className={it.width > it.height ? "cell wide" : "cell"}>
            <WorkTile item={it} onOpen={() => setIndex(i)} sizes="(max-width: 680px) 50vw, (max-width: 980px) 33vw, 25vw" />
          </motion.div>
        ))}
      </motion.div>
      <div className="work-more">
        <Link className="btn btn-blue" href="/gallery">See all our work <Icon name="arrow" className="arrow-slide" /></Link>
      </div>
      <Lightbox items={items} index={index} onClose={() => setIndex(null)} onIndex={setIndex} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Full filterable gallery                                             */
/* ------------------------------------------------------------------ */
export function FilterableGallery({ items }: { items: GalleryItem[] }) {
  const [filter, setFilter] = useState<WorkCategory | "all">("all");
  const [index, setIndex] = useState<number | null>(null);
  const shown = useMemo(() => (filter === "all" ? items : items.filter((i) => i.category === filter)), [filter, items]);
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: items.length };
    items.forEach((i) => { c[i.category] = (c[i.category] ?? 0) + 1; });
    return c;
  }, [items]);

  return (
    <>
      <div className="work-filters" role="toolbar" aria-label="Filter our work">
        {categories.filter((c) => counts[c.id]).map((c) => (
          <button
            key={c.id}
            type="button"
            className={filter === c.id ? "active" : undefined}
            aria-pressed={filter === c.id}
            onClick={() => setFilter(c.id)}
          >
            {filter === c.id && <motion.span layoutId="filter-pill" className="filter-pill" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
            <span className="filter-label">{c.label}<em>{counts[c.id]}</em></span>
          </button>
        ))}
      </div>

      <motion.div layout className="work-grid full">
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((it, i) => (
            <motion.div
              key={it.slug}
              layout
              className={it.width > it.height ? "cell wide" : "cell"}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <WorkTile item={it} onOpen={() => setIndex(i)} sizes="(max-width: 680px) 50vw, (max-width: 980px) 33vw, 25vw" priority={i < 4} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <Lightbox items={shown} index={index} onClose={() => setIndex(null)} onIndex={setIndex} />
    </>
  );
}
