import { useLanguage } from "../context/LanguageContext";
import { useMainPhotos } from "../hooks/useTemple";

export default function Hero() {
  const { t } = useLanguage();
  const { data: mainPhotos = [] } = useMainPhotos();

  // Filter and sort hero photos
  const heroPhotos = mainPhotos
    .filter(photo => photo.section === 'hero')
    .sort((a, b) => a.sort_order - b.sort_order);

  // Fallbacks
  const fallbackPortrait = "/images/hero-custom.jpg";

  // Assign portrait
  const portraitUrl = heroPhotos.length > 0 ? heroPhotos[0].url : fallbackPortrait;
  const secondaryUrl = heroPhotos.length > 1 ? heroPhotos[1].url : portraitUrl;
  const portraitBg = `url('${portraitUrl}')`;

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-charcoal"
    >
      {/* Full-screen blurred hero background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-2xl opacity-20 scale-110"
        style={{ backgroundImage: portraitBg }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-charcoal/60" />

      {/* Decorative Om symbols - hidden on small screens */}
      <div className="hidden sm:block absolute top-20 left-6 text-5xl opacity-10 animate-float text-saffron select-none pointer-events-none">ॐ</div>
      <div className="hidden sm:block absolute bottom-24 right-6 text-4xl opacity-10 animate-float text-saffron select-none pointer-events-none" style={{ animationDelay: "1.5s" }}>🪔</div>

      {/* ── Main Content ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">

        {/* MOBILE: stacked layout */}
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-14">

          {/* ── LEFT: Text Block ── */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left w-full lg:w-[42%] flex-shrink-0">
            <span className="text-4xl sm:text-5xl text-saffron animate-pulse-glow mb-3 inline-block">ॐ</span>

            <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-cream leading-tight mb-3">
              {t.hero.titleLine1}
              <br />
              <span className="text-gradient-gold">{t.hero.titleLine2}</span>
            </h1>

            <div className="w-28 h-0.5 bg-gradient-to-r from-transparent via-saffron to-transparent my-4" />

            <p className="text-sm sm:text-base lg:text-lg text-cream/80 font-light max-w-xs sm:max-w-sm mb-2">
              {t.hero.tagline}
            </p>
            <p className="text-[10px] sm:text-xs text-saffron/70 tracking-widest uppercase mb-6">
              {t.hero.location}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-row gap-3 w-full justify-center lg:justify-start">
              <a
                href="#about"
                onClick={(e) => { e.preventDefault(); document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" }); }}
                className="px-5 py-2.5 sm:px-7 sm:py-3 bg-saffron hover:bg-saffron-dark text-charcoal font-semibold rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-saffron/30 hover:-translate-y-1 text-xs sm:text-sm"
              >
                {t.hero.exploreBtn}
              </a>
              <a
                href="#contact"
                onClick={(e) => { e.preventDefault(); document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" }); }}
                className="px-5 py-2.5 sm:px-7 sm:py-3 border-2 border-saffron/50 hover:border-saffron text-cream hover:text-saffron rounded-full transition-all duration-300 hover:-translate-y-1 text-xs sm:text-sm"
              >
                {t.hero.contactBtn}
              </a>
            </div>

            {/* Hero 1 Image - Aligned under text */}
            <div className="mt-8 lg:mt-12 w-full flex justify-center lg:justify-start">
              <div className="relative rounded-xl overflow-hidden shadow-xl border-2 border-saffron/30 ring-2 ring-saffron/10 w-32 sm:w-40 lg:w-48 aspect-[3/4]">
                <img
                  src={portraitUrl}
                  alt="Sri Vishnu Maya Devi Amman"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 to-transparent pointer-events-none" />
              </div>
            </div>
          </div>

          {/* ── RIGHT: Large Notice Image ── */}
          <div className="flex-1 w-full flex flex-col items-center justify-center mt-12 lg:mt-0">
            <div className="relative w-full max-w-lg lg:max-w-2xl rounded-2xl overflow-hidden shadow-2xl border-2 border-saffron/30 ring-4 ring-saffron/10 group bg-charcoal/30 flex justify-center items-center p-2 sm:p-4">
              <img
                src={secondaryUrl}
                alt="Temple Notice"
                className="w-full h-auto max-h-[60vh] sm:max-h-[75vh] lg:max-h-[85vh] object-contain transition-transform duration-700 group-hover:scale-[1.02]"
              />
            </div>

            <p className="text-center text-saffron/50 text-[10px] tracking-widest mt-6 uppercase">
              ✦ Divine Blessings ✦
            </p>
          </div>

        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce z-10">
        <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-saffron/40 rounded-full flex justify-center pt-1.5">
          <div className="w-1 h-2.5 sm:w-1.5 sm:h-3 bg-saffron rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
