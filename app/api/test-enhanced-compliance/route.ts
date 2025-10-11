import { NextRequest, NextResponse } from 'next/server'
import { ComplianceEngine } from '../../../lib/compliance-engine'

export async function GET() {
  try {
    // Test with different categories and countries
    const testCases = [
      {
        category: 'Toys',
        country: 'USA',
        text: 'Super Toy Car - Ages 3+ - WARNING: CHOKING HAZARD—Small parts. Not for children under 3 yrs. - Manufacturer: ToyCo Inc. 123 Toy Lane, USA - Batch: TC12345 - Net Weight: 250g - Certifications: CE Mark, ASTM F963'
      },
      {
        category: 'Baby Products',
        country: 'UK',
        text: 'Baby Stroller - Suitable for 0-36 months, max 15kg - UKCA Marking - Manufacturer: BabyCo Ltd, London, UK - Batch: BS2025001 - Assembly required - Adult assembly only'
      },
      {
        category: 'Cosmetics',
        country: 'Germany',
        text: 'Shampoo - 250ml - Best before end of 12/2026 - Ingredients: Aqua, Sodium Lauryl Sulfate, Parfum - Responsible Person: Cosmetics EU GmbH, Berlin - For external use only - Avoid eye contact'
      }
    ]

    const results = []

    for (const testCase of testCases) {
      const { results: complianceResults, score } = ComplianceEngine.performComplianceCheck(
        testCase.text,
        testCase.category,
        testCase.country
      )

      const report = ComplianceEngine.generateReport(complianceResults, score)

      results.push({
        category: testCase.category,
        country: testCase.country,
        score: report.score,
        totalRules: complianceResults.length,
        criticalIssues: report.issues.Critical.length,
        warnings: report.issues.Warning.length,
        recommendations: report.issues.Recommendation.length,
        suggestions: report.suggestions.slice(0, 3) // First 3 suggestions
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Enhanced compliance engine test successful',
      testResults: results,
      summary: {
        totalTestCases: testCases.length,
        averageScore: results.reduce((sum, r) => sum + r.score, 0) / results.length,
        totalRulesChecked: results.reduce((sum, r) => sum + r.totalRules, 0)
      }
    })

  } catch (error) {
    console.error('Enhanced compliance test error:', error)
    return NextResponse.json({
      success: false,
      error: 'Enhanced compliance test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}


