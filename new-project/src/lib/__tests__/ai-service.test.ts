/**
 * AI Service Test
 * 
 * This test file validates the AI label analysis service
 * 
 * Prerequisites:
 * 1. Place a test label image in: /Users/waqar/Documents/GitFork/amzrepo/amz/new-project/test-images/sample-label.jpg
 * 2. Run database seed: make dev-setup
 * 3. Ensure ANTHROPIC_API_KEY is set in .env.local
 * 
 * Run: pnpm test src/lib/__tests__/ai-service.test.ts
 */

import { analyzeLabel } from '../ai-service'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { Category, Marketplace } from '@prisma/client'

describe('AI Service - Label Analysis', () => {
  // Path to test image
  const testImagePath = join(process.cwd(), 'test-images', 'sample-label.jpg')
  
  beforeAll(() => {
    // Check if test image exists
    if (!existsSync(testImagePath)) {
      console.warn(`⚠️  Test image not found at: ${testImagePath}`)
      console.warn('Please add a sample label image to run this test')
    }
  })

  it('should analyze a baby product label for US marketplace', async () => {
    // Skip if no test image
    if (!existsSync(testImagePath)) {
      console.log('⏭️  Skipping test - no image found')
      return
    }

    console.log('\n🧪 Testing AI Label Analysis...\n')

    // Read test image
    const imageBuffer = readFileSync(testImagePath)
    const blob = new Blob([imageBuffer], { type: 'image/jpeg' })
    const file = new File([blob], 'sample-label.jpg', { type: 'image/jpeg' })

    // Test parameters
    const params = {
      labelFile: file,
      category: Category.BABY_PRODUCTS,
      marketplaces: [Marketplace.US],
      productName: 'Test Baby Product',
    }

    console.log('📋 Test Parameters:')
    console.log(`   Category: ${params.category}`)
    console.log(`   Marketplaces: ${params.marketplaces.join(', ')}`)
    console.log(`   Product: ${params.productName}`)
    console.log('\n⏳ Analyzing label...\n')

    // Call AI service
    const result = await analyzeLabel(params)

    // Log results
    console.log('✅ Analysis Complete!\n')
    console.log('📊 Results:')
    console.log(`   Status: ${result.status}`)
    console.log(`   Score: ${result.score}%`)
    console.log(`   Risk Level: ${result.riskLevel}`)
    console.log(`   Issues Found: ${result.issuesCount}`)
    
    if (result.extractedInfo) {
      console.log('\n📝 Extracted Information:')
      console.log(`   Product: ${result.extractedInfo.productName || 'N/A'}`)
      console.log(`   Ingredients: ${result.extractedInfo.ingredients?.join(', ') || 'N/A'}`)
      console.log(`   Warnings: ${result.extractedInfo.warnings?.join(', ') || 'N/A'}`)
      console.log(`   Certifications: ${result.extractedInfo.certifications?.join(', ') || 'N/A'}`)
      console.log(`   Manufacturer: ${result.extractedInfo.manufacturer || 'N/A'}`)
    }

    if (result.issues && result.issues.length > 0) {
      console.log(`\n⚠️  Issues (${result.issues.length}):`)
      result.issues.forEach((issue, idx) => {
        console.log(`\n   ${idx + 1}. [${issue.severity}] ${issue.title}`)
        console.log(`      Description: ${issue.description}`)
        console.log(`      Regulation: ${issue.regulation}`)
        console.log(`      Recommendation: ${issue.recommendation}`)
      })
    }

    // Assertions
    expect(result).toBeDefined()
    expect(result.status).toMatch(/PASS|FAIL/)
    expect(result.score).toBeGreaterThanOrEqual(0)
    expect(result.score).toBeLessThanOrEqual(100)
    expect(result.riskLevel).toMatch(/LOW|MEDIUM|HIGH|CRITICAL/)
    expect(result.issuesCount).toBeGreaterThanOrEqual(0)
    expect(Array.isArray(result.issues)).toBe(true)
    
    console.log('\n✅ All assertions passed!')

  }, 60000) // 60 second timeout for API call

  it('should analyze a toy label for UK and EU marketplaces', async () => {
    if (!existsSync(testImagePath)) {
      console.log('⏭️  Skipping test - no image found')
      return
    }

    console.log('\n🧪 Testing Multi-Marketplace Analysis...\n')

    const imageBuffer = readFileSync(testImagePath)
    const blob = new Blob([imageBuffer], { type: 'image/jpeg' })
    const file = new File([blob], 'sample-label.jpg', { type: 'image/jpeg' })

    const params = {
      labelFile: file,
      category: Category.TOYS,
      marketplaces: [Marketplace.UK, Marketplace.DE],
      productName: 'Test Toy Product',
    }

    console.log('📋 Test Parameters:')
    console.log(`   Category: ${params.category}`)
    console.log(`   Marketplaces: ${params.marketplaces.join(', ')}`)
    console.log('\n⏳ Analyzing label...\n')

    const result = await analyzeLabel(params)

    console.log('✅ Analysis Complete!\n')
    console.log(`   Status: ${result.status}`)
    console.log(`   Score: ${result.score}%`)
    console.log(`   Risk Level: ${result.riskLevel}`)
    
    // Assertions
    expect(result).toBeDefined()
    expect(result.status).toMatch(/PASS|FAIL/)
    expect(result.issuesCount).toBeGreaterThanOrEqual(0)

    console.log('\n✅ Test passed!')

  }, 60000)

  it('should handle cosmetics analysis', async () => {
    if (!existsSync(testImagePath)) {
      console.log('⏭️  Skipping test - no image found')
      return
    }

    console.log('\n🧪 Testing Cosmetics Analysis...\n')

    const imageBuffer = readFileSync(testImagePath)
    const blob = new Blob([imageBuffer], { type: 'image/jpeg' })
    const file = new File([blob], 'sample-label.jpg', { type: 'image/jpeg' })

    const params = {
      labelFile: file,
      category: Category.COSMETICS,
      marketplaces: [Marketplace.US, Marketplace.UK],
      productName: 'Test Cosmetic Product',
    }

    console.log('📋 Test Parameters:')
    console.log(`   Category: ${params.category}`)
    console.log(`   Marketplaces: ${params.marketplaces.join(', ')}`)
    console.log('\n⏳ Analyzing label...\n')

    const result = await analyzeLabel(params)

    console.log('✅ Analysis Complete!\n')
    console.log(`   Status: ${result.status}`)
    console.log(`   Score: ${result.score}%`)

    // Assertions
    expect(result).toBeDefined()
    expect(result.extractedInfo).toBeDefined()
    expect(result.extractedInfo?.ingredients).toBeDefined()

    console.log('\n✅ Test passed!')

  }, 60000)
})

