"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef, useState, type ReactNode } from "react";
import { Icon } from "./Icon";
import { CountUp, EASE, Magnetic, Parallax, Reveal, Stagger, Tilt, fadeUp, scaleIn } from "./motion";
import { areas, faqs, reviews, services, site, stats, steps, waLink, why, type Service } from "@/lib/site";
import { homeWork, photo, type WorkPhoto } from "@/lib/work";
import { HomeWorkGrid } from "./WorkGallery";

/* ------------------------------------------------------------------ */
/* Section heading                                                     */
/* ------------------------------------------------------------------ */
export function SectionHead({ kicker, title, children, id, align = "center" }: { kicker: string; title: string; children?: ReactNode; id?: string; align?: "center" | "left" }) {
  return (
    <Stagger className={`section-head${align === "left" ? " left" : ""}`} gap={0.1}>
      <motion.span className="kicker" variants={fadeUp}>{kicker}</motion.span>
      <motion.h2 id={id} variants={fadeUp}>{title}</motion.h2>
      {children && <motion.p variants={fadeUp}>{children}</motion.p>}
    </Stagger>
  );
}

/* ------------------------------------------------------------------ */
/* Stats strip                                                         */
/* ------------------------------------------------------------------ */
export function Stats() {
  return (
    <section className="stats" aria-label={`${site.name} in numbers`}>
      <Stagger className="container stats-grid" gap={0.1} amount={0.4}>
        {stats.map((s) => (
          <motion.div key={s.label} className="stat" variants={fadeUp}>
            <div className="num">
              <CountUp value={s.value} decimals={"decimals" in s ? s.decimals : 0} />
              <em>{s.suffix}</em>
            </div>
            <div className="lbl">{s.label}</div>
          </motion.div>
        ))}
      </Stagger>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Services                                                            */
/* ------------------------------------------------------------------ */
export function ServiceCard({ s, href }: { s: Service; href?: string }) {
  const link = s.emergency ? site.phoneHref : href ?? `/services#${s.slug}`;
  return (
    <motion.article variants={scaleIn} className="service-wrap">
      <Tilt className={`service${s.image ? "" : " no-img"}${s.emergency ? " emergency" : ""}`} max={5}>
        {s.image && (
          <div className="service-img">
            <Image src={s.image.src} alt={s.image.alt} fill placeholder="blur" blurDataURL={s.image.blur} sizes="(max-width: 680px) 100vw, (max-width: 980px) 50vw, 33vw" style={s.image.focus ? { objectPosition: s.image.focus } : undefined} />
          </div>
        )}
        <div className="service-body">
          <span className="service-icon"><Icon name={s.icon} /></span>
          <h3>{s.title}</h3>
          <p>{s.short}</p>
          <a className="link-arrow" href={link}>
            {s.emergency ? "Call the emergency line" : "Learn more"} <Icon name="arrow" />
          </a>
        </div>
      </Tilt>
    </motion.article>
  );
}

export function Services() {
  return (
    <section className="section" id="services" aria-labelledby="services-title">
      <div className="container">
        <SectionHead kicker="What we do" title="Complete plumbing services for homes & businesses" id="services-title">
          From a dripping tap to a full commercial install, one call covers it. Clear quotes, qualified plumbers, no surprises.
        </SectionHead>
        <Stagger className="services-grid" gap={0.08}>
          {services.map((s) => <ServiceCard key={s.slug} s={s} />)}
        </Stagger>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* About / Why us                                                      */
/* ------------------------------------------------------------------ */
const aboutPhoto = photo("team-shower-install");

export function About() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const badgeY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const cardY = useTransform(scrollYProgress, [0, 1], [-30, 40]);

  return (
    <section className="section section-soft" id="about" aria-labelledby="about-title">
      <div className="container split">
        <Reveal className="about-media" ref={ref} variants={{ hidden: { opacity: 0, x: -40 }, show: { opacity: 1, x: 0, transition: { duration: 0.9, ease: EASE } } }}>
          <div className="main-img-wrap">
            <motion.div className="main-img-inner" style={reduce ? undefined : { y: imgY }}>
              <Image src={aboutPhoto.src} alt={aboutPhoto.alt} fill placeholder="blur" blurDataURL={aboutPhoto.blur} sizes="(max-width: 980px) 100vw, 50vw" style={{ objectPosition: aboutPhoto.focus }} />
            </motion.div>
          </div>
          <motion.div className="about-card" style={reduce ? undefined : { y: cardY }}>
            <span className="ok"><Icon name="check" /></span>
            <div><strong>Fully licensed &amp; insured</strong><span>Your home is protected</span></div>
          </motion.div>
          <motion.div className="about-badge" style={reduce ? undefined : { y: badgeY }}>
            <strong><CountUp value={15} />+</strong>
            <span>Years keeping Harare&apos;s water flowing</span>
          </motion.div>
        </Reveal>

        <Stagger gap={0.08}>
          <motion.span className="kicker" variants={fadeUp}>Why Franky Plumbers</motion.span>
          <motion.h2 className="h2" id="about-title" variants={fadeUp}>Honest plumbers who treat your home like their own</motion.h2>
          <motion.p className="lead" variants={fadeUp}>
            Franky started with one van and one rule: do the job properly, charge a fair price, and clean up afterwards.
            Fifteen years on, that rule hasn&apos;t changed. It&apos;s why most of our work comes from referrals.
          </motion.p>
          <motion.ul className="checklist" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}>
            {why.map((w) => (
              <motion.li key={w.title} variants={fadeUp}>
                <motion.span className="tick" variants={{ hidden: { scale: 0 }, show: { scale: 1, transition: { type: "spring", stiffness: 400, damping: 15 } } }}>
                  <Icon name="check" />
                </motion.span>
                <div><strong>{w.title}</strong><span>{w.text}</span></div>
              </motion.li>
            ))}
          </motion.ul>
          <motion.div className="hero-actions flat" variants={fadeUp}>
            <Magnetic><Link className="btn btn-blue" href="/contact">Book a Plumber</Link></Magnetic>
            <Link className="btn btn-outline" href="/services">See all services <Icon name="arrow" className="arrow-slide" /></Link>
          </motion.div>
        </Stagger>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Process: connector line fills as you scroll                         */
/* ------------------------------------------------------------------ */
export function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section className="section" aria-labelledby="process-title">
      <div className="container">
        <SectionHead kicker="How it works" title="Fixed in four simple steps" id="process-title">
          No runaround, no hidden extras. Here&apos;s what happens when you call us.
        </SectionHead>
        <div className="steps" ref={ref}>
          <div className="steps-track" aria-hidden="true"><motion.div className="steps-fill" style={{ scaleX: progress }} /></div>
          {steps.map((s, i) => (
            <Reveal key={s.title} className="step" delay={i * 0.12} variants={scaleIn}>
              <div className="step-num" data-step={i + 1}><Icon name={s.icon} /></div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Emergency CTA photo band                                            */
/* ------------------------------------------------------------------ */
export function EmergencyBand() {
  return (
    <section className="photo-band cta-band" aria-labelledby="emergency-title">
      <Parallax className="bg" offset={80}>
        <Image src="/img/header-pipes.webp" alt="" fill sizes="100vw" />
      </Parallax>
      <div className="container cta-inner">
        <Stagger gap={0.1}>
          <motion.span className="kicker kicker-warm" variants={fadeUp}>Plumbing emergency?</motion.span>
          <motion.h2 id="emergency-title" variants={fadeUp}>Burst pipe or flooding? We&apos;re on our way.</motion.h2>
          <motion.p variants={fadeUp}>
            Shut off your main water valve, then call us. A Franky Plumbers technician can be at your door within 60 minutes,
            24 hours a day, 365 days a year.
          </motion.p>
        </Stagger>
        <Reveal variants={scaleIn} delay={0.2}>
          <a className="big-phone" href={site.phoneHref}>
            <span className="ring"><span className="ring-wave" /><span className="ring-wave delay" /><Icon name="phone" /></span>
            <span><small>24/7 emergency line</small><strong>{site.phoneShort}</strong></span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Recent work: Franky's real job photos (lightbox on click)          */
/* ------------------------------------------------------------------ */
export function Gallery() {
  return (
    <section className="section" id="work" aria-labelledby="work-title">
      <div className="container">
        <SectionHead kicker="Recent work" title="Real jobs, done by our own team" id="work-title">
          Every photo here is a Franky Plumbing job in and around Harare. Tap any picture to take a closer look.
        </SectionHead>
        <HomeWorkGrid items={homeWork} />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Reviews (SAMPLE CONTENT: see lib/site.ts)                           */
/* ------------------------------------------------------------------ */
export function Reviews() {
  return (
    <section className="section section-soft" id="reviews" aria-labelledby="reviews-title">
      <div className="container">
        <div className="reviews-top">
          <SectionHead kicker="Reviews" title="What our customers say" id="reviews-title" align="left" />
          <Reveal className="rating-pill" variants={scaleIn}>
            <span className="score"><CountUp value={4.9} decimals={1} /></span>
            <div><span className="stars" aria-label="5 out of 5 stars">★★★★★</span><small>Based on 200+ Google reviews</small></div>
          </Reveal>
        </div>
        <Stagger className="reviews" gap={0.12}>
          {reviews.map((r) => (
            <motion.figure key={r.name} className="review" variants={fadeUp} whileHover={{ y: -8 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
              <Icon name="quote" className="quote-mark" />
              <span className="stars" aria-label="5 stars">★★★★★</span>
              <blockquote>{r.text}</blockquote>
              <figcaption className="who">
                <span className="avatar" aria-hidden="true">{r.initials}</span>
                <div><strong>{r.name}</strong><span>{r.meta}</span></div>
              </figcaption>
            </motion.figure>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Areas                                                               */
/* ------------------------------------------------------------------ */
export function Areas() {
  return (
    <section className="section" aria-labelledby="areas-title">
      <div className="container split">
        <div>
          <SectionHead kicker="Service areas" title="Proudly serving Harare & surrounds" id="areas-title" align="left">
            Our vans are spread across the city, so there&apos;s always a plumber close by. Not sure if we cover you? Just ask.
          </SectionHead>
          <Stagger as="ul" className="areas" gap={0.04}>
            {areas.map((a) => (
              <motion.li key={a} variants={{ hidden: { opacity: 0, scale: 0.6 }, show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 18 } } }} whileHover={{ y: -3 }}>
                <Icon name="pin" />{a}
              </motion.li>
            ))}
          </Stagger>
        </div>
        <Reveal className="map-card" variants={scaleIn} delay={0.15}>
          <iframe
            title="Map of Franky Plumbers' Harare service area"
            src="https://www.google.com/maps?q=Harare,+Zimbabwe&z=11&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* FAQ: animated accordion                                            */
/* ------------------------------------------------------------------ */
export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="section section-soft" aria-labelledby="faq-title">
      <div className="container">
        <SectionHead kicker="FAQ" title="Common questions" id="faq-title" />
        <Stagger className="faq" gap={0.07}>
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <motion.div key={f.q} className={`faq-item${isOpen ? " open" : ""}`} variants={fadeUp} layout="position">
                <h3>
                  <button type="button" aria-expanded={isOpen} aria-controls={`faq-${i}`} id={`faq-btn-${i}`} onClick={() => setOpen(isOpen ? null : i)}>
                    {f.q}
                    <motion.span className="plus" animate={{ rotate: isOpen ? 135 : 0 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                      <Icon name="plus" />
                    </motion.span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-${i}`}
                      role="region"
                      aria-labelledby={`faq-btn-${i}`}
                      className="answer-wrap"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: EASE }}
                    >
                      <p className="answer">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Final CTA                                                           */
/* ------------------------------------------------------------------ */
export function FinalCta() {
  return (
    <section className="section" aria-labelledby="final-title">
      <div className="container">
        <Reveal className="final-cta" variants={scaleIn}>
          <span className="bubbles" aria-hidden="true">{Array.from({ length: 8 }, (_, i) => <i key={i} />)}</span>
          <div>
            <h2 id="final-title">Ready to get it fixed?</h2>
            <p>Free quotes, upfront pricing and a 12-month guarantee on every job.</p>
          </div>
          <div className="hero-actions flat">
            <Magnetic><Link className="btn btn-primary btn-shine" href="/contact">Get a Free Quote</Link></Magnetic>
            <Magnetic><a className="btn btn-whatsapp" href={waLink()} target="_blank" rel="noopener"><Icon name="whatsapp" /> WhatsApp Us</a></Magnetic>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Inner-page photo header                                             */
/* ------------------------------------------------------------------ */
export function PageHeader({ title, crumb, children, actions, image }: { title: string; crumb: string; children: ReactNode; actions?: ReactNode; image?: WorkPhoto }) {
  const words = title.split(" ");
  return (
    <section className="photo-band page-header" aria-labelledby="page-title">
      <Parallax className="bg" offset={60}>
        <motion.div className="bg-zoom" initial={{ scale: 1.15 }} animate={{ scale: 1 }} transition={{ duration: 2, ease: EASE }}>
          {image ? (
            <Image src={image.src} alt="" fill priority sizes="100vw" placeholder="blur" blurDataURL={image.blur} />
          ) : (
            <Image src="/img/header-pipes.webp" alt="" fill priority sizes="100vw" />
          )}
        </motion.div>
      </Parallax>
      <motion.div className="container" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } } }}>
        <motion.nav className="crumbs" aria-label="Breadcrumb" variants={fadeUp}>
          <Link href="/">Home</Link><span aria-hidden="true">/</span><span>{crumb}</span>
        </motion.nav>
        <h1 id="page-title" aria-label={title}>
          {words.map((w, i) => (
            <span key={i} className="word-mask" aria-hidden="true">
              <motion.span className="word" variants={{ hidden: { y: "110%" }, show: { y: "0%", transition: { duration: 0.9, ease: EASE } } }}>{w}</motion.span>
            </span>
          ))}
        </h1>
        <motion.p variants={fadeUp}>{children}</motion.p>
        {actions && <motion.div className="hero-actions flat" style={{ marginTop: 28 }} variants={fadeUp}>{actions}</motion.div>}
      </motion.div>
    </section>
  );
}
