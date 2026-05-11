export const languages = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'es', name: 'Español' },
  { code: 'it', name: 'Italiano' },
  { code: 'ru', name: 'Русский' },
] as const;

export type LanguageCode = (typeof languages)[number]['code'];

export const languageCodes = languages.map((language) => language.code);
