'use client'

import { useEffect, useState, useCallback } from 'react'
import { useLanguage, Language } from '@/contexts/LanguageContext'

/**
 * Custom hook to load and use translations for a specific component
 * @param namespace - The translation namespace (e.g., 'admin-sidebar', 'dashboard-home')
 * @returns Translation function and loading state
 */
export function useTranslation(namespace: string) {
  const { language, translations, loadTranslations } = useLanguage()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [localTranslations, setLocalTranslations] = useState<Record<string, string>>({})

  useEffect(() => {
    let isMounted = true

    async function loadNamespaceTranslations() {
      try {
        setIsLoading(true)
        setError(null)
        
        // Check if translations are already loaded for this namespace
        if (translations[namespace]) {
          if (isMounted) {
            setLocalTranslations(translations[namespace])
            setIsLoading(false)
          }
          return
        }

        // Dynamically import the translation file
        const translationModule = await import(`@/locales/${namespace}/${language}.json`)
        const translationData = translationModule.default || translationModule
        
        if (isMounted) {
          setLocalTranslations(translationData)
          loadTranslations(namespace, translationData)
          setIsLoading(false)
        }
      } catch (err) {
        console.warn(`Failed to load translations for ${namespace}/${language}:`, err)
        if (isMounted) {
          setError(err as Error)
          setIsLoading(false)
        }
      }
    }

    loadNamespaceTranslations()

    return () => {
      isMounted = false
    }
  }, [language, namespace]) // Removed loadTranslations and translations from deps

  const t = useCallback((key: string, fallback?: string): string => {
    return localTranslations[key] || fallback || key
  }, [localTranslations])

  return {
    t,
    language,
    isLoading,
    error,
  }
}

