import { NextRequest, NextResponse } from 'next/server'
import { ComplianceEngine } from '../../../../lib/compliance-engine'

export async function POST(request: NextRequest) {
  try {
    const { labelText, category, country, productName } = await request.json()

    if (!labelText || !category || !country) {
      return NextResponse.json(
        { error: 'Missing required fields: labelText, category, country' },
        { status: 400 }
      )
    }

    // Validate category and country
    const { categories, countries } = ComplianceEngine.getAvailableOptions()
    
    if (!categories.includes(category)) {
      return NextResponse.json(
        { error: `Invalid category. Must be one of: ${categories.join(', ')}` },
        { status: 400 }
      )
    }

    if (!countries.includes(country)) {
      return NextResponse.json(
        { error: `Invalid country. Must be one of: ${countries.join(', ')}` },
        { status: 400 }
      )
    }

    // Perform compliance check
    const { results, score } = ComplianceEngine.performComplianceCheck(
      labelText,
      category,
      country
    )

    // Generate comprehensive report
    const report = ComplianceEngine.generateReport(results, score)

    // Determine overall status
    let status: 'compliant' | 'warning' | 'non-compliant' = 'compliant'
    if (report.issues.Critical.length > 0) {
      status = 'non-compliant'
    } else if (report.issues.Warning.length > 0 || report.issues.Recommendation.length > 0) {
      status = 'warning'
    }

    // Calculate risk level
    let riskLevel: 'Low' | 'Medium' | 'High' = 'Low'
    if (score < 50) {
      riskLevel = 'High'
    } else if (score < 80) {
      riskLevel = 'Medium'
    }

    return NextResponse.json({
      success: true,
      data: {
        productName: productName || 'Unnamed Product',
        category,
        country,
        status,
        riskLevel,
        score,
        report,
        timestamp: new Date().toISOString(),
        recommendations: {
          immediate: report.issues.Critical.map(issue => issue.suggestion).filter(Boolean),
          recommended: report.issues.Warning.map(issue => issue.suggestion).filter(Boolean),
          optional: report.issues.Recommendation.map(issue => issue.suggestion).filter(Boolean)
        }
      }
    })

  } catch (error) {
    console.error('Compliance check error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const { categories, countries } = ComplianceEngine.getAvailableOptions()
    
    return NextResponse.json({
      success: true,
      data: {
        categories,
        countries,
        supportedMarkets: {
          'USA': ['Toys', 'Baby Products', 'Cosmetics'],
          'UK': ['Toys', 'Baby Products', 'Cosmetics'],
          'Germany': ['Toys', 'Baby Products', 'Cosmetics']
        }
      }
    })
  } catch (error) {
    console.error('Error fetching compliance options:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}



