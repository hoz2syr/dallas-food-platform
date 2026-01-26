"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

export type Lang = 'ar' | 'en';

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: 'ar', setLang: () => {} });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('ar');
  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}
