#!/usr/bin/env tsx

/**
 * AI Label Analysis Test Script
 * 
 * This script tests the AI label analysis service with a local image
 * 
 * Usage:
 *   pnpm test:ai <path-to-image> [category] [marketplaces]
 * 
 * Examples:
 *   pnpm test:ai ./test-images/baby-bottle.jpg
 *   pnpm test:ai ./test-images/toy.jpg TOYS US,UK
 *   pnpm test:ai ./test-images/cosmetic.jpg COSMETICS DE
 */

// Load environment variables
import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(__dirname, '../.env.local') })

import { analyzeLabelWithAI } from '../src/lib/ai-service'
import { readFileSync, existsSync } from 'fs'
import { Category, Marketplace } from '@prisma/client'

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
}

function log(color: keyof typeof colors, message: string) {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

async function testAIAnalysis() {
  const args = process.argv.slice(2)
  
  // Default to the sample cosmetic face mask image
  const defaultImagePath = './test-images/cosmetic-face-mask.png'
  
  if (args.length === 0) {
    log('yellow', '\n⚠️  No image provided, using default sample image')
    log('cyan', '\nUsage:')
    console.log('  pnpm tsx scripts/test-ai-analysis.ts <image-path> [category] [marketplaces]')
    log('cyan', '\nExamples:')
    console.log('  pnpm tsx scripts/test-ai-analysis.ts')
    console.log('  pnpm tsx scripts/test-ai-analysis.ts ./test-images/cosmetic-face-mask.png')
    console.log('  pnpm tsx scripts/test-ai-analysis.ts ./test-images/toy.jpg TOYS US,UK')
    console.log('  pnpm tsx scripts/test-ai-analysis.ts ./test-images/cosmetic.jpg COSMETICS DE')
    log('cyan', '\nAvailable Categories:')
    console.log('  TOYS, BABY_PRODUCTS, COSMETICS_PERSONAL_CARE')
    log('cyan', '\nAvailable Marketplaces:')
    console.log('  US, UK, DE')
    console.log('')
  }

  const imagePath = args[0] || defaultImagePath
  const category = (args[1] || 'COSMETICS_PERSONAL_CARE') as Category
  const marketplacesStr = args[2] || 'US,DE'
  const marketplaces = marketplacesStr.split(',').map(m => m.trim() as Marketplace)

  // Validate image exists
  if (!existsSync(imagePath)) {
    log('red', `\n❌ Error: Image not found at: ${imagePath}`)
    process.exit(1)
  }

  // Validate category
  const validCategories = ['TOYS', 'BABY_PRODUCTS', 'COSMETICS_PERSONAL_CARE']
  if (!validCategories.includes(category)) {
    log('red', `\n❌ Error: Invalid category: ${category}`)
    log('cyan', 'Available categories: ' + validCategories.join(', '))
    process.exit(1)
  }

  // Validate marketplaces
  const validMarketplaces = ['US', 'UK', 'DE']
  for (const mp of marketplaces) {
    if (!validMarketplaces.includes(mp)) {
      log('red', `\n❌ Error: Invalid marketplace: ${mp}`)
      log('cyan', 'Available marketplaces: ' + validMarketplaces.join(', '))
      process.exit(1)
    }
  }

  log('bright', '\n' + '='.repeat(60))
  log('bright', '🧪 AI LABEL ANALYSIS TEST')
  log('bright', '='.repeat(60))

  console.log('\n📋 Test Configuration:')
  console.log(`   Image: ${imagePath}`)
  console.log(`   Category: ${category}`)
  console.log(`   Marketplaces: ${marketplaces.join(', ')}`)
  console.log(`   Product: Test Product`)

  try {
    // Read image file
    log('blue', '\n📂 Reading image file...')
    const imageBuffer = readFileSync(imagePath)
    const mimeType = imagePath.endsWith('.png') ? 'image/png' : 'image/jpeg'
    const blob = new Blob([imageBuffer], { type: mimeType })
    const file = new File([blob], imagePath.split('/').pop() || 'label.jpg', { type: mimeType })
    log('green', '✓ Image loaded successfully')

    // Call AI service
    log('blue', '\n🤖 Sending to Claude for analysis...')
    log('yellow', '⏳ This may take 10-30 seconds...')
    
    const startTime = Date.now()
    const result = await analyzeLabelWithAI(file, category, marketplaces)
    const duration = ((Date.now() - startTime) / 1000).toFixed(2)

    log('green', `✓ Analysis completed in ${duration}s`)

    // Display results
    log('bright', '\n' + '='.repeat(60))
    log('bright', '📊 ANALYSIS RESULTS')
    log('bright', '='.repeat(60))

    console.log(`\n📈 Compliance Score: ${result.compliance.score}%`)
    console.log(`   Status: ${result.compliance.passed ? '✅ PASS' : '❌ FAIL'}`)
    console.log(`   Risk Level: ${result.compliance.riskLevel}`)
    console.log(`   Issues Found: ${result.issues.length}`)

    // Extracted information
    if (result.extractedInfo) {
      log('cyan', '\n📝 Extracted Information:')
      console.log(`   Product Name: ${result.extractedInfo.productName || 'N/A'}`)
      console.log(`   Brand: ${result.extractedInfo.brand || 'N/A'}`)
      console.log(`   Manufacturer: ${result.extractedInfo.manufacturer || 'N/A'}`)
      console.log(`   Country of Origin: ${result.extractedInfo.countryOfOrigin || 'N/A'}`)
      
      if (result.extractedInfo.ingredients && result.extractedInfo.ingredients.length > 0) {
        console.log(`   Ingredients: ${result.extractedInfo.ingredients.join(', ')}`)
      }
      
      if (result.extractedInfo.warnings && result.extractedInfo.warnings.length > 0) {
        console.log(`   Warnings: ${result.extractedInfo.warnings.join(', ')}`)
      }
      
      if (result.extractedInfo.certifications && result.extractedInfo.certifications.length > 0) {
        console.log(`   Certifications: ${result.extractedInfo.certifications.join(', ')}`)
      }
      
      if (result.extractedInfo.batchNumber) {
        console.log(`   Batch Number: ${result.extractedInfo.batchNumber}`)
      }
      
      if (result.extractedInfo.expirationDate) {
        console.log(`   Expiration Date: ${result.extractedInfo.expirationDate}`)
      }
    }

    // Issues
    if (result.issues && result.issues.length > 0) {
      log('yellow', `\n⚠️  Compliance Issues (${result.issues.length}):`)
      
      result.issues.forEach((issue, idx) => {
        const icon = issue.severity === 'CRITICAL' ? '🔴' : issue.severity === 'WARNING' ? '🟡' : '🔵'
        console.log(`\n   ${icon} Issue ${idx + 1}: ${issue.title}`)
        console.log(`      Severity: ${issue.severity}`)
        console.log(`      Description: ${issue.description}`)
        console.log(`      Regulation: ${issue.regulation}`)
        console.log(`      Recommendation: ${issue.recommendation}`)
      })
    } else {
      log('green', '\n✅ No compliance issues found!')
    }

    // Raw JSON output
    log('cyan', '\n📄 Raw JSON Output:')
    console.log(JSON.stringify(result, null, 2))

    log('bright', '\n' + '='.repeat(60))
    log('green', '✅ Test completed successfully!')
    log('bright', '='.repeat(60) + '\n')

  } catch (error) {
    log('red', '\n❌ Test failed with error:')
    console.error(error)
    process.exit(1)
  }
}

// Run the test
testAIAnalysis()

