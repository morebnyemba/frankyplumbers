import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { PageHeader } from "@/components/sections";
import { FilterableGallery } from "@/components/WorkGallery";
import { Reveal } from "@/components/motion";
import { allWork, photo } from "@/lib/work";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our Work",
  description: "Photos of real Franky Plumbing jobs across Harare: showers, bathrooms, drainage, solar geysers and boreholes.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  return (
    <>
      <PageHeader
        title="Our work"
        crumb="Our Work"
        image={photo("freestanding-bath")}
        actions={
          <>
            <a className="btn btn-primary btn-shine" href={site.phoneHref}><Icon name="phone" /> Call {site.phoneShort}</a>
            <Link className="btn btn-ghost" href="/contact">Get a Free Quote</Link>
          </>
        }
      >
        Real jobs by our own team, from glass shower enclosures and full bathroom fit-outs to foundation drainage and solar geysers.
      </PageHeader>

      <section className="section" aria-label="Project gallery">
        <div className="container">
          <FilterableGallery items={allWork} />
          <Reveal className="work-note">
            <p>Like what you see? Send us a photo of your bathroom or problem on WhatsApp and we&apos;ll quote from it.</p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
