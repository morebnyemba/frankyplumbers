/**
 * Single source of truth for business details and page content.
 * Every placeholder the client must confirm before launch lives here.
 */

import { photo, type WorkPhoto } from "./work";

export const site = {
  name: "Franky Plumbing Services",
  shortName: "Franky Plumbing",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://frankyplumbers.co.zw",
  city: "Harare",
  country: "Zimbabwe",
  // Main line: calls + WhatsApp (as printed on the team uniforms)
  phoneDisplay: "+263 78 715 3222",
  phoneShort: "078 715 3222",
  phoneHref: "tel:+263787153222",
  whatsapp: "263787153222", // international format, digits only
  // Second line
  phone2Display: "+263 71 190 2582",
  phone2Short: "071 190 2582",
  phone2Href: "tel:+263711902582",
  email: "info@frankyplumbers.co.zw", // PLACEHOLDER
  officeHours: "Mon–Sat 7:00–18:00",
  socials: { facebook: "#", instagram: "#" }, // PLACEHOLDER
} as const;

export const waLink = (text?: string) =>
  `https://wa.me/${site.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

/** PLACEHOLDER figures: confirm with the client. */
export const stats = [
  { value: 15, suffix: "+", label: "Years in business" },
  { value: 4800, suffix: "+", label: "Jobs completed" },
  { value: 4.9, suffix: "★", label: "Average customer rating", decimals: 1 },
  { value: 60, suffix: "min", label: "Emergency response" },
] as const;

export type IconName =
  | "drop" | "bath" | "bolt" | "drain" | "geyser" | "tank" | "building" | "filter" | "wrench"
  | "phone" | "search" | "doc" | "shield" | "star" | "clock" | "mail" | "pin" | "check" | "arrow"
  | "whatsapp" | "menu" | "close" | "plus" | "facebook" | "instagram" | "quote" | "play" | "expand";

export type Service = {
  slug: string;
  title: string;
  short: string;
  icon: IconName;
  image?: WorkPhoto;
  emergency?: boolean;
};

export const services: Service[] = [
  {
    slug: "leaks",
    title: "Leak Detection & Repair",
    short: "Hidden leaks found fast with acoustic and thermal tools, then fixed with minimal damage to walls and floors.",
    icon: "drop",
    image: photo("team-basin"),
  },
  {
    slug: "installs",
    title: "Bathroom & Kitchen Installs",
    short: "Showers, baths, vanities, sinks and full refits, installed neatly with quality fittings that last.",
    icon: "bath",
    image: photo("shower-double-door"),
  },
  {
    slug: "emergency",
    title: "24/7 Emergency Plumbing",
    short: "Burst pipes, flooding or no water? A plumber is on the road within minutes, day or night, weekends included.",
    icon: "bolt",
    emergency: true,
    image: photo("team-drainage-trench"),
  },
  {
    slug: "drains",
    title: "Blocked Drains & Sewers",
    short: "High-pressure jetting and CCTV drain cameras clear blockages and show you exactly what caused them.",
    icon: "drain",
    image: photo("drainage-inspection"),
  },
  {
    slug: "geysers",
    title: "Geysers & Solar Heating",
    short: "Electric, gas and solar geysers supplied, installed, repaired and serviced. Hot water back the same day.",
    icon: "geyser",
    image: photo("solar-geyser"),
  },
  {
    slug: "water",
    title: "Tanks, Pumps & Boreholes",
    short: "Water tanks, booster pumps and borehole plumbing for steady pressure, even when municipal supply is down.",
    icon: "tank",
    image: photo("borehole-pump"),
  },
];

export const extraServices: Service[] = [
  { slug: "commercial", title: "Commercial Plumbing", short: "Restaurants, offices, schools and complexes. Planned maintenance contracts and priority call-outs.", icon: "building", image: photo("site-first-fix") },
  { slug: "filtration", title: "Water Filtration", short: "Whole-house and under-sink filters, softeners and purification for clean, safe drinking water.", icon: "filter" },
  { slug: "maintenance", title: "Maintenance Plans", short: "Annual inspections of geysers, valves, drains and pressure, so small problems get fixed before they turn into expensive ones.", icon: "wrench", image: photo("toilet-levelled") },
];

export const why = [
  { title: "Upfront, fixed pricing", text: "You approve the price before we start." },
  { title: "On time, every time", text: "Two-hour arrival windows, with a text when we're on the way." },
  { title: "Qualified tradesmen", text: "Certified, background-checked plumbers only." },
  { title: "Clean & tidy", text: "Shoe covers, drop sheets and a full clean-up." },
];

export const steps: { title: string; text: string; icon: IconName }[] = [
  { title: "Call or WhatsApp", text: "Tell us the problem. We'll book a time that suits you.", icon: "phone" },
  { title: "We diagnose", text: "A plumber inspects on site and finds the root cause.", icon: "search" },
  { title: "Approve the quote", text: "A clear, fixed price. Nothing starts without your OK.", icon: "doc" },
  { title: "Fixed & guaranteed", text: "Job done, area cleaned, backed by our 12-month guarantee.", icon: "wrench" },
];

/** SAMPLE CONTENT: replace with real, attributable reviews before launch. */
export const reviews = [
  { name: "Tendai M.", initials: "TM", meta: "Borrowdale · Emergency repair", text: "Our geyser burst at 2am. Franky's team picked up on the second ring and had a plumber here in 40 minutes. Professional, calm, and the price matched the quote exactly." },
  { name: "Sarah C.", initials: "SC", meta: "Mount Pleasant · Bathroom refit", text: "They redid our whole bathroom: new shower, vanity and toilet. Finished on schedule and left the place cleaner than they found it. We'd recommend them to anyone." },
  { name: "Kuda N.", initials: "KN", meta: "Avondale · Commercial client", text: "We use Franky Plumbing across all three of our restaurants. Reliable, well documented, and they fix things before they turn into problems. Easily the best plumbers we've worked with." },
];

export const areas = [
  "Borrowdale", "Avondale", "Mount Pleasant", "Greendale", "Highlands", "Chisipite",
  "Marlborough", "Belvedere", "Hatfield", "Msasa", "Ruwa", "Waterfalls",
];

export const faqs = [
  { q: "Do you charge a call-out fee?", a: "We charge a small assessment fee, and we waive it completely if you go ahead with the repair. You'll always know the price before any work begins." },
  { q: "How fast can you get to me in an emergency?", a: "For most Harare suburbs, we arrive within 60 minutes, 24/7. While you wait, shut off the main water valve and switch off your geyser at the distribution board." },
  { q: "Are your plumbers qualified and insured?", a: "Yes. Every technician is a certified plumber, background-checked, and covered by our public liability insurance." },
  { q: "Do you guarantee your work?", a: "All workmanship is guaranteed for 12 months. Parts carry the manufacturer's warranty. If something we fixed fails, we come back and sort it at no charge." },
  { q: "What payment methods do you accept?", a: "Cash (USD or ZiG), bank transfer, EcoCash and card. Commercial clients can apply for monthly accounts." },
];

export const serviceOptions = [
  "Emergency repair", "Leak detection & repair", "Blocked drain", "Geyser install / repair",
  "Bathroom & kitchen install", "Borehole / water tank", "Commercial", "Other",
];

export const nav = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Our Work" },
  { href: "/#about", label: "About" },
  { href: "/#reviews", label: "Reviews" },
  { href: "/contact", label: "Contact" },
];
