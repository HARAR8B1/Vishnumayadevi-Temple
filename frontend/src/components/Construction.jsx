import { useLanguage } from "../context/LanguageContext";

export default function Construction() {
  const { language, t } = useLanguage();

  const constructionImages = [
    { src: "/images/construction-1.png", alt: "Temple Construction Ritual 1" },
    { src: "/images/construction-2.jpg", alt: "Temple Construction Ritual 2" },
    { src: "/images/construction-3.jpg", alt: "Temple Construction Ritual 3" },
  ];

  return (
    <section id="construction" className="py-16 sm:py-20 bg-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-16">
          <span className="text-3xl sm:text-4xl mb-3 inline-block">🧱</span>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-cream mb-3">
            {t.construction.titlePrefix} <span className="text-gradient-gold">{t.construction.titleHighlight}</span>
          </h2>
          <div className="w-20 sm:w-24 h-0.5 bg-saffron mx-auto" />
          <p className="text-cream/80 max-w-xl mx-auto mt-4 text-sm sm:text-base leading-relaxed">
            {t.construction.subtitle}
          </p>
        </div>

        {/* Grid: 1 col on mobile, 3 cols on sm+ */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {constructionImages.map((img, idx) => (
            <div
              key={idx}
              className="relative overflow-hidden rounded-xl sm:rounded-2xl aspect-video sm:aspect-[4/3] shadow-lg group border border-saffron/20"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${img.src})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>

        <div className="mt-8 sm:mt-12 text-center">
          <a
            href="#donation"
            onClick={(e) => { e.preventDefault(); document.querySelector("#donation")?.scrollIntoView({ behavior: "smooth" }); }}
            className="inline-block px-6 sm:px-8 py-2.5 sm:py-3 border border-saffron/50 text-saffron hover:bg-saffron hover:text-charcoal font-semibold rounded-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 text-sm"
          >
            {language === "ta" ? "நன்கொடை வழங்க" : "Support Construction"}
          </a>
        </div>
      </div>
    </section>
  );
}
