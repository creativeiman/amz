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

    console.log(`Creating test scan results for ${category} in ${marketplace}...`)

    // Test OCR extraction
    const ocrResult = await OCRService.extractTextFromImage(testBuffer)
    
    // Test compliance analysis
    const complianceAnalysis = await OCRService.analyzeCompliance(
      ocrResult,
      category as 'toys' | 'baby' | 'cosmetics',
      [marketplace]
    )

    // Create the exact format that the scan results page expects
    const scanResult = {
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
      },
      metadata: {
        category,
        marketplace: [marketplace],
        scanDate: new Date().toISOString(),
        processingTime: Date.now()
      },
      scanId: 'test-scan-' + Date.now()
    }

    return NextResponse.json({
      success: true,
      message: 'Test scan results created successfully',
      scanResult,
      instructions: {
        step1: 'Copy the scanResult object from the response',
        step2: 'Open browser console on the scan results page',
        step3: 'Run: localStorage.setItem("latestScanResult", JSON.stringify(scanResult))',
        step4: 'Refresh the page to see the results'
      }
    })

  } catch (error) {
    console.error('Test scan results error:', error)
    return NextResponse.json({
      success: false,
      error: 'Test scan results failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}


