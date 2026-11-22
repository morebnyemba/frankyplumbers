import Link from "next/link";
import { Icon, Logo } from "./Icon";
import { FooterLink } from "./chrome";
import { extraServices, services, site, waLink } from "@/lib/site";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-about">
          <Link className="brand" href="/" aria-label={`${site.name} home`}>
            <Logo className="brand-mark" />
            <span className="brand-text">
              <span className="brand-name">Franky<span>Plumbers</span></span>
              <span className="brand-tag">Licensed · Insured</span>
            </span>
          </Link>
          <p>Licensed, insured plumbers serving Harare homes and businesses for over 15 years. Fast response, fair prices, guaranteed work.</p>
          <div className="socials">
            <a href={site.socials.facebook} aria-label="Facebook"><Icon name="facebook" /></a>
            <a href={site.socials.instagram} aria-label="Instagram"><Icon name="instagram" /></a>
            <a href={waLink()} aria-label="WhatsApp" target="_blank" rel="noopener"><Icon name="whatsapp" /></a>
          </div>
        </div>
        <div>
          <h4>Services</h4>
          <ul>
            {[...services, ...extraServices].slice(0, 7).map((s) => (
              <li key={s.slug}><FooterLink href={`/services#${s.slug}`}>{s.title}</FooterLink></li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Company</h4>
          <ul>
            <li><FooterLink href="/#about">About us</FooterLink></li>
            <li><FooterLink href="/#reviews">Reviews</FooterLink></li>
            <li><FooterLink href="/services">All services</FooterLink></li>
            <li><FooterLink href="/contact">Contact</FooterLink></li>
          </ul>
        </div>
        <div>
          <h4>Get in touch</h4>
          <ul className="footer-contact">
            <li><Icon name="phone" /><a href={site.phoneHref}>{site.phoneDisplay}</a></li>
            <li><Icon name="mail" /><a href={`mailto:${site.email}`}>{site.email}</a></li>
            <li><Icon name="pin" /><span>{site.city}, {site.country}</span></li>
            <li><Icon name="clock" /><span>Emergencies 24/7 · Office {site.officeHours}</span></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <span>© {new Date().getFullYear()} {site.name}. All rights reserved.</span>
          <span>Website by <a href="https://slykertech.co.zw" target="_blank" rel="noopener">Slyker Tech</a></span>
        </div>
      </div>
    </footer>
  );
}
