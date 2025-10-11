import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../lib/auth'
import { OCRService } from '../../../../lib/ocr-service'

// Create Supabase client
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
}

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const category = formData.get('category') as string
    const marketplace = JSON.parse(formData.get('marketplace') as string || '[]')
    const productName = formData.get('productName') as string || 'Unknown Product'

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    if (!category) {
      return NextResponse.json(
        { error: 'Product category is required' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Extract text using Google Cloud Vision OCR with fallback
    let ocrResult
    try {
      ocrResult = await OCRService.extractTextFromImage(buffer)
    } catch (ocrError) {
      console.warn('Primary OCR failed, using fallback:', ocrError)
      ocrResult = await OCRService.extractTextFromImageFallback(buffer)
    }

    // Analyze compliance using real OCR data
    const complianceAnalysis = await OCRService.analyzeCompliance(
      ocrResult,
      category as 'toys' | 'baby' | 'cosmetics',
      marketplace
    )

    // Save scan to database
    const userId = (session.user as any)?.id
    const primaryMarketplace = marketplace[0] || 'USA'
    
    const scanData = {
      user_id: userId,
      product_name: productName,
      category: category,
      marketplace: primaryMarketplace,
      label_url: null, // We'll store the file URL later if needed
      extracted_text: ocrResult.text,
      results_json: {
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
          marketplace,
          scanDate: new Date().toISOString(),
          processingTime: Date.now()
        }
      },
      score: Math.round(complianceAnalysis.complianceScore)
    }

    const { data: savedScan, error: saveError } = await supabase
      .from('scans')
      .insert(scanData)
      .select()
      .single()

    if (saveError) {
      console.error('Error saving scan:', saveError)
      // Continue with response even if save fails
    }

    // Return comprehensive results
    return NextResponse.json({
      success: true,
      scanId: savedScan?.id,
      data: {
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
          marketplace,
          scanDate: new Date().toISOString(),
          processingTime: Date.now()
        }
      }
    })

  } catch (error) {
    console.error('OCR processing error:', error)
    
    // Provide specific error messages based on the error type
    if (error instanceof Error) {
      if (error.message.includes('Google Cloud Vision API not configured')) {
        return NextResponse.json(
          { 
            error: 'OCR service not configured',
            details: 'Google Cloud Vision API environment variables are missing or incorrect.',
            code: 'CONFIG_ERROR'
          },
          { status: 503 }
        )
      }
      
      if (error.message.includes('authentication failed')) {
        return NextResponse.json(
          { 
            error: 'OCR authentication failed',
            details: 'Google Cloud Vision API credentials are invalid.',
            code: 'AUTH_ERROR'
          },
          { status: 503 }
        )
      }
      
      if (error.message.includes('quota exceeded')) {
        return NextResponse.json(
          { 
            error: 'OCR quota exceeded',
            details: 'Google Cloud Vision API quota has been exceeded. Please try again later.',
            code: 'QUOTA_ERROR'
          },
          { status: 503 }
        )
      }
      
      if (error.message.includes('Failed to extract text')) {
        return NextResponse.json(
          { 
            error: 'OCR processing failed',
            details: error.message,
            code: 'OCR_ERROR'
          },
          { status: 500 }
        )
      }
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to process label',
        details: error instanceof Error ? error.message : 'Unknown error',
        code: 'UNKNOWN_ERROR'
      },
      { status: 500 }
    )
  }
}

