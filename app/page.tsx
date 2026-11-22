import { Hero } from "@/components/Hero";
import { About, Areas, EmergencyBand, Faq, FinalCta, Gallery, Process, Reviews, Services, Stats } from "@/components/sections";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Stats />
      <Services />
      <About />
      <Process />
      <EmergencyBand />
      <Gallery />
      <Reviews />
      <Areas />
      <Faq />
      <FinalCta />
    </>
  );
}
