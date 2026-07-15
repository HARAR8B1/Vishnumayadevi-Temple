import { createContext, useState, useContext, useEffect } from 'react';
import { translations } from '../translations';

// eslint-disable-next-line react-refresh/only-export-components
export const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  // Check local storage for saved language, default to 'en'
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('temple_lang');
    return saved ? saved : 'en';
  });

  useEffect(() => {
    localStorage.setItem('temple_lang', language);
    // Optionally update document lang attribute
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'ta' : 'en'));
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Keep backward-compatible export for any files that import from here
// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
