import { useLanguage } from "../context/LanguageContext";
import { useMainPhotos } from "../hooks/useTemple";

export default function Donation() {
  const { t } = useLanguage();
  const { data: mainPhotos = [] } = useMainPhotos();

  const bannerImages = mainPhotos
    .filter(photo => photo.section === 'donation')
    .sort((a, b) => a.sort_order - b.sort_order)
    .map(p => ({ src: p.url, alt: p.label || "Donation Banner" }));

  return (
    <section id="donation" className="py-16 sm:py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <span className="text-3xl sm:text-4xl mb-3 inline-block">🙏</span>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal mb-4">
            {t.donation.titlePrefix} <span className="text-gradient-gold">{t.donation.titleHighlight}</span>
          </h2>
          <div className="section-divider" />
          <p className="text-charcoal/70 max-w-xl mx-auto mt-5 text-sm sm:text-base leading-relaxed">
            {t.donation.subtitle}
          </p>
        </div>

        {/* ── Donation Banners Collage — only shown when images are uploaded via admin ── */}
        {bannerImages.length > 0 && (
          <div className="mb-10 sm:mb-14">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-5xl mx-auto">
              {bannerImages.map((img, idx) => (
                <div
                  key={idx}
                  className="relative overflow-hidden rounded-2xl shadow-xl border-2 border-saffron/20 group cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 via-transparent to-saffron/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Decorative corner accents */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-saffron/50 rounded-tl-2xl z-20" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-saffron/50 rounded-br-2xl z-20" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── QR Code & Bank Details ──────────────────────────── */}
        <div className="max-w-md sm:max-w-lg mx-auto">
          <div className="glass rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden border-2 border-saffron/20 group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-saffron/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-maroon/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 flex flex-col items-center">
              {/* QR Image */}
              <div className="mb-5 w-full flex justify-center">
                <div className="p-3 sm:p-4 bg-white rounded-xl shadow-inner border border-gray-100 w-full">
                  <img
                    src=""
                    alt="Temple Donation QR Code — Vishnu Maya Devi Amman Temple"
                    className="w-full max-w-[280px] sm:max-w-[360px] h-auto mx-auto group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Details */}
              <div className="text-center w-full space-y-3">
                <p className="text-saffron font-bold text-sm sm:text-base uppercase tracking-wide">
                  {t.donation.scanText}
                </p>

                <div className="bg-white/60 p-3 sm:p-4 rounded-xl border border-charcoal/5">
                  <p className="font-heading font-bold text-charcoal text-sm sm:text-base mb-1">
                    {t.donation.accountName}
                  </p>
                  <p className="text-charcoal/70 text-xs sm:text-sm mb-1">
                    {t.donation.bankName}
                  </p>
                  <p className="text-charcoal/60 text-xs mb-3">
                    A/C: 182201000003782 | IFSC: IOBA0001822
                  </p>
                  <div className="inline-block bg-charcoal text-saffron px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold tracking-wide">
                    {t.donation.upiId}: 8148692490@iob
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
