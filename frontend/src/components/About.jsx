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
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Description */}
            <div className="space-y-6">
              <p className="text-lg text-charcoal/80 leading-relaxed whitespace-pre-wrap">
                {temple?.description?.[language]}
              </p>

              {/* Info Cards */}
              <div className="grid sm:grid-cols-2 gap-4 mt-8">
                {/* Rating */}
                <div className="glass rounded-2xl p-5 card-hover">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">⭐</span>
                    <span className="font-heading text-2xl font-bold text-maroon">
                      {temple?.rating}
                    </span>
                  </div>
                  <p className="text-sm text-charcoal/60">
                    {t.about.ratingSub.replace("{count}", temple?.reviewCount)}
                  </p>
                </div>

                {/* Category */}
                <div className="glass rounded-2xl p-5 card-hover">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">🛕</span>
                    <span className="font-heading text-lg font-bold text-maroon">
                      {t.about.category}
                    </span>
                  </div>
                  <p className="text-sm text-charcoal/60">
                    {t.about.categorySub}
                  </p>
                </div>

                {/* Phone */}
                <div className="glass rounded-2xl p-5 card-hover">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">📞</span>
                    <span className="font-medium text-charcoal text-sm">
                      {temple?.phone}
                    </span>
                  </div>
                  <p className="text-sm text-charcoal/60">{t.about.phoneSub}</p>
                </div>

                {/* Email */}
                <div className="glass rounded-2xl p-5 card-hover">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">✉️</span>
                    <span className="font-medium text-charcoal text-sm break-all">
                      {temple?.email}
                    </span>
                  </div>
                  <p className="text-sm text-charcoal/60">{t.about.emailSub}</p>
                </div>
              </div>
            </div>

            {/* Map + Address */}
            <div className="space-y-6">
              {/* Address Card */}
              <div className="glass rounded-2xl p-6 card-hover">
                <div className="flex items-start gap-4">
                  <span className="text-3xl mt-1">📍</span>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-maroon mb-1">
                      {t.about.locationTitle}
                    </h3>
                    <p className="text-charcoal/70 leading-relaxed">
                      {temple?.address?.[language]}
                    </p>
                    <a
                      href="https://maps.app.goo.gl/oLfJUvr1xPGiprNB8"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-3 text-saffron-dark hover:text-maroon font-medium text-sm transition-colors"
                    >
                      {t.about.directions}
                    </a>
                  </div>
                </div>
              </div>

              {/* Embedded Map */}
              <div className="rounded-2xl overflow-hidden shadow-lg border-2 border-saffron/10">
                <iframe
                  title="Sri Vishnu Maya Devi Amman Temple Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.1!2d80.2057366!3d12.9228645!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525dfcfbebda9b%3A0x10991f56a8ffb3a3!2sSri%20Vishnu%20Maya%20Devi%20Amman%20Temple!5e0!3m2!1sen!2sin!4v1720000000000!5m2!1sen!2sin"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
