// Separated from LanguageContext.jsx so that fast-refresh works correctly.
// Components should import useLanguage from this file, not LanguageContext.jsx.
import { useContext } from 'react';
import { LanguageContext } from './LanguageContext';

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
