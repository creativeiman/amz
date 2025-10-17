// Plan configurations and limits
// This is the single source of truth for all plan-related configuration

export const PLAN_LIMITS = {
  FREE: {
    name: 'Basic',
    price: 0,
    stripePriceId: null, // No Stripe integration for free plan
    maxTeamMembers: 0, // No team members allowed
    scansPerMonth: 1, // 1 scan per account lifetime (treated as 1 per month for simplicity)
    features: [
      '1 scan per account lifetime',
      'Basic compliance report',
      'View-only results',
      'Marketplace check',
    ],
  },
  ONE_TIME: {
    name: 'One-Time Use',
    price: 59.99,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_ONE_TIME_PRICE_ID || '',
    maxTeamMembers: 0, // No team members allowed
    scansPerMonth: 1, // Single comprehensive scan
    features: [
      '1 comprehensive in-depth scan',
      'All Deluxe features for single product',
      '30-day access to results',
      'Dedicated compliance review summary',
      'No recurring charges',
      'Geo-expansion validation',
    ],
  },
  DELUXE: {
    name: 'Deluxe',
    price: 29.99,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_DELUXE_PRICE_ID || '',
    maxTeamMembers: 2, // Up to 2 team members (as per old project)
    scansPerMonth: null, // Unlimited (null = unlimited)
    features: [
      'Unlimited scans',
      'Full visual annotations with AI',
      'Unlimited PDF exports',
      'Risk profiling & insights',
      'Team collaboration (up to 2 users)',
      'Priority email support',
      'Unlimited scan history',
    ],
  },
} as const

export type PlanType = keyof typeof PLAN_LIMITS

// Helper function to get plan limits
export function getPlanLimits(plan: string) {
  const planKey = plan as PlanType
  return PLAN_LIMITS[planKey] || PLAN_LIMITS.FREE
}

// Helper function to check if team members are allowed for a plan
export function canInviteTeamMembers(plan: string): boolean {
  const limits = getPlanLimits(plan)
  return limits.maxTeamMembers > 0
}

// Helper function to check if adding a new member would exceed limits
export function canAddTeamMember(plan: string, currentMemberCount: number): boolean {
  const limits = getPlanLimits(plan)
  
  if (limits.maxTeamMembers === 0) {
    return false // No team members allowed
  }
  
  return currentMemberCount < limits.maxTeamMembers
}

// Helper function to get remaining team member slots
export function getRemainingSlots(plan: string, currentMemberCount: number): number {
  const limits = getPlanLimits(plan)
  
  if (limits.maxTeamMembers === 0) {
    return 0
  }
  
  return Math.max(0, limits.maxTeamMembers - currentMemberCount)
}

