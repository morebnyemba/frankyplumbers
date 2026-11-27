import type { Metadata } from "next";
import { QuoteForm } from "@/components/QuoteForm";
import { PageHeader } from "@/components/sections";
import { ContactList } from "@/components/ContactList";
import { Reveal } from "@/components/motion";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Call, WhatsApp or request a free plumbing quote from Franky Plumbing Services. 24/7 emergency line across Harare.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHeader title="Get in touch" crumb="Contact">
        Free quotes, fast answers. Call, WhatsApp or send the form below and a real plumber will get back to you, usually within 15 minutes.
      </PageHeader>

      <section className="section" aria-labelledby="contact-title">
        <div className="container contact-grid">
          <ContactList />
          <Reveal className="panel" delay={0.15}>
            <h2 className="panel-title">Request a free quote</h2>
            <p className="panel-sub">Add as much detail as you can. Photos help too, so feel free to send them on WhatsApp.</p>
            <QuoteForm idPrefix="contact" />
          </Reveal>
        </div>
      </section>

      <section className="section map-section" aria-label="Service area map">
        <div className="container">
          <Reveal className="map-card">
            <iframe
              title="Map of Franky Plumbing Services service area in Harare"
              src="https://www.google.com/maps?q=Harare,+Zimbabwe&z=11&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
