import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { heroImages } from "../data/staticData";

export default function Hero() {
  const { t } = useLanguage();
  const [activeIdx, setActiveIdx] = useState(0);
  const [fade, setFade] = useState(true);

  // Default images if heroImages is empty
  const images = heroImages.length > 0 ? heroImages : [
    { id: 1, url: "/images/hero-custom.jpg", alt: "Sri Vishnu Maya Devi Amman", caption: "அருள்மிகு ஸ்ரீ விஷ்ணு மாயாதேவி அம்மன்" }
  ];

  // Auto-advance slideshow every 4 seconds
  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setActiveIdx(prev => (prev + 1) % images.length);
        setFade(true);
      }, 300);
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  const goTo = (idx) => {
    setFade(false);
    setTimeout(() => { setActiveIdx(idx); setFade(true); }, 300);
  };

  const currentImage = images[activeIdx];
  const deityImage = images[0]; // First image is always the deity portrait

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-charcoal"
    >
      {/* Full-screen blurred hero background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-2xl opacity-20 scale-110 transition-all duration-700"
        style={{ backgroundImage: `url('${currentImage.url}')` }}
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

          {/* ── LEFT: Text Block + Deity Portrait ── */}
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

            {/* Deity Portrait (always the first image) */}
            <div className="mt-8 lg:mt-12 w-full flex justify-center lg:justify-start">
              <div className="relative rounded-xl overflow-hidden shadow-xl border-2 border-saffron/30 ring-2 ring-saffron/10 w-32 sm:w-40 lg:w-48 aspect-[3/4]">
                <img
                  src={deityImage.url}
                  alt={deityImage.alt}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 to-transparent pointer-events-none" />
              </div>
            </div>
          </div>

          {/* ── RIGHT: Slideshow of all 3 images ── */}
          <div className="flex-1 w-full flex flex-col items-center justify-center mt-12 lg:mt-0">
            <div className="relative w-full max-w-lg lg:max-w-2xl rounded-2xl overflow-hidden shadow-2xl border-2 border-saffron/30 ring-4 ring-saffron/10 group bg-charcoal/30 flex justify-center items-center p-2 sm:p-4">
              <img
                src={currentImage.url}
                alt={currentImage.alt}
                className={`w-full h-auto max-h-[60vh] sm:max-h-[75vh] lg:max-h-[85vh] object-contain transition-opacity duration-300 group-hover:scale-[1.02] ${fade ? "opacity-100" : "opacity-0"}`}
              />

              {/* Prev / Next arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => goTo((activeIdx - 1 + images.length) % images.length)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-charcoal/60 hover:bg-saffron/80 text-cream hover:text-charcoal flex items-center justify-center transition-all duration-200 text-sm font-bold z-10"
                    aria-label="Previous image"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => goTo((activeIdx + 1) % images.length)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-charcoal/60 hover:bg-saffron/80 text-cream hover:text-charcoal flex items-center justify-center transition-all duration-200 text-sm font-bold z-10"
                    aria-label="Next image"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {/* Dot indicators + caption */}
            {images.length > 1 && (
              <div className="flex flex-col items-center gap-2 mt-4">
                <div className="flex gap-2">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => goTo(idx)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === activeIdx ? "bg-saffron w-6" : "bg-saffron/30 hover:bg-saffron/60"}`}
                      aria-label={`Go to image ${idx + 1}`}
                    />
                  ))}
                </div>
                <p className={`text-center text-saffron/60 text-[11px] tracking-widest uppercase transition-opacity duration-300 ${fade ? "opacity-100" : "opacity-0"}`}>
                  ✦ {currentImage.caption} ✦
                </p>
              </div>
            )}
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
