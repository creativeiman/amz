import { NextRequest, NextResponse } from 'next/server'
import { OCRService } from '../../../lib/ocr-service'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || 'toys'
    const marketplace = searchParams.get('marketplace') || 'USA'
    
    // Create a test image buffer
    const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
    const testBuffer = Buffer.from(testImageBase64, 'base64')

    console.log(`Testing OCR service with enhanced compliance engine for ${category} in ${marketplace}...`)

    // Test OCR extraction
    const ocrResult = await OCRService.extractTextFromImage(testBuffer)
    console.log('OCR Result:', {
      text: ocrResult.text.substring(0, 100) + '...',
      confidence: ocrResult.confidence,
      wordCount: ocrResult.words.length
    })

    // Test compliance analysis
    const complianceAnalysis = await OCRService.analyzeCompliance(
      ocrResult,
      category as 'toys' | 'baby' | 'cosmetics',
      [marketplace]
    )

    console.log('Compliance Analysis:', {
      productName: complianceAnalysis.productName,
      complianceScore: complianceAnalysis.complianceScore,
      issuesCount: complianceAnalysis.issues.length,
      recommendationsCount: complianceAnalysis.recommendations.length
    })

    return NextResponse.json({
      success: true,
      message: 'Scan flow test successful',
      results: {
        ocr: {
          extractedText: ocrResult.text,
          confidence: ocrResult.confidence,
          wordCount: ocrResult.words.length,
          lineCount: ocrResult.lines.length
        },
        compliance: {
          productName: complianceAnalysis.productName,
          complianceScore: complianceAnalysis.complianceScore,
          issues: complianceAnalysis.issues,
          recommendations: complianceAnalysis.recommendations,
          extractedInfo: {
            ingredients: complianceAnalysis.ingredients,
            warnings: complianceAnalysis.warnings,
            certifications: complianceAnalysis.certifications,
            batchNumber: complianceAnalysis.batchNumber,
            weight: complianceAnalysis.weight,
            manufacturer: complianceAnalysis.manufacturer
          }
        }
      }
    })

  } catch (error) {
    console.error('Scan flow test error:', error)
    return NextResponse.json({
      success: false,
      error: 'Scan flow test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
