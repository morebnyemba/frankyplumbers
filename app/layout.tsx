import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingActions, ScrollProgress } from "@/components/chrome";
import { MotionProvider } from "@/components/MotionProvider";
import { site } from "@/lib/site";
import "./globals.css";

const font = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | 24/7 Licensed Plumbers in ${site.city}`,
    template: `%s | ${site.name} ${site.city}`,
  },
  description:
    "Licensed, insured plumbers for leaks, blocked drains, geysers, bathroom installs and 24/7 emergencies across Harare. Upfront pricing and a 12-month workmanship guarantee.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} | 24/7 Licensed Plumbers in ${site.city}`,
    description: "Fast, tidy, guaranteed plumbing. Call or WhatsApp for a free quote.",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Freestanding bath installed by Franky Plumbing Services" }],
    locale: "en_ZW",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#0a1c36",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Plumber",
  name: site.name,
  url: site.url,
  telephone: site.phoneHref.replace("tel:", ""),
  email: site.email,
  image: `${site.url}/og.jpg`,
  priceRange: "$$",
  address: { "@type": "PostalAddress", addressLocality: site.city, addressCountry: "ZW" },
  areaServed: site.city,
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={font.variable}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <a className="skip-link" href="#main">Skip to content</a>
        <MotionProvider>
          <ScrollProgress />
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <FloatingActions />
        </MotionProvider>
      </body>
    </html>
  );
}
