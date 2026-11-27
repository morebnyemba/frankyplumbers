import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { ServiceDetail } from "@/components/ServiceDetail";
import { PageHeader, SectionHead, ServiceCard, EmergencyBand } from "@/components/sections";
import { Stagger } from "@/components/motion";
import { extraServices, services, site } from "@/lib/site";
import { photo } from "@/lib/work";

export const metadata: Metadata = {
  title: "Plumbing Services",
  description: "Emergency plumbing, leak detection, blocked drains, geysers, bathroom installs, tanks and boreholes across Harare.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  const more = [...services.filter((s) => ["drains", "geysers", "water"].includes(s.slug)), ...extraServices];

  return (
    <>
      <PageHeader
        title="Plumbing services"
        crumb="Services"
        actions={
          <>
            <a className="btn btn-primary btn-shine" href={site.phoneHref}><Icon name="phone" /> Call {site.phoneShort}</a>
            <Link className="btn btn-ghost" href="/contact">Request a Quote</Link>
          </>
        }
      >
        Every job, big or small, gets the same treatment: a qualified plumber, an upfront price and a 12-month workmanship guarantee.
      </PageHeader>

      <ServiceDetail
        id="emergency"
        kicker="24/7 Emergency"
        title="Emergency plumbing, day or night"
        lead="Water damage gets worse by the minute. Our emergency crews are on call around the clock, every day of the year, including public holidays."
        points={[{ title: "Burst & leaking pipes" }, { title: "Burst geysers" }, { title: "Sewer back-ups" }, { title: "No water supply" }]}
        image={photo("team-drainage-trench")}
        badge={<div className="about-badge"><strong>60</strong><span>minute emergency response</span></div>}
        action={<a className="btn btn-primary btn-shine" href={site.phoneHref}>Call the emergency line</a>}
      />

      <ServiceDetail
        id="leaks"
        soft
        reverse
        kicker="Leak detection"
        title="Find the leak without breaking up the house"
        lead="Acoustic listening gear, thermal imaging and pressure testing pinpoint hidden leaks in walls, slabs and underground lines. We open up only what we need to."
        points={[
          { title: "Non-invasive detection", text: "Less damage, lower repair bills." },
          { title: "Written leak report", text: "Useful for insurance claims." },
          { title: "Taps, toilets & cisterns", text: "Small drips fixed before they add up on your water bill." },
        ]}
        image={photo("team-basin")}
      />

      <ServiceDetail
        id="installs"
        kicker="Bathrooms & kitchens"
        title="Installs and renovations done properly"
        lead="New builds, refits and upgrades: showers, baths, basins, toilets, kitchen sinks, dishwashers and washing machines, plumbed in neatly and to code."
        points={[{ title: "Full bathroom refits" }, { title: "Walk-in showers" }, { title: "Kitchen sinks & appliances" }, { title: "New-build plumbing" }]}
        image={photo("bath-rain-shower")}
        badge={
          <div className="about-card">
            <span className="ok"><Icon name="check" /></span>
            <div><strong>Finished on schedule</strong><span>Fixed timeline, agreed upfront</span></div>
          </div>
        }
      />

      <section className="section section-soft" aria-labelledby="more-title">
        <div className="container">
          <SectionHead kicker="More services" title="Everything else your water system needs" id="more-title" />
          <Stagger className="services-grid" gap={0.08}>
            {more.map((s) => (
              <div key={s.slug} id={s.slug} className="anchor-target">
                <ServiceCard s={s} href="/contact" />
              </div>
            ))}
          </Stagger>
        </div>
      </section>

      <EmergencyBand />
    </>
  );
}
