import { useEvents } from "../hooks/useTemple";
import { useLanguage } from "../context/LanguageContext";

export default function Events() {
  const { data: events = [], isLoading } = useEvents();
  const { language, t } = useLanguage();

  if (isLoading || events.length === 0) return null;

  const typeIcons = {
    festival: "🎊",
    weekly: "🌺",
    monthly: "🌕"
  };

  return (
    <section id="events" className="py-20 bg-charcoal relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-cream mb-4">
            {t.events.titlePrefix} <span className="text-gradient-gold">{t.events.titleHighlight}</span>
          </h2>
          <div className="w-24 h-0.5 bg-saffron mx-auto" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div 
              key={event.id}
              className="bg-cream rounded-2xl p-6 group hover:-translate-y-2 transition-transform duration-300 flex flex-col h-full shadow-lg shadow-black/20"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-3xl" role="img" aria-label="event icon">
                  {typeIcons[event.type] || "✨"}
                </span>
                <span className="px-3 py-1 bg-saffron/20 text-maroon text-xs font-bold rounded-full">
                  {event.date?.[language]}
                </span>
              </div>
              
              <h3 className="font-heading text-xl font-bold text-charcoal mb-3 group-hover:text-maroon transition-colors">
                {event.title?.[language]}
              </h3>
              
              <p className="text-charcoal/70 text-sm leading-relaxed mb-6 flex-grow">
                {event.description?.[language]}
              </p>
              
              <button className="text-saffron-dark font-medium text-sm flex items-center gap-2 group-hover:gap-3 transition-all mt-auto border-t border-charcoal/10 pt-4">
                {t.events.enquireBtn}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
