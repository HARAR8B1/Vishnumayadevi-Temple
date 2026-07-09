import { useState, useEffect } from "react";
import { useGallery } from "../hooks/useTemple";
import { useLanguage } from "../context/LanguageContext";

export default function Gallery() {
  const { data: images = [], isLoading } = useGallery();
  const { language, t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [images.length]);

  if (isLoading || images.length === 0) {
    return null;
  }

  const currentImage = images[currentIndex];

  return (
    <section id="gallery" className="py-20 bg-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-cream mb-4">
            {t.gallery.titlePrefix} <span className="text-gradient-gold">{t.gallery.titleHighlight}</span>
          </h2>
          <div className="w-24 h-0.5 bg-saffron mx-auto" />
        </div>

        {/* Slideshow Container */}
        <div className="relative max-w-5xl mx-auto aspect-video rounded-3xl overflow-hidden shadow-2xl ring-1 ring-saffron/20 group">
          
          {/* Main Image */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out transform group-hover:scale-105"
            style={{ backgroundImage: `url(${currentImage?.url})` }}
          />

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/20 to-transparent" />

          {/* Caption */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-saffron mb-2">
              {currentImage?.title?.[language]}
            </h3>
            <p className="text-cream/90 text-sm sm:text-base max-w-2xl">
              {currentImage?.description?.[language]}
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="absolute top-1/2 -translate-y-1/2 w-full px-4 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)}
              className="w-10 h-10 rounded-full glass flex items-center justify-center text-saffron hover:bg-saffron hover:text-charcoal transition-colors"
              aria-label="Previous image"
            >
              ←
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)}
              className="w-10 h-10 rounded-full glass flex items-center justify-center text-saffron hover:bg-saffron hover:text-charcoal transition-colors"
              aria-label="Next image"
            >
              →
            </button>
          </div>

          {/* Indicators */}
          <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 flex gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? "w-8 bg-saffron" : "bg-cream/40 hover:bg-cream/80"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
