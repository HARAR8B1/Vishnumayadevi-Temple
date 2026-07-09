import { useLanguage } from "../context/LanguageContext";

export default function History() {
  const { language, t } = useLanguage();

  return (
    <section id="history" className="py-16 sm:py-20 bg-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-3xl sm:text-4xl mb-3 inline-block">📜</span>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-cream mb-4">
            {t.history.titlePrefix} <span className="text-gradient-gold">{t.history.titleHighlight}</span>
          </h2>
          <div className="section-divider" />
        </div>

        {/* History Content */}
        <div className="glass-dark rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden border border-saffron/10 max-w-4xl mx-auto">
          {/* Background decorations */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-saffron/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-maroon/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10 space-y-8 text-cream/90 text-sm sm:text-base leading-relaxed text-justify">
            
            {/* Section 1 */}
            <div>
              <h3 className="text-xl sm:text-2xl font-heading font-bold text-saffron mb-4 text-center sm:text-left">
                {language === "ta" ? "ஸ்ரீ விஷ்ணுமாயாதேவி அம்மன் அவதார விளக்கம்" : "The Avatar of Sri Vishnu Maya Devi Amman"}
              </h3>
              {language === "ta" ? (
                <>
                  <p className="mb-4">
                    தேவகியின் வயிற்றில் எட்டாவது குழந்தையாக கண்ணன் அவதரித்தபோது ஆயர்பாடியில் யசோதையின் வயிற்றில் குழந்தையாக அவதரித்தவள் “மாயா”.
                  </p>
                  <p className="mb-4">
                    விஷ்ணுவும் நானே, சிவனும் நானே என்று சொல்வது போல் எங்கும் காண முடியாத அபூர்வக் காட்சியாக, சங்கு சக்கரமும், அபய ஹஸ்தமும் கொண்டு வேத சக்தி, ஞான சக்தி, கால சக்தி, யோக சக்தி, ரோக சக்தி, கவி சக்தி, கருணா சக்தி, பஞ்ச சக்தி, அருள் சக்தி என்று தன்னுள் எல்லா சக்திகளையும் அடக்கி காட்சி தரும் “அருள் மிகு ஸ்ரீ விஷ்ணுமாயாதேவி அம்மன்” சாய் கணேஷ் நகரில் உள்ள ஆலயத்தில் காட்சி தருகிறாள்.
                  </p>
                </>
              ) : (
                <>
                  <p className="mb-4">
                    When Lord Krishna was born as the eighth child in Devaki's womb, "Maya" incarnated as a child in Yashoda's womb in Ayarpadi.
                  </p>
                  <p className="mb-4">
                    Signifying that "I am Vishnu and I am Shiva," She presents a rare, unparalleled divine form holding the conch, chakra, and Abhaya Hastham. She embodies all supreme powers within Herself—Veda Sakthi, Gnana Sakthi, Kala Sakthi, Yoga Sakthi, Roga Sakthi, Kavi Sakthi, Karuna Sakthi, Pancha Sakthi, and Arul Sakthi. This "Arulmigu Sri Vishnu Maya Devi Amman" graces the devotees at the temple in Sai Ganesh Nagar.
                  </p>
                </>
              )}
            </div>

            {/* Section 2 */}
            <div>
              <h3 className="text-lg sm:text-xl font-heading font-bold text-saffron mb-3">
                {language === "ta" ? "மாயாதேவி அம்மன்" : "Maya Devi Amman"}
              </h3>
              {language === "ta" ? (
                <p className="mb-4">
                  கம்சனுக்குத் தெரியாமல் கண்ணன் யசோதையிடம் போக, தேவகியிடம் வருகிறாள் “மாயா”. மாயாதான் தேவகியின் எட்டாவது குழந்தை என்று கம்சன் நினைத்து மாயாவைக் கொல்ல மாயாவின் இரு கால்களையும் பிடித்து ஆவேசத்துடன் சுவற்றில் எறியும் போது, குழந்தையாய் இருந்த மாயா வானில் விஸ்வரூபம் எடுத்து, “கம்சா உன்னை வதம் செய்யப் பிறந்தவன் ஆயர் பாடியில் வளர்ந்து வருகிறான்”. நான் “மாயா” காளியும் நானே, மாரியும் நானே, மடியேந்தி அருள் கேட்பவர்களுக்கு தாயும் நானே எனக்கூறி மறைந்தாள். இந்த மாயாதேவி தான் சாய் கணேஷ் நகரில் அருள் பாலித்துக்கொண்டிருக்கும் “ஸ்ரீ விஷ்ணு மாயாதேவி அம்மன்”.
                </p>
              ) : (
                <p className="mb-4">
                  Unbeknownst to Kamsa, Krishna was taken to Yashoda, and "Maya" was brought to Devaki. Kamsa, believing Maya to be Devaki's eighth child, grabbed her by the legs to kill her by fiercely striking her against the wall. At that moment, the infant Maya assumed Her cosmic form (Viswaroopam) in the sky and proclaimed, "Kamsa, the one born to destroy you is already growing up in Ayarpadi. I am 'Maya'. I am Kali, I am Mari, and I am the Universal Mother to those who seek refuge." Saying this, she vanished. This very Maya Devi is the "Sri Vishnu Maya Devi Amman" bestowing blessings in Sai Ganesh Nagar.
                </p>
              )}
            </div>

            {/* Section 3 */}
            <div>
              <h3 className="text-lg sm:text-xl font-heading font-bold text-saffron mb-3">
                {language === "ta" ? "மற்றொரு வரலாறு" : "Another Historical Lore"}
              </h3>
              {language === "ta" ? (
                <>
                  <p className="mb-4">
                    ஜமதக்னி முனிவரின் மனைவி ரேணுகாதேவி. இவர்களின் நான்கு புதல்வர்களுள் ஒருவர்தான் பரசுராமர். ஒருமுறை வானில் பறந்து கொண்டிருந்த தேவர் ஒருவரின் நிழலைப் பார்த்து ரேணுகாதேவி வியந்தாள். இதனை அறிந்து, கோபமுற்ற ஜமதக்னி முனிவர் தன் நான்கு புதல்வர்களையும் அழைத்து தாயின் சிரசைத் துண்டிக்கச் சொன்னார். மூன்று புதல்வர்கள் வாளாதிருக்கையில் பரசுராமர் மட்டும் “தந்தை சொல் மிக்க மந்திரம் இல்லை” என்ற நியதிக்கேற்ப தன் தாயின் சிரசைத் துண்டித்தார். இதனைத் தடுக்க வந்த பனிப்பெண்ணையும் வெட்டி வீழ்த்தினார்.
                  </p>
                  <p className="mb-4">
                    இதனைக் கண்டு பூரித்த ஜமதக்னி முனிவர் பரசுராமரிடம் என்ன வரம் வேண்டும் கேள் என்று கேட்டார். அதற்கு பரசுராமர் தாயையும், பனிப்பெண்ணையும் உயிருடன் மீட்டுத் தரும்படி கேட்டார். ஜமதக்னி முனிவர் பரசுராமரிடம் தலை துண்டிக்கப்பட்ட இருவரையும் மீண்டும் இணைக்கும்படி கூறினார். பதற்றத்தில் பரசுராமர் தாயின் தலையையும் பனிப்பெண்ணின் உடலையும் ஒன்றாக இணைத்தார். அதுபோல் பனிப்பெண்ணின் தலையையும் தாயின் உடலையும் ஒன்றாக இணைத்தார். அதே நிலையில் இருவரும் உயிர்பெற்று எழுந்தார்கள்.
                  </p>
                  <p className="mb-4">
                    ரேணுகாதேவியின் தலையும், பனிப்பெண்ணின் உடலும் கொண்ட தெய்வாம்சம் பொருந்திய உருவமே தேவி பவானி அம்மன். பனிப்பெண்ணின் தலையும் ரேணுகா தேவியின் உடலும் கொண்டு மாறிய அங்கமே “மாற்றாங்கி” எனப்படும் மாதங்கியானாள்.
                  </p>
                  <p className="mb-4">
                    இந்த மாயாதேவி தான் பெரியபாளையத்தில் பவானி அம்மனாக அமர்ந்து பக்தர்களுக்கு அருள் பாலித்துக்கொண்டு இருக்கிறாள்.
                  </p>
                </>
              ) : (
                <>
                  <p className="mb-4">
                    Renuka Devi was the wife of Sage Jamadagni. Parashurama was one of their four sons. Once, observing the reflection of a celestial being flying in the sky, Renuka Devi was momentarily mesmerized. Realizing this, an enraged Sage Jamadagni commanded his four sons to behead their mother. While the other three sons stood paralyzed, Parashurama alone severed his mother's head, abiding by the dharma that "there is no mantra greater than a father's word." He also struck down a woman of a lower caste who tried to intervene.
                  </p>
                  <p className="mb-4">
                    Pleased with his obedience, Sage Jamadagni granted Parashurama a boon. Parashurama asked for his mother and the other woman to be brought back to life. The sage instructed him to attach their heads back to their bodies. In his haste and anxiety, Parashurama accidentally attached his mother's head to the other woman's body, and the other woman's head to his mother's body. Both women miraculously came back to life in this altered state.
                  </p>
                  <p className="mb-4">
                    The divine form with Renuka Devi's head and the other woman's body became Devi Bhavani Amman. The form with the other woman's head and Renuka Devi's body became Mathangi, also known as "Matrangi".
                  </p>
                  <p className="mb-4">
                    It is this very Maya Devi who resides in Periyapalayam as Bhavani Amman, showering her grace upon devotees.
                  </p>
                </>
              )}
            </div>

            {/* Conclusion */}
            <div className="bg-white/5 border border-white/10 p-5 rounded-xl text-center sm:text-left mt-8">
              {language === "ta" ? (
                <>
                  <p className="text-xs text-saffron/70 italic mb-4">நன்றி: குமுதம் தமிழ் வார இதழ் 01-10-2008 குறை தீர்க்கும் கோயில்கள் (ப்ரியா கல்யாணராமன்)</p>
                  <p className="font-bold text-cream">
                    பெரிய பாளையம் பவானி அம்மனும், சாய்கணேஷ் நகரில் எழுந்தருளி அருள் பாலித்துக் கொண்டிருக்கும் அருள்மிகு ஸ்ரீ விஷ்ணு மாயாதேவி அம்மனும் ஒன்றே என மேற்கண்ட விளக்கம் மூலம் தெரியவருகிறது.
                  </p>
                  <p className="font-bold text-saffron mt-3">
                    எல்லா சக்திகளையும் தன்னுள் அடக்கி காட்சி தரும் அருள்மிகு ஸ்ரீ விஷ்ணு மாயாதேவி அம்மனின் கருணைப் பார்வையால் அருள்பாலித்து நம் குறைகள் அனைத்தையும் களைந்து எல்லா நலன்களும் பெற்று நலமுடன் வாழ்வோம் என்பது நிச்சயம்.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-xs text-saffron/70 italic mb-4">Source: Kumudam Tamil Weekly Magazine, 01-10-2008, "Temples that solve grievances" (Priya Kalyanaraman)</p>
                  <p className="font-bold text-cream">
                    From the historical accounts above, it is profoundly clear that Periyapalayam Bhavani Amman and Arulmigu Sri Vishnu Maya Devi Amman, who has manifested in Sai Ganesh Nagar, are one and the same divine mother.
                  </p>
                  <p className="font-bold text-saffron mt-3">
                    By the compassionate gaze of Arulmigu Sri Vishnu Maya Devi Amman, who embodies all cosmic powers within Herself, all our sorrows will be eradicated, and we will undoubtedly receive every blessing for a prosperous and joyful life.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
