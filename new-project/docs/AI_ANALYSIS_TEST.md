# AI Label Analysis Testing

## Overview
This document explains how to test the AI-powered label compliance analysis system.

## Model Information
- **Model**: Claude Sonnet 4 (`claude-sonnet-4-20250514`)
- **Provider**: Anthropic via AI SDK
- **Capabilities**: Vision analysis, structured output, long-context reasoning
- **Pricing**: $3 per million input tokens, $15 per million output tokens

## Test Images
Sample product labels are located in `/test-images/`:
- `cosmetic-face-mask.png` - Hydrating face mask label (COSMETICS_PERSONAL_CARE)
- `cosmetic-lotion-jason.png` - Jason coconut lotion label (COSMETICS_PERSONAL_CARE)

## Running Tests

### Quick Test (Default Image)
```bash
cd new-project
pnpm dotenv -e .env.local -- tsx scripts/test-ai-analysis.ts
```

### Test with Specific Image
```bash
pnpm dotenv -e .env.local -- tsx scripts/test-ai-analysis.ts ./test-images/cosmetic-lotion-jason.png
```

### Test with Custom Parameters
```bash
pnpm dotenv -e .env.local -- tsx scripts/test-ai-analysis.ts \
  ./test-images/sample.jpg \
  TOYS \
  US,UK
```

## Test Output

The test script provides:
1. **Compliance Score** - Percentage score (must be ≥99% to pass)
2. **Status** - PASS or FAIL
3. **Risk Level** - LOW, MEDIUM, HIGH, or CRITICAL
4. **Issues Count** - Number of compliance issues found
5. **Extracted Information**:
   - Product name, brand, manufacturer
   - Ingredients list
   - Warnings and precautions
   - Certifications
   - Batch number, expiration date
   - Country of origin
6. **Detailed Issues**:
   - Severity (CRITICAL, WARNING, INFO)
   - Description of the problem
   - Regulation violated
   - Specific recommendations

## Example Test Result

```
============================================================
📊 ANALYSIS RESULTS
============================================================

📈 Compliance Score: 85%
   Status: ❌ FAIL
   Risk Level: HIGH
   Issues Found: 7

📝 Extracted Information:
   Product Name: Hydrating Face Mask with Hyaluronic Acid and Shea
   Manufacturer: SBLC Skincare GmbH, Lahn, Munich, Germany
   Country of Origin: Made in China
   Ingredients: Aqua, Glycerin, Sodium Hyaluronate, ...
   Warnings: Avoid contact with eyes. For external use only...

⚠️  Compliance Issues (7):

   🔴 Issue 1: Missing EU Responsible Person
      Severity: CRITICAL
      Description: Missing EU Responsible Person information required...
      Regulation: EU Cosmetics Regulation 1223/2009
      Recommendation: Add EU Responsible Person name and address...
```

## Prerequisites

1. **Environment Variables**: Ensure `.env.local` contains:
   ```env
   DATABASE_URL=postgresql://...
   ANTHROPIC_API_KEY=sk-ant-...
   ```

2. **Database Setup**: Run `make dev-setup` to seed compliance rules

3. **Dependencies**: Install with `pnpm install`

## Available Categories
- `TOYS`
- `BABY_PRODUCTS`
- `COSMETICS_PERSONAL_CARE`

## Available Marketplaces
- `US` - United States (FDA, CPSC, CPSIA)
- `UK` - United Kingdom (UKCA, BS EN standards)
- `DE` - Germany/EU (CE marking, EN standards, EU regulations)

## Troubleshooting

### "Module not found" errors
Run `pnpm install` to ensure all dependencies are installed.

### "Invalid category" or "Invalid marketplace" errors
Check that you're using the correct enum values listed above.

### "Database connection failed"
Ensure PostgreSQL is running (`make docker-up`) and DATABASE_URL is set.

### "ANTHROPIC_API_KEY not found"
Add your Anthropic API key to `.env.local`.

## Integration Testing

To test the full scan flow through the web interface:
1. Start the dev server: `make dev`
2. Login as a user
3. Navigate to "Scans" page
4. Click "New Scan"
5. Upload a label image
6. Fill in product details
7. Submit and review results

## Cost Estimation

Based on typical usage:
- Average label analysis: ~1,500 input tokens + ~800 output tokens
- Cost per analysis: ~$0.016 USD
- 1,000 scans/month: ~$16 USD

## Master Prompt Customization

Admins can customize the AI analysis prompt at:
`/admin/settings` → "Master Prompt" tab

The system automatically appends:
- Product category requirements
- Target marketplace regulations  
- Common + country-specific compliance rules

This ensures consistent, regulation-aware analysis while allowing customization.

