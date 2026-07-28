import { useLanguage } from "../context/LanguageContext";

export default function History() {
  const { language, t } = useLanguage();

  return (
    <section id="history" className="py-20 sm:py-28 bg-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-4xl mb-4 inline-block">📜</span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-cream mb-4">
            {t.history.titlePrefix} <span className="text-gradient-gold">{t.history.titleHighlight}</span>
          </h2>
          <div className="section-divider" />
        </div>

        {/* History Content */}
        <div className="glass-dark rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden border border-saffron/20 max-w-6xl mx-auto">
          {/* Background decorations */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-saffron/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-maroon/15 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-cream/90 text-base leading-relaxed text-justify">
              
              {/* Section 1 */}
              <div>
                <h3 className="text-2xl font-heading font-bold text-saffron mb-5 border-b border-saffron/20 pb-2 inline-block">
                  {language === "ta" ? "ஸ்ரீ விஷ்ணுமாயாதேவி அம்மன் அவதார விளக்கம்" : "The Avatar of Sri Vishnu Maya Devi Amman"}
                </h3>
                {language === "ta" ? (
                  <>
                    <p className="mb-5 pr-4 md:pr-6">
                      தேவகியின் வயிற்றில் எட்டாவது குழந்தையாக கண்ணன் அவதரித்தபோது ஆயர்பாடியில் யசோதையின் வயிற்றில் குழந்தையாக அவதரித்தவள் “மாயா”.
                    </p>
                    <p className="mb-5 pr-4 md:pr-6">
                      விஷ்ணுவும் நானே, சிவனும் நானே என்று சொல்வது போல் எங்கும் காண முடியாத அபூர்வக் காட்சியாக, சங்கு சக்கரமும், அபய ஹஸ்தமும் கொண்டு வேத சக்தி, ஞான சக்தி, கால சக்தி, யோக சக்தி, ரோக சக்தி, கவி சக்தி, கருணா சக்தி, பஞ்ச சக்தி, அருள் சக்தி என்று தன்னுள் எல்லா சக்திகளையும் அடக்கி காட்சி தரும் “அருள் மிகு ஸ்ரீ விஷ்ணுமாயாதேவி அம்மன்” சாய் கணேஷ் நகரில் உள்ள ஆலயத்தில் காட்சி தருகிறாள்.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="mb-5 pr-4 md:pr-6">
                      When Lord Krishna was born as the eighth child in Devaki's womb, "Maya" incarnated as a child in Yashoda's womb in Ayarpadi.
                    </p>
                    <p className="mb-5 pr-4 md:pr-6">
                      Signifying that "I am Vishnu and I am Shiva," She presents a rare, unparalleled divine form holding the conch, chakra, and Abhaya Hastham. She embodies all supreme powers within Herself—Veda Sakthi, Gnana Sakthi, Kala Sakthi, Yoga Sakthi, Roga Sakthi, Kavi Sakthi, Karuna Sakthi, Pancha Sakthi, and Arul Sakthi. This "Arulmigu Sri Vishnu Maya Devi Amman" graces the devotees at the temple in Sai Ganesh Nagar.
                    </p>
                  </>
                )}
              </div>

              {/* Section 2 */}
              <div>
                <h3 className="text-xl font-heading font-bold text-saffron mb-5 border-b border-saffron/20 pb-2 inline-block">
                  {language === "ta" ? "மாயாதேவி அம்மன்" : "Maya Devi Amman"}
                </h3>
                {language === "ta" ? (
                  <p className="mb-5 pr-4 md:pr-6">
                    கம்சனுக்குத் தெரியாமல் கண்ணன் யசோதையிடம் போக, தேவகியிடம் வருகிறாள் “மாயா”. மாயாதான் தேவகியின் எட்டாவது குழந்தை என்று கம்சன் நினைத்து மாயாவைக் கொல்ல மாயாவின் இரு கால்களையும் பிடித்து ஆவேசத்துடன் சுவற்றில் எறியும் போது, குழந்தையாய் இருந்த மாயா வானில் விஸ்வரூபம் எடுத்து, “கம்சா உன்னை வதம் செய்யப் பிறந்தவன் ஆயர் பாடியில் வளர்ந்து வருகிறான்”. நான் “மாயா” காளியும் நானே, மாரியும் நானே, மடியேந்தி அருள் கேட்பவர்களுக்கு தாயும் நானே எனக்கூறி மறைந்தாள். இந்த மாயாதேவி தான் சாய் கணேஷ் நகரில் அருள் பாலித்துக்கொண்டிருக்கும் “ஸ்ரீ விஷ்ணு மாயாதேவி அம்மன்”.
                  </p>
                ) : (
                  <p className="mb-5 pr-4 md:pr-6">
                    Unbeknownst to Kamsa, Krishna was taken to Yashoda, and "Maya" was brought to Devaki. Kamsa, believing Maya to be Devaki's eighth child, grabbed her by the legs to kill her by fiercely striking her against the wall. At that moment, the infant Maya assumed Her cosmic form (Viswaroopam) in the sky and proclaimed, "Kamsa, the one born to destroy you is already growing up in Ayarpadi. I am 'Maya'. I am Kali, I am Mari, and I am the Universal Mother to those who seek refuge." Saying this, she vanished. This very Maya Devi is the "Sri Vishnu Maya Devi Amman" bestowing blessings in Sai Ganesh Nagar.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
