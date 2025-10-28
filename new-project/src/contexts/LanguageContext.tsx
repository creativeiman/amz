'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react'

export type Language = 'en' | 'es' | 'fr' | 'de'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string, fallback?: string) => string
  translations: Record<string, Record<string, string>>
  loadTranslations: (namespace: string, translations: Record<string, string>) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')
  const [translations, setTranslations] = useState<Record<string, Record<string, string>>>({})

  useEffect(() => {
    // Load language from localStorage on mount
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language') as Language
      if (savedLanguage && ['en', 'es', 'fr', 'de'].includes(savedLanguage)) {
        setLanguageState(savedLanguage)
      }
    }
  }, [])

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang)
    }
    // Clear translations when language changes to force reload
    setTranslations({})
  }, [])

  const t = useCallback((key: string, fallback?: string): string => {
    // This function is just for compatibility, actual translation happens in useTranslation hook
    return fallback || key
  }, [])

  const loadTranslations = useCallback((namespace: string, newTranslations: Record<string, string>) => {
    setTranslations(prev => {
      // Only update if this namespace hasn't been loaded yet or translations are different
      if (prev[namespace] === newTranslations) {
        return prev
      }
      return {
        ...prev,
        [namespace]: newTranslations
      }
    })
  }, [])

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translations, loadTranslations }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

