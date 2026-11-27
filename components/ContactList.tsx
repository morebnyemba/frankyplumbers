"use client";

import { motion } from "framer-motion";
import { Icon } from "./Icon";
import { Stagger, fadeUp } from "./motion";
import { site, waLink } from "@/lib/site";

const items = [
  { href: site.phoneHref, icon: "phone" as const, tone: "or", label: "Call 24/7", value: site.phoneDisplay },
  { href: site.phone2Href, icon: "phone" as const, tone: "", label: "Second line", value: site.phone2Display },
  { href: waLink(), icon: "whatsapp" as const, tone: "wa", label: "WhatsApp", value: site.phoneDisplay, external: true },
  { href: `mailto:${site.email}`, icon: "mail" as const, tone: "", label: "Email", value: site.email },
  { icon: "clock" as const, tone: "", label: "Office hours", value: site.officeHours },
];

export function ContactList() {
  return (
    <Stagger gap={0.08}>
      <motion.span className="kicker" variants={fadeUp}>Contact details</motion.span>
      <motion.h2 className="h2" id="contact-title" variants={fadeUp}>We&apos;re here 24/7</motion.h2>
      <motion.p className="lead" variants={fadeUp}>For emergencies, please call. It&apos;s the fastest way to get a plumber moving.</motion.p>
      <ul className="contact-list">
        {items.map((it) => {
          const inner = (
            <>
              <span className={`ci ${it.tone}`}><Icon name={it.icon} /></span>
              <span><small>{it.label}</small><strong>{it.value}</strong></span>
            </>
          );
          return (
            <motion.li key={it.label} variants={fadeUp} whileHover={it.href ? { x: 6 } : undefined}>
              {it.href ? (
                <a href={it.href} {...(it.external ? { target: "_blank", rel: "noopener" } : {})}>{inner}</a>
              ) : (
                <div>{inner}</div>
              )}
            </motion.li>
          );
        })}
      </ul>
    </Stagger>
  );
}
