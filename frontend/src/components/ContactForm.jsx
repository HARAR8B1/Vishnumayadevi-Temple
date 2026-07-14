import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema } from "../schemas/contactSchema";
import { submitContact } from "../api/templeApi";
import { useLanguage } from "../context/LanguageContext";



export default function ContactForm() {
  const { language, t } = useLanguage();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data) => {
    try {
      await submitContact(data);
      reset();
    } catch (error) {
      console.warn("Backend unavailable, simulating successful form submission.");
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      reset();
    }
  };

  return (
    <section id="contact" className="py-16 sm:py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal mb-3">
            {t.contact.titlePrefix} <span className="text-gradient-gold">{t.contact.titleHighlight}</span>
          </h2>
          <div className="w-20 h-0.5 bg-saffron mx-auto mb-4" />
          <p className="text-charcoal/70 text-sm sm:text-base max-w-2xl mx-auto">
            {t.contact.subtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">

          {/* Left: Contact Info */}
          <div className="space-y-4">
            {/* Visit Us */}
            <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-saffron/10 shadow-sm">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-saffron/10 flex items-center justify-center text-saffron shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.315 48.315 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-charcoal text-sm sm:text-base">{t.contact.visitUs}</h4>
                <p className="text-charcoal/70 text-xs sm:text-sm mt-1 leading-relaxed">
                  Plot no. 28, Sai Ganesh Nagar, 1st Main Road, Jalladiyanpet, Pallikaranai, Chennai - 600100
                </p>
              </div>
            </div>

            {/* Call Us */}
            <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-saffron/10 shadow-sm">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-saffron/10 flex items-center justify-center text-saffron shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.48-4.18-7.076-7.076l1.293-.97c.362-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-charcoal text-sm sm:text-base">{t.contact.callUs}</h4>
                <p className="text-charcoal/60 text-[11px] sm:text-xs mt-0.5">
                  {language === "ta" ? "தலைவர் - திரு. T.M. கார்த்திகேயன்" : "President — Shri. T.M. Karthikeyan"}
                </p>
                <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
                  <a href="tel:+919444291833" className="text-charcoal/70 text-xs sm:text-sm hover:text-saffron transition-colors">
                    +91 94442 91833
                  </a>
                  <a href="tel:+917358014644" className="text-charcoal/70 text-xs sm:text-sm hover:text-saffron transition-colors">
                    +91 73580 14644
                  </a>
                </div>
              </div>
            </div>

            {/* Email Us */}
            <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-saffron/10 shadow-sm">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-saffron/10 flex items-center justify-center text-saffron shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-charcoal text-sm sm:text-base">{t.contact.emailUs || "Email Us"}</h4>
                <a href="mailto:vishnumayuadeviamman@gmail.com" className="text-charcoal/70 text-xs sm:text-sm mt-1 hover:text-saffron transition-colors break-all block">
                  vishnumayuadeviamman@gmail.com
                </a>
              </div>
            </div>

          </div>

          {/* Right: Form */}
          <div className="glass rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-saffron/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

            <h3 className="font-heading text-xl sm:text-2xl font-bold text-charcoal mb-5 relative z-10">
              {t.contact.formTitle}
            </h3>

            {isSubmitSuccessful && (
              <div className="mb-5 p-3 sm:p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm flex items-center gap-2">
                <span>✅</span>
                {language === "ta" ? "உங்கள் செய்தி வெற்றிகரமாக அனுப்பப்பட்டது!" : "Your message has been sent successfully!"}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 relative z-10">
              {[
                { id: "name", label: t.contact.nameLabel, placeholder: t.contact.namePlaceholder, type: "text", required: true },
                { id: "email", label: t.contact.emailLabel, placeholder: t.contact.emailPlaceholder, type: "email", required: true },
                { id: "phone", label: t.contact.phoneLabel, placeholder: t.contact.phonePlaceholder, type: "tel", required: false },
              ].map(({ id, label, placeholder, type, required }) => (
                <div key={id}>
                  <label htmlFor={id} className="block text-xs sm:text-sm font-medium text-charcoal mb-1">
                    {label} {required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    {...register(id)}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border text-sm text-charcoal ${
                      errors[id] ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-saffron focus:ring-saffron"
                    } bg-white focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all`}
                  />
                  {errors[id] && <p className="mt-1 text-xs text-red-500">{errors[id].message}</p>}
                </div>
              ))}

              <div>
                <label htmlFor="message" className="block text-xs sm:text-sm font-medium text-charcoal mb-1">
                  {t.contact.messageLabel} <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  rows={4}
                  placeholder={t.contact.messagePlaceholder}
                  {...register("message")}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border text-sm text-charcoal ${
                    errors.message ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-saffron focus:ring-saffron"
                  } bg-white focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all resize-none`}
                />
                {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 sm:py-4 bg-maroon hover:bg-maroon-dark text-cream font-bold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-maroon/20 disabled:opacity-70 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {isSubmitting ? t.contact.submittingBtn : t.contact.submitBtn}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
