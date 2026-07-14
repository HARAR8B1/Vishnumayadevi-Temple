import { useLanguage } from "../context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  const handleNavClick = (e, href) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-charcoal text-cream border-t border-saffron/10 pt-12 sm:pt-16 pb-6 sm:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 mb-10 sm:mb-12">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <a href="#home" onClick={(e) => handleNavClick(e, "#home")} className="flex items-center gap-3 mb-4 group">
              <span className="text-2xl sm:text-3xl transition-transform duration-300 group-hover:scale-110">🙏</span>
              <div>
                <span className="block font-heading text-base sm:text-lg font-bold text-saffron leading-tight">
                  {t.hero.titleLine1}
                </span>
                <span className="block text-[9px] sm:text-[10px] text-saffron-light/60 tracking-widest uppercase">
                  {t.hero.titleLine2}
                </span>
              </div>
            </a>
            <p className="text-cream/60 text-xs sm:text-sm leading-relaxed max-w-sm">
              {t.footer.brandSub}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-saffron tracking-wider uppercase mb-4 text-xs sm:text-sm">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2 grid grid-cols-2 sm:grid-cols-1 gap-x-4 gap-y-2">
              {[
                { label: t.nav.home, href: "#home" },
                { label: t.nav.about, href: "#about" },
                { label: t.nav.construction, href: "#construction" },
                { label: t.nav.gallery, href: "#gallery" },
                { label: t.nav.timings, href: "#timings" },
                { label: t.nav.events, href: "#events" },
                { label: t.nav.history, href: "#history" },
                { label: t.nav.donation, href: "#donation" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-cream/70 hover:text-saffron transition-colors text-xs sm:text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-saffron tracking-wider uppercase mb-4 text-xs sm:text-sm">
              {t.footer.contactHeader}
            </h4>
            <ul className="space-y-3">
              <li className="flex gap-3 text-xs sm:text-sm text-cream/70">
                <span className="text-saffron mt-0.5 shrink-0">📍</span>
                <span>Plot no. 28, Sai Ganesh Nagar, 1st Main Road, Jalladiyanpet, Pallikaranai, Chennai – 600100</span>
              </li>
              <li className="flex gap-3 text-xs sm:text-sm text-cream/70 items-start">
                <span className="text-saffron shrink-0 mt-0.5">📞</span>
                <div>
                  <p className="text-cream/50 text-[11px] mb-0.5">President — Shri. T.M. Karthikeyan</p>
                  <a href="tel:+919444291833" className="hover:text-saffron transition-colors block">+91 94442 91833</a>
                  <a href="tel:+917358014644" className="hover:text-saffron transition-colors block text-cream/50 text-xs">+91 73580 14644</a>
                </div>
              </li>
              <li className="flex gap-3 text-xs sm:text-sm text-cream/70 items-center">
                <span className="text-saffron shrink-0">✉️</span>
                <a href="mailto:vishnumayuadeviamman@gmail.com" className="break-all hover:text-saffron transition-colors">vishnumayuadeviamman@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-saffron/10 flex flex-col sm:flex-row justify-between items-center gap-3 text-[10px] sm:text-xs text-cream/50">
          <p className="text-center sm:text-left">© {new Date().getFullYear()} {t.footer.copyright}</p>
          <div className="flex gap-4 sm:gap-6">
            <a href="#" className="hover:text-saffron transition-colors">{t.footer.privacy}</a>
            <a href="#" className="hover:text-saffron transition-colors">{t.footer.terms}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
