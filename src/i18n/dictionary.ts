import type { Language } from './config';

const dictionaries: Record<Language, Record<string, string>> = {
  pl: {
    'home.title': 'Witaj w mojej stronie Next.js',
    'home.description': 'To jest strona startowa zintegrowana z Sanity i tłumaczeniami.',
    'nav.changeLanguage': 'Zmień język',
  },
  en: {
    'home.title': 'Welcome to my Next.js site',
    'home.description': 'This is a landing page integrated with Sanity and translations.',
    'nav.changeLanguage': 'Change language',
  },
};

export function t(lang: Language, key: string): string {
  return dictionaries[lang]?.[key] ?? key;
}
