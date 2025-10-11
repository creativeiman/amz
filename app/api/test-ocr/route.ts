import { NextRequest, NextResponse } from 'next/server'
import { OCRService } from '../../../lib/ocr-service'

// Environment variables for debugging
const GOOGLE_CLOUD_PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID
const GOOGLE_CLOUD_PRIVATE_KEY = process.env.GOOGLE_CLOUD_PRIVATE_KEY
const GOOGLE_CLOUD_CLIENT_EMAIL = process.env.GOOGLE_CLOUD_CLIENT_EMAIL
const GOOGLE_CLOUD_CLIENT_ID = process.env.GOOGLE_CLOUD_CLIENT_ID
const GOOGLE_CLOUD_PRIVATE_KEY_ID = process.env.GOOGLE_CLOUD_PRIVATE_KEY_ID

export async function GET() {
  try {
    // Test environment variables
    const envCheck = {
      GOOGLE_CLOUD_PROJECT_ID: !!process.env.GOOGLE_CLOUD_PROJECT_ID,
      GOOGLE_CLOUD_PRIVATE_KEY: !!process.env.GOOGLE_CLOUD_PRIVATE_KEY,
      GOOGLE_CLOUD_CLIENT_EMAIL: !!process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
      GOOGLE_CLOUD_CLIENT_ID: !!process.env.GOOGLE_CLOUD_CLIENT_ID,
      GOOGLE_CLOUD_PRIVATE_KEY_ID: !!process.env.GOOGLE_CLOUD_PRIVATE_KEY_ID
    }

    const missingVars = Object.entries(envCheck)
      .filter(([key, value]) => !value)
      .map(([key]) => key)

    if (missingVars.length > 0) {
      return NextResponse.json({
        success: false,
        error: 'Missing environment variables',
        missing: missingVars,
        envCheck
      }, { status: 500 })
    }

    // Test with a simple base64 image (1x1 pixel)
    const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
    const testBuffer = Buffer.from(testImageBase64, 'base64')

    // Log environment variable status for debugging
    console.log('Environment check:', {
      GOOGLE_CLOUD_PROJECT_ID: !!GOOGLE_CLOUD_PROJECT_ID,
      GOOGLE_CLOUD_PRIVATE_KEY: !!GOOGLE_CLOUD_PRIVATE_KEY,
      GOOGLE_CLOUD_CLIENT_EMAIL: !!GOOGLE_CLOUD_CLIENT_EMAIL,
      GOOGLE_CLOUD_CLIENT_ID: !!GOOGLE_CLOUD_CLIENT_ID,
      GOOGLE_CLOUD_PRIVATE_KEY_ID: !!GOOGLE_CLOUD_PRIVATE_KEY_ID
    })

    try {
      const result = await OCRService.extractTextFromImage(testBuffer)
      
      return NextResponse.json({
        success: true,
        message: 'Google Cloud Vision API is working',
        envCheck,
        testResult: {
          text: result.text,
          confidence: result.confidence,
          wordCount: result.words.length,
          lineCount: result.lines.length
        }
      })
    } catch (ocrError) {
      return NextResponse.json({
        success: false,
        error: 'OCR test failed',
        envCheck,
        ocrError: ocrError instanceof Error ? ocrError.message : 'Unknown OCR error'
      }, { status: 500 })
    }

  } catch (error) {
    console.error('OCR test error:', error)
    return NextResponse.json({
      success: false,
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
