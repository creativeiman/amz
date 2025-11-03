/**
 * Site Configuration
 * Application-wide constants and configuration
 */

import { PLAN_LIMITS } from './plans'

export const siteConfig = {
  name: 'PlabIQ',
  description: 'AI-powered compliance validation for Amazon sellers',
  url: 'https://plabiq.com',
  ogImage: '/og-image.jpg',
  links: {
    twitter: 'https://twitter.com/plabiq',
    github: 'https://github.com/plabiq',
  },
} as const

// Re-export plans from plans.ts for backward compatibility
// DO NOT duplicate plan configuration here - use plans.ts as the single source of truth
export const plans = PLAN_LIMITS

export const categories = {
  TOYS: {
    label: 'Toys',
    description: 'Toys and games',
  },
  BABY_PRODUCTS: {
    label: 'Baby Products',
    description: 'Baby care and feeding products',
  },
  COSMETICS_PERSONAL_CARE: {
    label: 'Cosmetics & Personal Care',
    description: 'Beauty and personal care products',
  },
} as const

export const marketplaces = {
  USA: {
    label: 'United States',
    code: 'US',
    flag: '🇺🇸',
  },
  UK: {
    label: 'United Kingdom',
    code: 'UK',
    flag: '🇬🇧',
  },
  GERMANY: {
    label: 'Germany',
    code: 'DE',
    flag: '🇩🇪',
  },
} as const

export type Plan = keyof typeof plans
export type Category = keyof typeof categories
export type Marketplace = keyof typeof marketplaces

