"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { Icon } from "./Icon";
import { serviceOptions, site, waLink } from "@/lib/site";

/**
 * Lead form. No backend: it composes a WhatsApp message and opens wa.me.
 * To capture leads server-side, POST to an /api route here and keep WhatsApp as the fallback.
 */
export function QuoteForm({ compact = false, idPrefix = "q" }: { compact?: boolean; idPrefix?: string }) {
  const [sent, setSent] = useState(false);
  const id = (k: string) => `${idPrefix}-${k}`;

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    const d = new FormData(form);
    if (d.get("company")) return; // honeypot

    const lines = [
      `Hi ${site.name}, I'd like a quote.`,
      `Name: ${d.get("name") ?? ""}`,
      `Phone: ${d.get("phone") ?? ""}`,
      d.get("service") ? `Service: ${d.get("service")}` : "",
      d.get("area") ? `Area: ${d.get("area")}` : "",
      d.get("message") ? `Details: ${d.get("message")}` : "",
    ].filter(Boolean);

    window.open(waLink(lines.join("\n")), "_blank", "noopener");
    form.reset();
    setSent(true);
    window.setTimeout(() => setSent(false), 6000);
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="form-grid">
        <div className="field">
          <label htmlFor={id("name")}>Name</label>
          <input id={id("name")} name="name" autoComplete="name" required placeholder="Your name" />
        </div>
        <div className="field">
          <label htmlFor={id("phone")}>Phone</label>
          <input id={id("phone")} name="phone" type="tel" autoComplete="tel" required placeholder="077 123 4567" />
        </div>
        <div className={compact ? "field full" : "field"}>
          <label htmlFor={id("service")}>Service needed</label>
          <select id={id("service")} name="service" required defaultValue="">
            <option value="" disabled>Choose a service…</option>
            {serviceOptions.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className={compact ? "field full" : "field"}>
          <label htmlFor={id("area")}>Suburb</label>
          <input id={id("area")} name="area" placeholder="e.g. Borrowdale" />
        </div>
        {!compact && (
          <div className="field full">
            <label htmlFor={id("message")}>Describe the problem</label>
            <textarea id={id("message")} name="message" rows={5} placeholder="e.g. Geyser leaking from the overflow pipe since this morning" />
          </div>
        )}
        <div className="field full" hidden>
          <label htmlFor={id("company")}>Company</label>
          <input id={id("company")} name="company" tabIndex={-1} autoComplete="off" />
        </div>
      </div>

      <motion.button className="btn btn-primary btn-block btn-shine" type="submit" style={{ marginTop: 16 }} whileTap={{ scale: 0.97 }}>
        {compact ? "Request My Free Quote" : "Send My Request"} <Icon name="arrow" className="arrow-slide" />
      </motion.button>

      <p className="form-note"><Icon name="check" /> No call-out fee when you go ahead with the job.</p>
      <div className="form-status" role="status" aria-live="polite">
        <AnimatePresence>
          {sent && (
            <motion.span initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              Opening WhatsApp… we usually reply within 15 minutes.
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}
