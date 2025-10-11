import { ImageAnnotatorClient } from '@google-cloud/vision'
import { readFileSync } from 'fs'
import { join } from 'path'
import { ComplianceEngine } from './compliance-engine'
import { SimpleOCRService } from './simple-ocr-service'

// Google Cloud Vision API configuration from environment variables
const GOOGLE_CLOUD_PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID
const GOOGLE_CLOUD_PRIVATE_KEY_ID = process.env.GOOGLE_CLOUD_PRIVATE_KEY_ID
const GOOGLE_CLOUD_PRIVATE_KEY = process.env.GOOGLE_CLOUD_PRIVATE_KEY
const GOOGLE_CLOUD_CLIENT_EMAIL = process.env.GOOGLE_CLOUD_CLIENT_EMAIL
const GOOGLE_CLOUD_CLIENT_ID = process.env.GOOGLE_CLOUD_CLIENT_ID
const GOOGLE_CLOUD_AUTH_URI = process.env.GOOGLE_CLOUD_AUTH_URI
const GOOGLE_CLOUD_TOKEN_URI = process.env.GOOGLE_CLOUD_TOKEN_URI
const GOOGLE_CLOUD_AUTH_PROVIDER_X509_CERT_URL = process.env.GOOGLE_CLOUD_AUTH_PROVIDER_X509_CERT_URL
const GOOGLE_CLOUD_CLIENT_X509_CERT_URL = process.env.GOOGLE_CLOUD_CLIENT_X509_CERT_URL
const GOOGLE_CLOUD_UNIVERSE_DOMAIN = process.env.GOOGLE_CLOUD_UNIVERSE_DOMAIN

// Initialize Google Cloud Vision client with error handling
let client: ImageAnnotatorClient | null = null

function initializeClient() {
  if (client) return client
  
  try {
    // Check if all required environment variables are present
    if (!GOOGLE_CLOUD_PROJECT_ID || !GOOGLE_CLOUD_PRIVATE_KEY || !GOOGLE_CLOUD_CLIENT_EMAIL) {
      throw new Error('Missing required Google Cloud Vision environment variables')
    }

    // Alternative: Try using the JSON credentials directly
    const jsonCredentials = {
      type: "service_account",
      project_id: GOOGLE_CLOUD_PROJECT_ID,
      private_key_id: GOOGLE_CLOUD_PRIVATE_KEY_ID,
      private_key: GOOGLE_CLOUD_PRIVATE_KEY,
      client_email: GOOGLE_CLOUD_CLIENT_EMAIL,
      client_id: GOOGLE_CLOUD_CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${encodeURIComponent(GOOGLE_CLOUD_CLIENT_EMAIL)}`,
      universe_domain: "googleapis.com"
    }

    // Fix private key format - handle multiple line break formats
    let privateKey = GOOGLE_CLOUD_PRIVATE_KEY
    
    // Remove environment variable name and quotes if present
    if (privateKey?.startsWith('GOOGLE_CLOUD_PRIVATE_KEY=')) {
      privateKey = privateKey.replace(/^GOOGLE_CLOUD_PRIVATE_KEY=/, '')
    }
    if (privateKey?.startsWith('"') && privateKey?.endsWith('"')) {
      privateKey = privateKey.slice(1, -1)
    }
    
    // Handle different line break formats
    if (privateKey?.includes('\\n')) {
      privateKey = privateKey.replace(/\\n/g, '\n')
    }
    
    // Ensure proper line breaks for the key
    if (privateKey?.includes('-----BEGIN PRIVATE KEY-----') && !privateKey?.includes('\n')) {
      // If it's all on one line, we need to format it properly
      const keyContent = privateKey
        .replace('-----BEGIN PRIVATE KEY-----', '')
        .replace('-----END PRIVATE KEY-----', '')
        .trim()
      
      // Split the key content into 64-character lines
      const formattedKey = keyContent.match(/.{1,64}/g)?.join('\n') || keyContent
      privateKey = `-----BEGIN PRIVATE KEY-----\n${formattedKey}\n-----END PRIVATE KEY-----`
    }
    
    // Validate private key format
    if (!privateKey?.includes('BEGIN PRIVATE KEY') || !privateKey?.includes('END PRIVATE KEY')) {
      throw new Error('Invalid private key format. Must include BEGIN/END PRIVATE KEY markers.')
    }

    // Log the credentials for debugging (without exposing the full key)
    console.log('Initializing Google Cloud Vision client with:', {
      project_id: GOOGLE_CLOUD_PROJECT_ID,
      client_email: GOOGLE_CLOUD_CLIENT_EMAIL,
      client_id: GOOGLE_CLOUD_CLIENT_ID,
      private_key_id: GOOGLE_CLOUD_PRIVATE_KEY_ID,
      private_key_length: privateKey?.length,
      private_key_starts_with: privateKey?.substring(0, 30),
      private_key_ends_with: privateKey?.substring(privateKey.length - 30)
    })

    // Update the credentials with the fixed private key
    jsonCredentials.private_key = privateKey

    client = new ImageAnnotatorClient({
      credentials: jsonCredentials
    })
    
    return client
  } catch (error) {
    console.error('Failed to initialize Google Cloud Vision client:', error)
    throw error
  }
}

export interface OCRResult {
  text: string
  confidence: number
  words: Array<{
    text: string
    confidence: number
    boundingBox: {
      x: number
      y: number
      width: number
      height: number
    }
  }>
  lines: Array<{
    text: string
    confidence: number
    boundingBox: {
      x: number
      y: number
      width: number
      height: number
    }
  }>
}

export interface ComplianceAnalysis {
  productName: string
  ingredients: string[]
  warnings: string[]
  certifications: string[]
  batchNumber: string | null
  weight: string | null
  manufacturer: string | null
  complianceScore: number
  issues: Array<{
    type: 'missing' | 'warning' | 'critical'
    message: string
    requirement: string
    suggestion: string
  }>
  recommendations: string[]
}

export class OCRService {
  /**
   * Extract text from uploaded label image using Google Cloud Vision
   */
  static async extractTextFromImage(imageBuffer: Buffer): Promise<OCRResult> {
    try {
      console.log('Using Simple OCR for text extraction...')
      const simpleResult = await SimpleOCRService.extractTextFromImage(imageBuffer)
      
      // Simple OCR result is already in the correct format
      return simpleResult
    } catch (error) {
      console.error('Simple OCR failed, trying Google Cloud Vision as fallback:', error)
      
      try {
        // Fallback to Google Cloud Vision
        const visionClient = initializeClient()
        
        const [result] = await visionClient.textDetection({
          image: {
            content: imageBuffer
          }
        })

        const detections = result.textAnnotations || []
        const fullText = detections[0]?.description || ''
        const confidence = detections[0]?.score || 0

        // Extract individual words and lines
        const words: OCRResult['words'] = []
        const lines: OCRResult['lines'] = []

        if (detections.length > 1) {
          for (let i = 1; i < detections.length; i++) {
            const detection = detections[i]
            const vertices = detection.boundingPoly?.vertices || []
            
            if (vertices.length >= 4) {
              const word = {
                text: detection.description || '',
                confidence: detection.score || 0,
                boundingBox: {
                  x: vertices[0].x || 0,
                  y: vertices[0].y || 0,
                  width: (vertices[2].x || 0) - (vertices[0].x || 0),
                  height: (vertices[2].y || 0) - (vertices[0].y || 0)
                }
              }
              words.push(word)
            }
          }
        }

        // Group words into lines (simplified approach)
        const textLines = fullText.split('\n').filter(line => line.trim())
        textLines.forEach((line, index) => {
          lines.push({
            text: line.trim(),
            confidence: confidence,
            boundingBox: {
              x: 0,
              y: index * 20,
              width: line.length * 10,
              height: 20
            }
          })
        })

        return {
          text: fullText,
          confidence,
          words,
          lines
        }
      } catch (googleError) {
        console.error('Both OCR methods failed:', { tesseract: error, google: googleError })
        throw new Error(`OCR failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }
  }

  /**
   * Fallback OCR method using basic text extraction
   * This is used when Google Cloud Vision is not available
   */
  static async extractTextFromImageFallback(imageBuffer: Buffer): Promise<OCRResult> {
    try {
      // Return empty result when OCR service is unavailable
      // This allows the compliance engine to still work with basic checks
      return {
        text: "",
        confidence: 0,
        words: [],
        lines: []
      }
    } catch (error) {
      console.error('Fallback OCR failed:', error)
      throw new Error('OCR service completely unavailable')
    }
  }

  /**
   * Analyze extracted text for compliance issues
   */
  static async analyzeCompliance(
    ocrResult: OCRResult,
    category: 'toys' | 'baby' | 'cosmetics',
    marketplace: string[]
  ): Promise<ComplianceAnalysis> {
    // Use SimpleOCRService for compliance analysis
    return await SimpleOCRService.analyzeCompliance(ocrResult, category, marketplace)
  }

  // Legacy method - keeping for backward compatibility
  private static async analyzeComplianceLegacy(
    ocrResult: OCRResult,
    category: 'toys' | 'baby' | 'cosmetics',
    marketplace: string[]
  ): Promise<ComplianceAnalysis> {
    const text = ocrResult.text

    // Map category names to compliance engine format
    const categoryMap = {
      'toys': 'Toys',
      'baby': 'Baby Products', 
      'cosmetics': 'Cosmetics'
    }

    // Map marketplace to country
    const countryMap = {
      'USA': 'USA',
      'UK': 'UK',
      'Germany': 'Germany'
    }

    // Use the first marketplace for compliance check
    const primaryMarketplace = marketplace[0] || 'USA'
    const country = countryMap[primaryMarketplace as keyof typeof countryMap] || 'USA'
    const complianceCategory = categoryMap[category]

    // Handle case when OCR text is empty (fallback mode)
    if (!text || text.trim().length === 0) {
      // Even with empty text, provide compliance guidance based on category and marketplace
      const { results, score } = ComplianceEngine.performComplianceCheck(
        '', // Empty text
        complianceCategory,
        country
      )
      
      const report = ComplianceEngine.generateReport(results, score)
      
      // Convert compliance results to issues format
      const issues: ComplianceAnalysis['issues'] = []
      const recommendations: string[] = []
      
      // Only add critical issues that are actually missing (not basic requirements)
      report.issues.Critical.forEach(issue => {
        if (!issue.compliant) {
          issues.push({
            type: 'critical',
            message: `${issue.element} - Unable to verify`,
            requirement: issue.element,
            suggestion: issue.suggestion || 'Please ensure this requirement is clearly visible on your label'
          })
        }
      })
      
      report.issues.Warning.forEach(issue => {
        issues.push({
          type: 'warning',
          message: `${issue.element} - Unable to verify`,
          requirement: issue.element,
          suggestion: issue.suggestion || 'Please ensure this requirement is clearly visible on your label'
        })
      })
      
      report.issues.Recommendation.forEach(issue => {
        issues.push({
          type: 'missing',
          message: `${issue.element} - Unable to verify`,
          requirement: issue.element,
          suggestion: issue.suggestion || 'Please ensure this requirement is clearly visible on your label'
        })
      })
      
      recommendations.push(
        'Upload a high-quality image of your product label',
        'Ensure the text is clearly visible and readable',
        'Make sure all required compliance information is visible'
      )
      
      return {
        productName: 'Unknown Product',
        ingredients: [],
        warnings: [],
        certifications: [],
        batchNumber: null,
        weight: null,
        manufacturer: null,
        complianceScore: 0,
        issues,
        recommendations
      }
    }

    // Perform compliance check using the compliance engine
    const { results, score } = ComplianceEngine.performComplianceCheck(
      text,
      complianceCategory,
      country
    )

    // Generate compliance report
    const report = ComplianceEngine.generateReport(results, score)

    // Extract basic information
    const productName = this.extractProductName(ocrResult.text)
    const ingredients = this.extractIngredients(text)
    const warnings = this.extractWarnings(text)
    const certifications = this.extractCertifications(text)
    const batchNumber = this.extractBatchNumber(text)
    const weight = this.extractWeight(text)
    const manufacturer = this.extractManufacturer(text)

    // Convert compliance results to issues format
    const issues: ComplianceAnalysis['issues'] = []
    const recommendations: string[] = []

    // Add critical issues
    report.issues.Critical.forEach(issue => {
      issues.push({
        type: 'critical',
        message: `${issue.element} - Not Compliant`,
        requirement: issue.element,
        suggestion: issue.suggestion || 'Please address this critical compliance issue'
      })
    })

    // Add warning issues
    report.issues.Warning.forEach(issue => {
      issues.push({
        type: 'warning',
        message: `${issue.element} - Warning`,
        requirement: issue.element,
        suggestion: issue.suggestion || 'Consider addressing this compliance issue'
      })
    })

    // Add recommendation issues
    report.issues.Recommendation.forEach(issue => {
      issues.push({
        type: 'missing',
        message: `${issue.element} - Recommended`,
        requirement: issue.element,
        suggestion: issue.suggestion || 'Consider adding this for better compliance'
      })
    })

    // Add suggestions from compliance report
    recommendations.push(...report.suggestions)

    return {
      productName,
      ingredients,
      warnings,
      certifications,
      batchNumber,
      weight,
      manufacturer,
      complianceScore: score,
      issues,
      recommendations
    }
  }

  private static extractProductName(text: string): string {
    // Try to find product name (usually in first few lines)
    const lines = text.split('\n').slice(0, 5)
    return lines.find(line => line.trim().length > 3)?.trim() || 'Unknown Product'
  }

  private static extractIngredients(text: string): string[] {
    const ingredientKeywords = ['ingredients', 'contains', 'made with', 'formula']
    const ingredients: string[] = []
    
    for (const keyword of ingredientKeywords) {
      const index = text.indexOf(keyword)
      if (index !== -1) {
        const afterKeyword = text.substring(index + keyword.length)
        const nextSection = afterKeyword.split('\n')[0]
        const ingredientList = nextSection.split(/[,;]/).map(ing => ing.trim())
        ingredients.push(...ingredientList.filter(ing => ing.length > 2))
      }
    }
    
    return Array.from(new Set(ingredients)) // Remove duplicates
  }

  private static extractWarnings(text: string): string[] {
    const warningKeywords = [
      'warning', 'caution', 'danger', 'keep out of reach',
      'choking hazard', 'not for children under', 'age restriction'
    ]
    
    return warningKeywords.filter(keyword => text.includes(keyword))
  }

  private static extractCertifications(text: string): string[] {
    const certKeywords = [
      'ce mark', 'ukca', 'fda approved', 'cpsc', 'astm', 'iso',
      'certified', 'tested', 'approved'
    ]
    
    return certKeywords.filter(keyword => text.includes(keyword))
  }

  private static extractBatchNumber(text: string): string | null {
    const batchPatterns = [
      /batch[:\s]*([a-zA-Z0-9]+)/i,
      /lot[:\s]*([a-zA-Z0-9]+)/i,
      /batch\s*#\s*([a-zA-Z0-9]+)/i
    ]
    
    for (const pattern of batchPatterns) {
      const match = text.match(pattern)
      if (match) return match[1]
    }
    
    return null
  }

  private static extractWeight(text: string): string | null {
    const weightPatterns = [
      /(\d+(?:\.\d+)?)\s*(?:g|grams?|kg|kilograms?|oz|ounces?|lb|lbs?)/i,
      /net\s*weight[:\s]*(\d+(?:\.\d+)?\s*(?:g|grams?|kg|kilograms?|oz|ounces?|lb|lbs?))/i
    ]
    
    for (const pattern of weightPatterns) {
      const match = text.match(pattern)
      if (match) return match[1]
    }
    
    return null
  }

  private static extractManufacturer(text: string): string | null {
    const manufacturerKeywords = [
      'manufactured by', 'made by', 'produced by', 'distributed by',
      'company', 'inc', 'ltd', 'llc', 'corp'
    ]
    
    for (const keyword of manufacturerKeywords) {
      const index = text.indexOf(keyword)
      if (index !== -1) {
        const afterKeyword = text.substring(index + keyword.length)
        const manufacturer = afterKeyword.split('\n')[0].trim()
        if (manufacturer.length > 2) return manufacturer
      }
    }
    
    return null
  }

  private static checkToyCompliance(
    text: string,
    marketplace: string[],
    issues: ComplianceAnalysis['issues'],
    recommendations: string[]
  ): void {
    // Check for choking hazard warning (required for toys)
    if (!text.includes('choking hazard') && !text.includes('small parts')) {
      issues.push({
        type: 'critical',
        message: 'Missing choking hazard warning',
        requirement: 'Required per 16 CFR 1500.19 for toys with small parts',
        suggestion: 'Add "WARNING: CHOKING HAZARD—Small parts. Not for children under 3 yrs"'
      })
    }

    // Check for age recommendation
    if (!text.includes('age') && !text.includes('years') && !text.includes('months')) {
      issues.push({
        type: 'warning',
        message: 'Missing age recommendation',
        requirement: 'Recommended for toy safety',
        suggestion: 'Add age recommendation (e.g., "Ages 3+")'
      })
    }

    // Check for CE mark (EU/UK)
    if (marketplace.includes('UK') || marketplace.includes('Germany')) {
      if (!text.includes('ce mark') && !text.includes('ce')) {
        issues.push({
          type: 'critical',
          message: 'Missing CE mark',
          requirement: 'Required for EU/UK market',
          suggestion: 'Add CE mark to indicate compliance with EU directives'
        })
      }
    }
  }

  private static checkBabyCompliance(
    text: string,
    marketplace: string[],
    issues: ComplianceAnalysis['issues'],
    recommendations: string[]
  ): void {
    // Check for age restriction
    if (!text.includes('age') && !text.includes('months') && !text.includes('years')) {
      issues.push({
        type: 'critical',
        message: 'Missing age restriction',
        requirement: 'Required for baby products',
        suggestion: 'Add age restriction (e.g., "0-12 months")'
      })
    }

    // Check for safety warnings
    if (!text.includes('warning') && !text.includes('caution')) {
      issues.push({
        type: 'warning',
        message: 'Missing safety warnings',
        requirement: 'Recommended for baby products',
        suggestion: 'Add safety warnings and usage instructions'
      })
    }
  }

  private static checkCosmeticsCompliance(
    text: string,
    marketplace: string[],
    issues: ComplianceAnalysis['issues'],
    recommendations: string[]
  ): void {
    // Check for ingredients list
    if (!text.includes('ingredients') && !text.includes('contains')) {
      issues.push({
        type: 'critical',
        message: 'Missing ingredients list',
        requirement: 'Required for cosmetics',
        suggestion: 'Add complete ingredients list'
      })
    }

    // Check for net weight
    if (!text.includes('net weight') && !text.includes('net wt')) {
      issues.push({
        type: 'warning',
        message: 'Missing net weight',
        requirement: 'Required for cosmetics',
        suggestion: 'Add net weight declaration'
      })
    }

    // Check for responsible person (EU)
    if (marketplace.includes('UK') || marketplace.includes('Germany')) {
      if (!text.includes('responsible person') && !text.includes('importer')) {
        issues.push({
          type: 'critical',
          message: 'Missing responsible person',
          requirement: 'Required for EU cosmetics',
          suggestion: 'Add responsible person information'
        })
      }
    }
  }
}
