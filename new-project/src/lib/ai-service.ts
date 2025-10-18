/**
 * AI Service for Label Analysis using Claude 4
 * 
 * This service uses Anthropic's Claude 4 with vision capabilities
 * to analyze product labels for compliance with regulatory requirements.
 */

import { anthropic } from '@ai-sdk/anthropic'
import { generateObject } from 'ai'
import { z } from 'zod'
import { prisma } from '@/db/client'

export type LabelAnalysisResult = {
  compliance: {
    score: number // 0-100
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
    passed: boolean
  }
  issues: Array<{
    category: string
    severity: 'CRITICAL' | 'WARNING' | 'MEDIUM' | 'LOW' | 'INFO'
    description: string
    recommendation: string
    regulation?: string
  }>
  summary: string
  extractedInfo: {
    productName?: string
    ingredients?: string[]
    warnings?: string[]
    certifications?: string[]
    weight?: string
    manufacturer?: string
    countryOfOrigin?: string
  }
}

// Zod schema for structured output
const analysisSchema = z.object({
  compliance: z.object({
    score: z.number().min(0).max(100).describe('Compliance score from 0-100'),
    riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).describe('Risk level assessment'),
    passed: z.boolean().describe('True if compliance score >= 99%'),
  }),
  issues: z.array(
    z.object({
      category: z.string().describe('Issue category'),
      severity: z.enum(['CRITICAL', 'WARNING', 'MEDIUM', 'LOW', 'INFO']).describe('Severity level'),
      description: z.string().describe('Detailed description of the issue'),
      recommendation: z.string().describe('How to fix the issue'),
      regulation: z.string().optional().describe('Relevant regulation or standard'),
    })
  ).describe('List of compliance issues found'),
  summary: z.string().describe('Overall compliance summary'),
  extractedInfo: z.object({
    productName: z.string().optional().describe('Product name from label'),
    ingredients: z.array(z.string()).optional().describe('List of ingredients'),
    warnings: z.array(z.string()).optional().describe('Warning labels found'),
    certifications: z.array(z.string()).optional().describe('Certifications/marks (CE, UKCA, etc.)'),
    weight: z.string().optional().describe('Net weight/quantity'),
    manufacturer: z.string().optional().describe('Manufacturer information'),
    countryOfOrigin: z.string().optional().describe('Country of origin'),
  }).describe('Information extracted from the label'),
})

/**
 * Analyze a product label image using Claude 4 with vision
 * @param imageFile - The uploaded image file (File or Buffer)
 * @param category - Product category (TOYS, BABY_PRODUCTS, COSMETICS_PERSONAL_CARE)
 * @param marketplaces - Target marketplaces (US, UK, DE)
 * @returns Analysis results
 */
export async function analyzeLabelWithAI(
  imageFile: File | Buffer,
  category: 'TOYS' | 'BABY_PRODUCTS' | 'COSMETICS_PERSONAL_CARE',
  marketplaces: string[]
): Promise<LabelAnalysisResult> {
  // Fetch settings from database
  const settings = await prisma.systemSettings.findUnique({
    where: { id: 'system_settings' },
  })
  const categoryRequirements = {
    TOYS: {
      name: 'Toys',
      regulations: [
        'ASTM F963 (US)',
        'EN 71 (EU)',
        'CPSIA compliance',
        'Age grading requirements',
        'Choking hazard warnings',
        'Small parts warnings',
        'CE marking (EU)',
      ],
    },
    BABY_PRODUCTS: {
      name: 'Baby Products',
      regulations: [
        'CPSIA compliance',
        'ASTM standards',
        'BS EN standards (UK)',
        'Phthalate-free certification',
        'BPA-free labeling',
        'Age recommendations',
        'Safety warnings',
      ],
    },
    COSMETICS_PERSONAL_CARE: {
      name: 'Cosmetics/Personal Care',
      regulations: [
        'FDA requirements (US)',
        'EU Cosmetics Regulation 1223/2009',
        'INCI ingredient listing',
        'Allergen labeling',
        'Net content declaration',
        'Batch code/expiry date',
        'Manufacturer information',
      ],
    },
  }

  const marketplaceInfo = marketplaces
    .map(mp => {
      if (mp === 'US') return 'United States (FDA, CPSC, CPSIA)'
      if (mp === 'UK') return 'United Kingdom (UK CA, BS EN standards)'
      if (mp === 'DE') return 'Germany/EU (CE marking, EN standards, EU regulations)'
      return mp
    })
    .join(', ')

  // Build rules section
  let rulesSection = ''
  
  // Add common rules
  if (settings?.commonRules) {
    rulesSection += '\n## Common Compliance Rules (All Regions)\n' + settings.commonRules + '\n'
  }
  
  // Add marketplace-specific rules
  for (const mp of marketplaces) {
    if (mp === 'US' && settings?.usRules) {
      rulesSection += '\n## United States Specific Rules\n' + settings.usRules + '\n'
    }
    if (mp === 'UK' && settings?.ukRules) {
      rulesSection += '\n## United Kingdom Specific Rules\n' + settings.ukRules + '\n'
    }
    if (mp === 'DE' && settings?.euRules) {
      rulesSection += '\n## European Union / Germany Specific Rules\n' + settings.euRules + '\n'
    }
  }

  const defaultPrompt = `You are an expert product compliance analyst specializing in label compliance and regulatory requirements.

**Your Task:**
Analyze the product label IMAGE provided and evaluate it for compliance with applicable regulations.

**Analysis Instructions:**
- Carefully examine ALL text visible on the label image
- Check for ALL required markings, symbols, and graphics (CE, UKCA, warning symbols, etc.)
- Extract ALL visible information including product details, ingredients, warnings, certifications, manufacturer info, and regulatory markings
- Verify font sizes, placement, and visibility of critical information
- Check for proper formatting and multilingual requirements

**Compliance Scoring:**
Use a weighted scoring system based on issue severity:
- **Critical failures (High priority)**: 50% weight
- **Medium failures (Med priority)**: 30% weight  
- **Low failures (Low priority)**: 20% weight

**Pass/Fail Threshold:**
- **Score ≥99% = PASS** ✅
- **Score <99% = FAIL** ❌

**Output Requirements:**
Be thorough and identify all compliance issues with specific, actionable recommendations.`

  // Build the dynamic context that will be appended
  const dynamicContext = `

---

**Product Category:** ${categoryRequirements[category].name}

**Target Marketplaces:** ${marketplaceInfo}

**Key Regulations to Check:**
${categoryRequirements[category].regulations.map(r => `- ${r}`).join('\n')}

${rulesSection}`

  // Use master prompt from settings or default, then append dynamic context
  const basePrompt = settings?.masterPrompt || defaultPrompt
  const finalPrompt = basePrompt + dynamicContext

  try {
    // Convert File or Buffer to base64 data URL
    let imageBuffer: Buffer

    if (imageFile instanceof File) {
      const arrayBuffer = await imageFile.arrayBuffer()
      imageBuffer = Buffer.from(arrayBuffer)
    } else {
      imageBuffer = imageFile
    }

    // Determine image type (assume common types)
    const imageType = 'image/jpeg' // You can enhance this to detect actual type
    const base64Data = imageBuffer.toString('base64')
    const imageDataUrl = `data:${imageType};base64,${base64Data}`

    // Use generateObject for structured output with vision
    // Using Claude Sonnet 4.5 (20250929) - Latest model with enhanced coding, agents, and long-context reasoning
    // Extended thinking is explicitly disabled for faster, more cost-effective responses
    const { object } = await generateObject({
      model: anthropic('claude-sonnet-4-5-20250929'),
      schema: analysisSchema,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: finalPrompt,
            },
            {
              type: 'image',
              image: imageDataUrl,
            },
          ],
        },
      ],
      temperature: 0.3, // Lower temperature for more consistent, factual responses
    })

    return object as LabelAnalysisResult
  } catch (error) {
    console.error('Error analyzing label with AI:', error)
    
    // Return a fallback result
    return {
      compliance: {
        score: 0,
        riskLevel: 'HIGH',
        passed: false,
      },
      issues: [
        {
          category: 'Analysis Error',
          severity: 'CRITICAL',
          description: 'Failed to analyze label. Please try again or contact support.',
          recommendation: 'Ensure the label image is clear and readable.',
        },
      ],
      summary: 'Analysis failed due to an error. Please try again.',
      extractedInfo: {},
    }
  }
}

