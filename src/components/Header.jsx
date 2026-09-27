import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";

const links = [
  { href: "#home", label: "الرئيسية" },
  { href: "#about", label: "من نحن" },
  { href: "#services", label: "خدماتنا" },
  { href: "#industries", label: "القطاعات" },
  { href: "#methodology", label: "منهجيتنا" },
  { href: "#success", label: "قصص النجاح" },
  { href: "#articles", label: "مقالات" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={`site-header section-full${scrolled ? " is-scrolled" : ""}`}>
      <div className="header-bar">
        <a className="brand" href="#home" onClick={close}>
          <Logo className="brand-mark" />
          <small>معاً.. نبني نمواً مستداماً</small>
        </a>

        <nav className="desktop-nav" aria-label="التنقل الرئيسي">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={link.href === "#home" ? "is-active" : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a className="btn btn-gold header-cta" href="#contact">
          تواصل معنا
        </a>

        <button
          type="button"
          className="menu-toggle"
          aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div className={`mobile-panel${open ? " is-open" : ""}`}>
        <nav aria-label="تنقل الجوال">
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={close}>
              {link.label}
            </a>
          ))}
        </nav>
        <a className="btn btn-gold" href="#contact" onClick={close}>
          تواصل معنا
        </a>
      </div>
    </header>
  );
}
