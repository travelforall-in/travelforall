// src/context/PreferencesContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Preferences {
  country: string;
  currency: string;
  language: string;
  setPreferences: (prefs: Partial<Preferences>) => void;
}

const PreferencesContext = createContext<Preferences | undefined>(undefined);

export const PreferencesProvider = ({ children }: { children: ReactNode }) => {
  const [country, setCountry] = useState<string>('IN');
  const [currency, setCurrency] = useState<string>('INR');
  const [language, setLanguage] = useState<string>('EN');

  const setPreferences = (prefs: Partial<Preferences>) => {
    if (prefs.country) setCountry(prefs.country);
    if (prefs.currency) setCurrency(prefs.currency);
    if (prefs.language) setLanguage(prefs.language);
  };

  return (
    <PreferencesContext.Provider value={{ country, currency, language, setPreferences }}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error("usePreferences must be used within PreferencesProvider");
  return context;
};
