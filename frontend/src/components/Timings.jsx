import { useTempleInfo } from "../hooks/useTemple";
import { useLanguage } from "../context/LanguageContext";

export default function Timings() {
  const { data: temple, isLoading } = useTempleInfo();
  const { language, t } = useLanguage();

  if (isLoading || !temple?.timings) return null;

  return (
    <section id="timings" className="py-16 sm:py-20 bg-cream relative overflow-hidden">
      <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-saffron/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-56 h-56 sm:w-80 sm:h-80 bg-maroon/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10">
          <span className="text-saffron text-3xl sm:text-4xl mb-4 inline-block">🕭</span>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-charcoal mb-3">
            {t.timings.titlePrefix} <span className="text-gradient-gold">{t.timings.titleHighlight}</span>
          </h2>
          <p className="text-charcoal/70 text-sm sm:text-base max-w-xl mx-auto">
            {t.timings.subtitle}
          </p>
        </div>

        <div className="glass rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-white/50">
          {/* Header */}
          <div className="bg-gradient-to-r from-maroon to-charcoal p-4 sm:p-6 text-center">
            <h3 className="font-heading text-lg sm:text-2xl font-bold text-saffron tracking-wider">
              {t.timings.scheduleHeader}
            </h3>
          </div>

          {/* Table */}
          <div className="p-3 sm:p-6">
            {/* Column Headers */}
            <div className="grid grid-cols-3 text-[10px] sm:text-xs font-bold text-maroon/60 uppercase tracking-wider mb-3 pb-2 border-b border-saffron/20 px-1 sm:px-3">
              <div>{t.timings.colDay}</div>
              <div className="text-center">{t.timings.colMorning}</div>
              <div className="text-right">{t.timings.colEvening}</div>
            </div>

            {/* Rows */}
            <div className="space-y-1">
              {temple.timings.map((timing, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-3 items-center py-2.5 sm:py-3 px-1 sm:px-3 rounded-xl hover:bg-white/60 transition-colors duration-200"
                >
                  <div className="font-heading font-bold text-charcoal text-xs sm:text-sm">
                    {timing.day?.[language]}
                  </div>
                  <div className="text-center text-charcoal/80 text-[11px] sm:text-sm leading-tight">
                    {timing.morning?.[language]}
                  </div>
                  <div className="text-right text-charcoal/80 text-[11px] sm:text-sm leading-tight">
                    {timing.evening?.[language]}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-saffron/20 text-center">
              <p className="text-[11px] sm:text-sm text-charcoal/60 flex items-start sm:items-center justify-center gap-2">
                <span className="text-saffron shrink-0">✨</span>
                <span>{t.timings.footerNote}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
