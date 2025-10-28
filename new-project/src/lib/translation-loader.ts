import { Language } from '@/contexts/LanguageContext'

/**
 * Utility to load translation files
 */
export async function loadTranslations(namespace: string, language: Language): Promise<Record<string, string>> {
  try {
    const translations = await import(`@/locales/${namespace}/${language}.json`)
    return translations.default || translations
  } catch (error) {
    console.warn(`Failed to load translations for ${namespace}/${language}:`, error)
    return {}
  }
}

/**
 * Preload translations for better performance
 */
export function preloadTranslations(namespace: string, language: Language): void {
  loadTranslations(namespace, language).catch(() => {
    // Silently fail - translations will be loaded on demand
  })
}

/**
 * Get language display name
 */
export function getLanguageName(language: Language): string {
  const names: Record<Language, string> = {
    en: 'English',
    es: 'Español',
    fr: 'Français',
    de: 'Deutsch',
  }
  return names[language] || language
}

/**
 * Get language flag emoji
 */
export function getLanguageFlag(language: Language): string {
  const flags: Record<Language, string> = {
    en: '🇺🇸',
    es: '🇪🇸',
    fr: '🇫🇷',
    de: '🇩🇪',
  }
  return flags[language] || '🌐'
}

