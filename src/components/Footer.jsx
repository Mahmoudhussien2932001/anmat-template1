import { Mail, MapPin, Phone } from "lucide-react";
import Logo from "./Logo";

const quickLeft = [
  { href: "#home", label: "الرئيسية" },
  { href: "#success", label: "قصص النجاح" },
  { href: "#articles", label: "مقالات" },
  { href: "#contact", label: "تواصل معنا" },
];

const quickRight = [
  { href: "#methodology", label: "منهجيتنا" },
  { href: "#about", label: "من نحن" },
  { href: "#services", label: "خدماتنا" },
  { href: "#industries", label: "القطاعات" },
];

function SocialIcon({ name }) {
  const paths = {
    linkedin:
      "M4.5 3.5A1.5 1.5 0 1 0 4.5 6.5 1.5 1.5 0 0 0 4.5 3.5zM3.2 8.2h2.6V20H3.2V8.2zm4.2 0h2.5v1.6h.1c.3-.6 1.2-1.3 2.5-1.3 2.7 0 3.2 1.8 3.2 4.1V20h-2.6v-5.2c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V20H7.4V8.2z",
    x: "M14.7 10.3 22.4 1.5h-1.8l-6.7 7.6L8.4 1.5H1.8l8.1 11.5L1.8 22.5h1.8l7.1-8.1 5.7 8.1h6.6l-8.3-12.2Zm-2.5 2.9-.8-1.2L4.3 2.9h2.8l5.3 7.4.8 1.2 6.9 9.6h-2.8l-5.1-7.9Z",
    instagram:
      "M12 7.2A4.8 4.8 0 1 0 12 16.8 4.8 4.8 0 0 0 12 7.2zm0 7.9a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2zM17.4 6.9a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0zM12 4.6c1.5 0 1.7 0 2.3.1.6 0 1 .1 1.2.3.3.1.5.3.8.6.2.2.4.5.5.8.2.2.3.6.3 1.2.1.6.1.8.1 2.3s0 1.7-.1 2.3c0 .6-.1 1-.3 1.2-.1.3-.3.5-.6.8-.2.2-.5.4-.8.5-.2.2-.6.3-1.2.3-.6.1-.8.1-2.3.1s-1.7 0-2.3-.1c-.6 0-1-.1-1.2-.3-.3-.1-.5-.3-.8-.6-.2-.2-.4-.5-.5-.8-.2-.2-.3-.6-.3-1.2-.1-.6-.1-.8-.1-2.3s0-1.7.1-2.3c0-.6.1-1 .3-1.2.1-.3.3-.5.6-.8.2-.2.5-.4.8-.5.2-.2.6-.3 1.2-.3.6-.1.8-.1 2.3-.1zm0-1.6c-1.5 0-1.7 0-2.4.1-.6 0-1.1.1-1.5.3-.4.2-.8.4-1.1.7-.3.3-.5.7-.7 1.1-.2.4-.3.9-.3 1.5-.1.6-.1.8-.1 2.4s0 1.7.1 2.4c0 .6.1 1.1.3 1.5.2.4.4.8.7 1.1.3.3.7.5 1.1.7.4.2.9.3 1.5.3.6.1.8.1 2.4.1s1.7 0 2.4-.1c.6 0 1.1-.1 1.5-.3.4-.2.8-.4 1.1-.7.3-.3.5-.7.7-1.1.2-.4.3-.9.3-1.5.1-.6.1-.8.1-2.4s0-1.7-.1-2.4c0-.6-.1-1.1-.3-1.5-.2-.4-.4-.8-.7-1.1-.3-.3-.7-.5-1.1-.7-.4-.2-.9-.3-1.5-.3-.6-.1-.8-.1-2.4-.1z",
    youtube:
      "M23 12.2s0-3.2-.4-4.6c-.2-.9-.9-1.6-1.8-1.8C19.2 5.4 12 5.4 12 5.4s-7.2 0-8.8.4c-.9.2-1.6.9-1.8 1.8C1 9 1 12.2 1 12.2s0 3.2.4 4.6c.2.9.9 1.6 1.8 1.8 1.6.4 8.8.4 8.8.4s7.2 0 8.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.4.4-4.6.4-4.6zM9.8 15.5v-6.6l6.2 3.3-6.2 3.3z",
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" width="15" height="15">
      <path fill="currentColor" d={paths[name]} />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="footer section-full" id="contact">
      <div className="footer-grid">
        <div className="footer-brand">
          <Logo className="brand-mark" />
          <small>معاً.. نبني نمواً مستداماً</small>
        </div>

        <div>
          <h2>معلومات التواصل</h2>
          <ul className="contact-list">
            <li>
              <Phone size={16} />
              <a href="tel:+966504395551">+966 50 439 5551</a>
            </li>
            <li>
              <Mail size={16} />
              <a href="mailto:info@FranchiseME.net">info@FranchiseME.net</a>
            </li>
            <li>
              <MapPin size={16} />
              <span>
                Khalid Bin Waleed Street - 4th Floor,
                <br />
                Qurtubah - Riyadh,
                <br />
                PO BOX: 13244
              </span>
            </li>
          </ul>
        </div>

        <div>
          <h2>روابط سريعة</h2>
          <div className="footer-links">
            <ul>
              {quickLeft.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
            <ul>
              {quickRight.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <h2>تابعنا على</h2>
          <div className="socials">
            <a href="https://www.linkedin.com" aria-label="LinkedIn" target="_blank" rel="noreferrer">
              <SocialIcon name="linkedin" />
            </a>
            <a href="https://x.com" aria-label="X" target="_blank" rel="noreferrer">
              <SocialIcon name="x" />
            </a>
            <a href="https://www.instagram.com" aria-label="Instagram" target="_blank" rel="noreferrer">
              <SocialIcon name="instagram" />
            </a>
            <a href="https://www.youtube.com" aria-label="YouTube" target="_blank" rel="noreferrer">
              <SocialIcon name="youtube" />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2024 FranchiseME. جميع الحقوق محفوظة.</p>
        <p>معاً.. نبني نمواً مستداماً</p>
      </div>
    </footer>
  );
}
