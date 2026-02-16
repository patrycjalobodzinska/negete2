export const languages = ['pl', 'en'] as const;

export type Language = (typeof languages)[number];

export const defaultLanguage: Language = 'pl';

export const languageNames: Record<Language, string> = {
  pl: 'Polski',
  en: 'English',
};
