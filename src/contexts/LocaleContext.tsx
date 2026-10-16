import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Lang, Tx } from '../types';
import { fmtNum, fmtPct } from '../utils/format';

interface LocaleValue {
  lang: Lang;
  dir: 'rtl' | 'ltr';
  isFa: boolean;
  setLang: (l: Lang) => void;
  /** Inline bilingual text: tr('فارسی', 'English') */
  tr: (fa: string, en: string) => string;
  /** Bilingual label object */
  tx: (label: Tx) => string;
  n: (value: number, digits?: number) => string;
  pct: (value: number, digits?: number) => string;
}

const LocaleContext = createContext<LocaleValue | null>(null);

export function LocaleProvider({ children }: {children: React.ReactNode;}) {
  const [lang, setLang] = useState<Lang>('fa');

  useEffect(() => {
    const dir = lang === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', lang);
    document.body.style.fontFamily =
    lang === 'fa' ?
    '"B Nazanin", BNazanin, Vazirmatn, Tahoma, sans-serif' :
    'Inter, system-ui, sans-serif';
  }, [lang]);

  const tr = useCallback((fa: string, en: string) => lang === 'fa' ? fa : en, [lang]);

  const value = useMemo<LocaleValue>(
    () => ({
      lang,
      dir: lang === 'fa' ? 'rtl' : 'ltr',
      isFa: lang === 'fa',
      setLang,
      tr,
      tx: (l: Tx) => l[lang],
      n: (v: number, digits = 0) => fmtNum(v, lang, digits),
      pct: (v: number, digits = 1) => fmtPct(v, lang, digits)
    }),
    [lang, tr]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used inside LocaleProvider');
  return ctx;
}
