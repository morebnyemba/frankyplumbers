"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { Icon } from "./Icon";
import { EASE, Stagger, fadeUp } from "./motion";
import type { WorkPhoto } from "@/lib/work";

type Props = {
  id: string;
  kicker: string;
  title: string;
  lead: string;
  points: { title: string; text?: string }[];
  image: WorkPhoto;
  reverse?: boolean;
  soft?: boolean;
  badge?: ReactNode;
  action?: ReactNode;
};

export function ServiceDetail({ id, kicker, title, lead, points, image, reverse, soft, badge, action }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  const media = (
    <motion.div
      ref={ref}
      className="about-media"
      initial={{ opacity: 0, x: reverse ? 50 : -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.9, ease: EASE }}
    >
      <div className="main-img-wrap">
        <motion.div className="main-img-inner" style={reduce ? undefined : { y }}>
          <Image src={image.src} alt={image.alt} fill placeholder="blur" blurDataURL={image.blur} sizes="(max-width: 980px) 100vw, 50vw" />
        </motion.div>
      </div>
      {badge}
    </motion.div>
  );

  const copy = (
    <Stagger gap={0.08}>
      <motion.span className="kicker" variants={fadeUp}>{kicker}</motion.span>
      <motion.h2 className="h2" id={`${id}-title`} variants={fadeUp}>{title}</motion.h2>
      <motion.p className="lead" variants={fadeUp}>{lead}</motion.p>
      <motion.ul className="checklist" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}>
        {points.map((p) => (
          <motion.li key={p.title} variants={fadeUp}>
            <span className="tick"><Icon name="check" /></span>
            <div><strong>{p.title}</strong>{p.text && <span>{p.text}</span>}</div>
          </motion.li>
        ))}
      </motion.ul>
      {action && <motion.div variants={fadeUp}>{action}</motion.div>}
    </Stagger>
  );

  return (
    <section className={`section${soft ? " section-soft" : ""}`} id={id} aria-labelledby={`${id}-title`}>
      <div className="container split">
        {reverse ? <>{copy}{media}</> : <>{media}{copy}</>}
      </div>
    </section>
  );
}
