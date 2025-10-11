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

    console.log(`Creating test scan for ${category} in ${marketplace}...`)

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

    // Return JavaScript code that will set the localStorage
    const jsCode = `
      // Set the scan results in localStorage
      localStorage.setItem('latestScanResult', JSON.stringify(${JSON.stringify(scanResult)}));
      
      // Redirect to scan results page
      window.location.href = '/dashboard/scan-results';
    `

    return new NextResponse(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Test Scan Results</title>
        </head>
        <body>
          <h1>Test Scan Results Created</h1>
          <p>Compliance Score: ${complianceAnalysis.complianceScore}%</p>
          <p>Issues Found: ${complianceAnalysis.issues.length}</p>
          <p>Category: ${category}</p>
          <p>Marketplace: ${marketplace}</p>
          <button onclick="
            localStorage.setItem('latestScanResult', JSON.stringify(${JSON.stringify(scanResult)}));
            window.location.href = '/dashboard/scan-results';
          ">View Scan Results</button>
          <pre style="background: #f5f5f5; padding: 10px; margin: 10px 0; overflow: auto;">
            ${JSON.stringify(scanResult, null, 2)}
          </pre>
        </body>
      </html>
    `, {
      headers: {
        'Content-Type': 'text/html',
      },
    })

  } catch (error) {
    console.error('Create test scan error:', error)
    return NextResponse.json({
      success: false,
      error: 'Create test scan failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}


