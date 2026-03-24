
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Language } from './constants';

interface AppState {
  language: Language;
  setLanguage: (lang: Language) => void;
  user: any | null;
  setUser: (user: any | null) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(Language.ZH);
  const [user, setUser] = useState<any | null>(null);

  return (
    <AppContext.Provider value={{ language, setLanguage, user, setUser }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppStore must be used within an AppProvider');
  }
  return context;
};
