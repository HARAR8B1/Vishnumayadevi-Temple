import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 768) setIsMobileOpen(false); };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navLinks = [
    { label: t.nav.home, href: "#home" },
    { label: t.nav.about, href: "#about" },
    { label: t.nav.construction, href: "#construction" },
    { label: t.nav.gallery, href: "#gallery" },
    { label: t.nav.timings, href: "#timings" },
    { label: t.nav.events, href: "#events" },
    { label: t.nav.committee, href: "#committee" },
    { label: t.nav.history, href: "#history" },
    { label: t.nav.donation, href: "#donation" },
    { label: t.nav.contact, href: "#contact" },
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setIsMobileOpen(false);
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? "glass-dark shadow-lg shadow-maroon/10 py-2" : "bg-charcoal/80 backdrop-blur-sm py-3"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2">

          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => handleNavClick(e, "#home")}
            className="flex items-center gap-2 group shrink-0"
          >
            <span className="text-2xl transition-transform duration-300 group-hover:scale-110">🙏</span>
            <div className="flex flex-col leading-tight">
              <span className="font-heading text-sm sm:text-base font-bold text-saffron">
                {t.hero.titleLine1}
              </span>
              <span className="text-[9px] sm:text-[10px] text-saffron-light/60 tracking-widest uppercase">
                {t.hero.titleLine2}
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-0.5 flex-wrap">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={link.external ? undefined : (e) => handleNavClick(e, link.href)}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="relative px-3 py-2 text-xs font-medium text-cream/80 hover:text-saffron transition-colors duration-300 group whitespace-nowrap"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-saffron rounded-full transition-all duration-300 group-hover:w-3/4" />
              </a>
            ))}
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="ml-2 px-3 py-1.5 rounded-full border border-saffron/30 hover:border-saffron text-saffron hover:bg-saffron/10 transition-all text-xs font-semibold"
            >
              🌐 {language === "en" ? "தமிழ்" : "English"}
            </button>
            {/* Virtual Darshan Button */}
            <button
              onClick={() => navigate("/virtual-darshan")}
              className="ml-2 px-3 py-1.5 rounded-full bg-saffron/20 border border-saffron/50 hover:bg-saffron hover:text-charcoal text-saffron transition-all text-xs font-bold flex items-center gap-1"
            >
              🕉️ Virtual Darshan
            </button>
            {/* Social Icons (Desktop) */}
            <div className="flex items-center gap-1.5 ml-2">
              <a
                href="https://www.youtube.com/@vishnumaya-f8d"
                target="_blank" rel="noopener noreferrer"
                className="p-1 rounded-full hover:bg-saffron/10 transition-all text-lg opacity-90 hover:opacity-100"
                title="YouTube"
              >
                ▶️
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61591645240487&sk=photos"
                target="_blank" rel="noopener noreferrer"
                className="p-1 rounded-full hover:bg-saffron/10 transition-all text-lg opacity-90 hover:opacity-100"
                title="Facebook"
              >
                📘
              </a>
              <a
                href="https://www.instagram.com/vishnumayadeviamman/"
                target="_blank" rel="noopener noreferrer"
                className="p-1 rounded-full hover:bg-saffron/10 transition-all text-lg opacity-90 hover:opacity-100"
                title="Instagram"
              >
                📸
              </a>
            </div>

          </div>

          {/* Mobile controls */}
          <div className="flex lg:hidden items-center gap-2">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1 rounded-full border border-saffron/40 text-saffron text-[11px] font-semibold"
            >
              {language === "en" ? "தமிழ்" : "EN"}
            </button>
            {/* Hamburger */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="flex flex-col gap-1.5 p-2"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileOpen}
            >
              <span className={`block w-5 h-0.5 bg-saffron transition-all duration-300 ${isMobileOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block w-5 h-0.5 bg-saffron transition-all duration-300 ${isMobileOpen ? "opacity-0 scale-x-0" : ""}`} />
              <span className={`block w-5 h-0.5 bg-saffron transition-all duration-300 ${isMobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-400 ease-in-out ${
          isMobileOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="glass-dark mx-3 mt-2 mb-1 rounded-2xl px-3 py-3 flex flex-col divide-y divide-saffron/10">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={link.external ? undefined : (e) => handleNavClick(e, link.href)}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="px-3 py-3 text-sm text-cream/80 hover:text-saffron hover:bg-saffron/5 rounded-xl transition-all duration-200 font-medium"
            >
              {link.label}
            </a>
          ))}
          {/* Virtual Darshan Link (Mobile) */}
          <button
            onClick={() => { setIsMobileOpen(false); navigate("/virtual-darshan"); }}
            className="mt-2 mx-0 px-3 py-3 text-sm font-bold text-saffron bg-saffron/10 hover:bg-saffron/20 rounded-xl transition-all duration-200 flex items-center gap-2 w-full"
          >
            🕉️ Virtual Darshan
          </button>
          {/* Social Icons (Mobile) */}
          <div className="flex items-center justify-center gap-6 py-4 mt-2 border-t border-saffron/10">
            <a href="https://www.youtube.com/@vishnumaya-f8d" target="_blank" rel="noopener noreferrer" className="text-2xl opacity-90 hover:opacity-100 transition-opacity" title="YouTube">▶️</a>
            <a href="https://www.facebook.com/profile.php?id=61591645240487&sk=photos" target="_blank" rel="noopener noreferrer" className="text-2xl opacity-90 hover:opacity-100 transition-opacity" title="Facebook">📘</a>
            <a href="https://www.instagram.com/vishnumayadeviamman/" target="_blank" rel="noopener noreferrer" className="text-2xl opacity-90 hover:opacity-100 transition-opacity" title="Instagram">📸</a>
          </div>
        </div>
      </div>
    </nav>
  );
}
