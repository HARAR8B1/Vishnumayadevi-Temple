import { useState, useEffect } from "react";
import { staticCommitteeMembers } from "../data/staticData";

async function fetchCommitteeWithFallback() {
  try {
    const { getCommittee } = await import("../api/templeApi");
    const data = await getCommittee();
    if (!data || data.length === 0) return staticCommitteeMembers;
    return data;
  } catch {
    return staticCommitteeMembers;
  }
}

export default function Committee() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommitteeWithFallback()
      .then((data) => setMembers(data || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading || members.length === 0) return null;

  return (
    <section id="committee" className="py-24 bg-cream relative overflow-hidden">
      {/* Background Mandala / Decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-temple-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-saffron/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-charcoal mb-4">
            Temple <span className="text-saffron">Committee</span>
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-saffron to-temple-gold mx-auto rounded-full mb-6"></div>
          <p className="text-charcoal/70 text-lg">
            Dedicated individuals serving the community and guiding the development of the Sri Vishnu Maya Devi Amman Temple.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {members.map((member, index) => (
            <div
              key={member.id}
              className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 hover:border-saffron/30 transition-all duration-300 group flex flex-col items-center text-center"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-saffron to-temple-gold rounded-full flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🙏</span>
              </div>

              <h3 className="text-xl font-bold text-charcoal mb-1 group-hover:text-saffron transition-colors">
                {member.name}
              </h3>

              <p className="text-temple-gold font-medium mb-4 uppercase tracking-wider text-sm">
                {member.post}
              </p>

              {member.mobile_number && (
                <div className="mt-auto w-full pt-4 border-t border-gray-50 flex flex-col items-center gap-2 text-charcoal/60">
                  {member.mobile_number.split(',').map((num, idx) => (
                    <a
                      key={idx}
                      href={`tel:${num.trim()}`}
                      className="flex items-center gap-2 hover:text-saffron transition-colors text-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {num.trim()}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
