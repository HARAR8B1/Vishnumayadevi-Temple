import { useTempleInfo } from "../hooks/useTemple";
import { useLanguage } from "../context/LanguageContext";

export default function About() {
  const { data: temple, isLoading } = useTempleInfo();
  const { language, t } = useLanguage();

  return (
    <section id="about" className="py-20 sm:py-28 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-saffron text-4xl mb-4 inline-block">🙏</span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-charcoal mb-4">
            {t.about.titlePrefix} <span className="text-gradient-gold">{t.about.titleHighlight}</span>
          </h2>
          <div className="section-divider" />
        </div>

        {isLoading ? (
          <div className="flex justify-center">
            <div className="w-12 h-12 border-4 border-saffron/30 border-t-saffron rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Description and Info Cards */}
            <div className="flex flex-col gap-10">
              <div className="space-y-4">
                {temple?.description?.[language]
                  ?.split("\n")
                  .map((line, i) => {
                    const trimmed = line.trim();
                    if (!trimmed) return null;
                    // Title line (first line – temple name)
                    if (i === 0)
                      return (
                        <h3 key={i} className="font-heading text-xl sm:text-2xl font-bold text-maroon">
                          {trimmed}
                        </h3>
                      );
                    // Address line (second non-empty line)
                    if (i === 1)
                      return (
                        <p key={i} className="text-sm font-medium text-saffron-dark tracking-wide">
                          {trimmed}
                        </p>
                      );
                    // Section header lines (e.g. starts with 🔔)
                    if (trimmed.startsWith("🔔"))
                      return (
                        <p key={i} className="font-heading text-lg font-bold text-maroon mt-4 flex items-center gap-2">
                          {trimmed}
                        </p>
                      );
                    // Bullet point lines
                    if (trimmed.startsWith("•"))
                      return (
                        <p key={i} className="text-base text-charcoal/80 leading-relaxed pl-4 pr-4 md:pr-8 border-l-2 border-saffron/40">
                          {trimmed}
                        </p>
                      );
                    // Closing invitation line (English or Tamil)
                    if (trimmed.startsWith("We invite") || trimmed.startsWith("அனைத்து பக்தர்"))
                      return (
                        <p key={i} className="text-base font-semibold text-maroon italic pr-4 md:pr-8 mt-2">
                          {trimmed}
                        </p>
                      );
                    // Regular paragraph
                    return (
                      <p key={i} className="text-base md:text-lg text-charcoal/80 leading-relaxed pr-4 md:pr-8 text-justify">
                        {trimmed}
                      </p>
                    );
                  })}
              </div>

              {/* Info Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Rating */}
                <div className="glass rounded-2xl p-6 card-hover flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">⭐</span>
                    <span className="font-heading text-3xl font-bold text-maroon">
                      {temple?.rating}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-charcoal/70">
                    {t.about.ratingSub.replace("{count}", temple?.reviewCount)}
                  </p>
                </div>

                {/* Category */}
                <div className="glass rounded-2xl p-6 card-hover flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">🛕</span>
                    <span className="font-heading text-xl font-bold text-maroon">
                      {t.about.category}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-charcoal/70">
                    {t.about.categorySub}
                  </p>
                </div>

                {/* Phone */}
                <div className="glass rounded-2xl p-6 card-hover flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">📞</span>
                    <span className="font-medium text-charcoal text-base">
                      {temple?.phone}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-charcoal/70">{t.about.phoneSub}</p>
                </div>

                {/* Email */}
                <div className="glass rounded-2xl p-6 card-hover flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">✉️</span>
                    <span className="font-medium text-charcoal text-sm break-all">
                      {temple?.email}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-charcoal/70">{t.about.emailSub}</p>
                </div>
              </div>
            </div>

            {/* Map and Address */}
            <div className="flex flex-col gap-6">
              {/* Address Card */}
              <div className="glass rounded-2xl p-8 card-hover relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-saffron/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10 flex items-start gap-5">
                  <span className="text-4xl mt-1">📍</span>
                  <div>
                    <h3 className="font-heading text-xl font-bold text-maroon mb-2">
                      {t.about.locationTitle}
                    </h3>
                    <p className="text-charcoal/80 leading-relaxed pr-2">
                      {temple?.address?.[language]}
                    </p>
                    <a
                      href="https://maps.app.goo.gl/oLfJUvr1xPGiprNB8"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-4 text-saffron-dark hover:text-maroon font-bold text-sm transition-colors uppercase tracking-wider"
                    >
                      {t.about.directions} <span aria-hidden="true">&rarr;</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Embedded Map */}
              <div className="rounded-2xl overflow-hidden shadow-xl border-2 border-saffron/20 h-[350px]">
                <iframe
                  title="Sri Vishnu Maya Devi Amman Temple Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.1!2d80.2057366!3d12.9228645!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525dfcfbebda9b%3A0x10991f56a8ffb3a3!2sSri%20Vishnu%20Maya%20Devi%20Amman%20Temple!5e0!3m2!1sen!2sin!4v1720000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
