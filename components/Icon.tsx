import Image from "next/image";
import type { IconName } from "@/lib/site";

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" } as const;

const paths: Record<IconName, React.ReactNode> = {
  drop: <path {...stroke} d="M12 2.7C8 7.3 5 10.8 5 14.5a7 7 0 0 0 14 0c0-3.7-3-7.2-7-11.8z" />,
  bath: <g {...stroke}><path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.7 3 4 3.7 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" /><path d="M2 12h20M7 19v2M17 19v2" /></g>,
  bolt: <path {...stroke} d="M13 2 3 14h9l-1 8 10-12h-9z" />,
  drain: <path {...stroke} d="M3 12h4l3-8 4 16 3-8h4" />,
  geyser: <g {...stroke}><rect x="6" y="2" width="12" height="20" rx="6" /><path d="M12 9v4" /><circle cx="12" cy="16" r="1.5" /></g>,
  tank: <g {...stroke}><path d="M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3z" /><path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" /></g>,
  building: <path {...stroke} d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" />,
  filter: <g {...stroke}><path d="M12 2.7C8 7.3 5 10.8 5 14.5a7 7 0 0 0 14 0c0-3.7-3-7.2-7-11.8z" /><path d="M9 14.5h6" /></g>,
  wrench: <path {...stroke} d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z" />,
  phone: <path {...stroke} d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />,
  search: <g {...stroke}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></g>,
  doc: <g {...stroke}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M9 15l2 2 4-4" /></g>,
  shield: <g {...stroke}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></g>,
  star: <path fill="currentColor" d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" />,
  clock: <g {...stroke}><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></g>,
  mail: <g {...stroke}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" /></g>,
  pin: <path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />,
  check: <path {...stroke} strokeWidth={3} d="M20 6 9 17l-5-5" />,
  arrow: <path {...stroke} strokeWidth={2.2} d="M5 12h14M13 6l6 6-6 6" />,
  whatsapp: <path fill="currentColor" d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5.3-.5c.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3zM12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 1 1 12 21.8zm8.4-18.2A11.8 11.8 0 0 0 1.7 17.8L0 24l6.3-1.7A11.8 11.8 0 0 0 24 12c0-3.2-1.2-6.1-3.5-8.4z" />,
  menu: <path {...stroke} d="M4 7h16M4 12h16M4 17h16" />,
  close: <path {...stroke} d="M18 6 6 18M6 6l12 12" />,
  plus: <path {...stroke} strokeWidth={2.6} d="M12 5v14M5 12h14" />,
  facebook: <path fill="currentColor" d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H8v4h2v8h4v-8h3l1-4h-4V8z" />,
  instagram: <g fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></g>,
  play: <path fill="currentColor" d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" />,
  expand: <path {...stroke} d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />,
  quote: <path fill="currentColor" d="M7 7h4v4c0 3-1.5 5-4 6l-.8-1.4C7.7 14.8 8.4 13.6 8.5 12H7zm8 0h4v4c0 3-1.5 5-4 6l-.8-1.4c1.5-.8 2.2-2 2.3-3.6H15z" />,
};

export function Icon({ name, className, size }: { name: IconName; className?: string; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" className={className} width={size} height={size} aria-hidden="true" focusable="false">
      {paths[name]}
    </svg>
  );
}

/** Franky Plumbing Services mark (transparent cut-out of the official logo). */
export function Logo({ className }: { className?: string }) {
  return <Image src="/brand/fp-mark.png" alt="" width={540} height={563} className={className} sizes="48px" priority />;
}
