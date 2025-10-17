/**
 * Compliance Rules Data
 * Contains all regulatory compliance rules for US, UK, and EU markets
 */

import { PrismaClient } from '@prisma/client'

const COMMON_RULES = `# Common Compliance Rules (All Regions)

## General Product Safety
- Product name must be clearly visible and legible
- Manufacturer information required
- All products must meet basic safety requirements
- Labels must be permanent and indelible where specified
- Warnings must be conspicuous and properly formatted

## Scoring Criteria
- **Critical Failures (50% weight)**: Missing mandatory markings (CE/UKCA), missing warnings, banned substances detected
- **Medium Failures (30% weight)**: Improper formatting, missing age grading, incomplete identification
- **Low Failures (20% weight)**: Missing optional information, formatting issues

## Compliance Threshold
**Scores below 99% = FAILED**
**Scores 99% and above = PASSED**

## Labeling Best Practices
- Font sizes must meet minimum requirements (typically ≥1mm or 1/16 inch)
- Warnings must start with "WARNING:" in bold
- Multilingual labels required where specified
- Barcodes must be clear and scannable
- Amazon FBA labels (FNSKU) required for fulfillment`

const US_RULES = `# United States Compliance Rules

## Regulatory Bodies
- **CPSC**: Consumer Product Safety Commission (16 CFR)
- **FDA**: Food and Drug Administration (FPLA, MoCRA 2022)
- **CPSIA**: Consumer Product Safety Improvement Act (§103-104)
- **ASTM**: American Society for Testing and Materials

---

## TOYS (CPSC, CPSIA §103, ASTM F963-23, 16 CFR 1500.19)

### Mandatory Requirements
- **ASTM F963-23** compliance (effective April 2024)
- **Children's Product Certificate (CPC)** required
- Tracking labels for recalls
- Age grading tied to hazards
- Third-party testing by CPSC-accepted lab

### Critical Labeling Elements (High)

#### 1. Children's Product Certificate (CPC) Reference
- **Format**: Cite ASTM F963-23; include test date, lab details, manufacturer/importer contact
- **Location**: Packaging/Document (PDF attached)
- **Validity**: 1 year or until product change
- **Amazon**: Upload to Seller Central; non-submission = suspension

#### 2. Age Grading
- **Format**: "Ages 3+" or "Suitable for ages 3-6 years" or "Not for children under 3 years"
- **Location**: Packaging/Ads (conspicuous, front/side)
- **Standard**: Tied to ASTM §4.38
- **Amazon**: Mandatory for gated products

#### 3. Choking Hazard Warning
- **Format**: "WARNING: CHOKING HAZARD—Small parts. Not for children under 3 yrs."
- **Symbol**: Triangle with exclamation mark (16 CFR 1500.19)
- **Location**: Packaging/Ads (≥1/16" font, bold)
- **Applies to**: Small parts, balloons, marbles, balls
- **Must start with**: "WARNING:"

#### 4. Producer Marking/Tracking Label
- **Format**: Manufacturer/importer name, US address (including website), date/location of manufacture, batch/cohort number
- **Location**: Product/Packaging (visible through clear packaging)
- **Permanence**: Indelible
- **Standard**: CPSIA §103

#### 5. Small Parts Warning
- **Format**: "Not for children under 3 yrs."
- **Location**: Packaging (conspicuous)
- **Test**: Cylinder test (ASTM §4.3)
- **Must start with**: "WARNING:"

#### 6. Flammability Warning
- **Format**: "Keep away from fire" or "Flammable—Keep away from heat sources"
- **Location**: Packaging
- **Applies to**: Stuffed/plush toys
- **Test**: 16 CFR 1500.44, ASTM §4.25

#### 7. Magnets/Batteries Warning
- **Format**: 
  - Magnets: "WARNING: Contains magnets—Ingestion hazard"
  - Batteries: "Button batteries: Keep out of reach"
- **Location**: Packaging
- **Standard**: 16 CFR 1250
- **Applies to**: Toys with accessible magnets/batteries

#### 8. Phthalates/Chemical Restrictions
- **Limit**: <0.1% per CPSIA §108
- **Format**: No labeling if compliant; flag if tests indicate excess (e.g., DEHP)
- **Test**: Third-party lab required
- **Amazon**: Requires proof of testing

#### 9. Country of Origin
- **Format**: "Made in [Country]" or "Assembled in [Country]"
- **Location**: Packaging (legible)
- **Standard**: 19 CFR 134
- **Amazon**: Required for customs/import

#### 10. Barcode/GTIN/EAN
- **Format**: UPC/EAN for scanning
- **Location**: Packaging
- **Amazon**: Preferred for ASIN matching

#### 11. Net Quantity/Weight
- **Format**: oz/lbs (metric optional)
- **Location**: Packaging
- **Applies to**: Sets and packaged items
- **Standard**: FPLA if packaged

### Medium Priority Elements (Med)

#### 12. Assembly Instructions
- **Format**: Detailed instructions with warnings for adult assembly
- **Location**: Packaging/Insert
- **Applies to**: Complex toys requiring assembly

#### 13. Amazon FBA Label
- **Format**: FNSKU barcode (clear, scannable, durable)
- **Location**: Outer Packaging
- **Requirements**: Print via Seller Central; protect with laminate; no tape over barcode

---

## BABY PRODUCTS (CPSC, CPSIA §104, ASTM Standards)

### Applicable Standards
- **CPSIA §104**: Durable infant/toddler items
- **ASTM F833**: Infant carriers
- **ASTM F1169**: Cribs
- Third-party testing required

### Critical Labeling Elements (High)

#### 1. Permanent Tracking Label
- **Format**: Manufacturer name, US address/phone, manufacturing date/location, batch number, model
- **Location**: Product (visible, e.g., through clear packaging)
- **Permanence**: Indelible
- **Standard**: CPSIA §103

#### 2. Age/Weight Limit
- **Format**: 
  - "For infants 0-6 months, max 20 lbs"
  - "Suitable for 0-2 years, max 30 lbs"
- **Location**: Product/Packaging (conspicuous)
- **Font**: ≥1/16 inch
- **Standard**: ASTM (e.g., §5.1)
- **Amazon**: Non-compliance = suspension

#### 3. Warnings
- **Format**: 
  - "Keep infant's face uncovered"
  - "Do not leave child unattended"
- **Location**: Packaging/Product (permanent)
- **Font**: Bold, ≥1/16 inch
- **Standard**: ASTM §5.3
- **Examples**: Suffocation, entrainment risks

#### 4. Assembly Instructions
- **Format**: Detailed diagrams/text; "Adult assembly required" if applicable
- **Location**: Packaging/Insert
- **Include**: Warnings for misuse

### Medium Priority Elements (Med)

#### 5. Product Registration Card
- **Format**: Postage-paid; manufacturer details, model number, toll-free number
- **Location**: Attached to product
- **Standard**: CPSIA §104
- **Purpose**: Improves recall response

#### 6. Amazon FBA Label
- **Format**: FNSKU (durable for transit, scannable)
- **Location**: Outer Packaging
- **Requirements**: Tape-free placement; poly bag if loose (suffocation risk)

### Low Priority Elements (Low)

#### 7. Country of Origin
- **Format**: "Made in [Country]"
- **Location**: Packaging (legible)
- **Standard**: 19 CFR 134

#### 8. Barcode/GTIN/EAN
- **Format**: UPC/EAN optional; FNSKU required
- **Location**: Outer packaging

#### 9. Net Weight
- **Format**: lbs/oz (metric optional)
- **Location**: Packaging

---

## COSMETICS & PERSONAL CARE (FDA, FPLA, MoCRA 2022)

### Regulatory Framework
- **FPLA**: Fair Packaging and Labeling Act
- **MoCRA 2022**: 2025 updates
  - Facility registration deadline: December 29, 2024
  - Adverse event reporting required
- **No banned list** except colors (21 CFR 74)

### Critical Labeling Elements (High)

#### 1. Principal Display Panel (PDP)
- **Format**: 
  - Product identity (e.g., "Shampoo")
  - Net quantity (oz/g, metric optional)
- **Location**: Front Panel
- **Font**: ≥1/16" for net quantity (bottom placement)
- **Amazon**: Clear identity verification required

#### 2. Information Panel
- **Format**: Manufacturer/distributor name/address; country of origin
- **Location**: Side/Back
- **Language**: English
- **Note**: "Distributed by..." if not manufacturer

#### 3. Ingredients List
- **Format**: 
  - INCI (International Nomenclature of Cosmetic Ingredients)
  - Descending order by quantity
  - "Fragrance" or "Parfum" as aggregate
  - Colorants listed last (+/- if multi-shade)
- **Location**: Info Panel
- **Font**: ≥1/16"
- **Requirements**: 
  - FDA color additives must be certified
  - Flag California Prop 65 carcinogens

#### 4. Warnings/Precautions
- **Format**: 
  - "For external use only"
  - "Avoid eye contact"
  - Tamper-resistant notice
- **Location**: Packaging
- **Applies to**: Aerosols, bubble baths
- **California**: "WARNING: Cancer risk" if Prop 65 applies

### Medium Priority Elements (Med)

#### 5. Durability/Expiration
- **Format**: "Best by [date]"
- **Location**: Packaging
- **Applies to**: Shelf-life <30 months
- **MoCRA 2025**: Facility number if finalized

#### 6. Amazon FBA Label
- **Format**: FNSKU; expiration if claimed; scannable
- **Location**: Outer packaging
- **Requirements**: Poly bag if loose; gated proof required

### Low Priority Elements (Low)

#### 7. Assembly/Usage Instructions
- **Format**: "Apply twice daily" (if applicable)
- **Location**: Packaging

#### 8. Country of Origin
- **Format**: "Made in [Country]"
- **Location**: Packaging

#### 9. Barcode/GTIN/EAN
- **Format**: UPC/EAN optional
- **Location**: Packaging

---

## Amazon-Specific Requirements (All Categories)

### FBA Prep Standards
- FNSKU on outer box only
- No tape over labels or barcodes
- Poly bags required for loose items (suffocation warning if >5")
- Barcodes must be scannable and protected

### Gated Category Requirements
- Upload certificates (CPC, ASTM test reports, safety data)
- Non-compliance risks:
  - Suspensions: 14-21 days
  - Lost sales: $3,000/day average
  - 53% surge in removals (2024 data)

### Compliance Scoring
- **High (50% weight)**: Critical safety elements
- **Medium (30% weight)**: Important but non-critical
- **Low (20% weight)**: Optional/recommended
- **Pass threshold**: ≥99%`

const UK_RULES = `# United Kingdom Compliance Rules

## Regulatory Bodies
- **OPSS**: Office for Product Safety & Standards
- **UKCA**: UK Conformity Assessed marking
- **CE**: Accepted until December 31, 2027
- **BS EN**: British Standards aligned with European Norms

---

## TOYS (Toys (Safety) Regulations 2011, EN 71 Series, UKCA)

### 2025 Updates (Effective October 25, 2025)
- Enhanced phthalates limit: <0.1%
- 64 new CMR (Carcinogenic, Mutagenic, Reprotoxic) substances in Annex II
- Examples: Zinc salts, 2-ethylhexanoic acid zinc salt

### Applicable Standards
- **EN 71-1**: Mechanical and physical properties
- **EN 71-2**: Flammability
- **EN 71-3**: Migration of certain elements
- **EN 71-6**: Graphic symbols for age warnings
- **EN 71-7**: Allergenic fragrances
- **EN 71-11**: Organic chemical compounds

### Mandatory Requirements
- UKCA marking (or CE until 2027)
- Responsible Person (UK-based if non-UK producer)
- Third-party testing
- Amazon UK: Submit UKCA/CE declaration, EN test reports, PIF if chemicals

### Critical Labeling Elements (High)

#### 1. UKCA/CE Marking
- **Format**: 
  - Height ≥5mm
  - Visible, legible, indelible
- **Location**: Product/Packaging (affixed to toy if possible)
- **Certification**: Self-certify or UK notified body for high-risk
- **Amazon**: Mandatory for gated; requires Declaration of Conformity

#### 2. Age Grading
- **Format**: 
  - Positive: "Suitable for 3+ years"
  - Negative: "Not suitable for children under 36 months"
- **Location**: Packaging (conspicuous, front)
- **Standard**: Tied to EN 71-1
- **Symbol**: Required for <36 months (EN 71-6)
- **Amazon**: Essential; non-compliance = suspension

#### 3. Identification
- **Format**: 
  - Manufacturer/importer/Responsible Person name
  - Traceable UK address
  - Batch/serial/model/type number
- **Location**: Product/Packaging
- **Permanence**: Indelible
- **Amazon**: Requires RP details for traceability

#### 4. Warnings
- **Format**: 
  - "Not suitable for children under 36 months" + choking symbol
  - Magnets: "Contains magnets"
  - Flammability warnings
- **Location**: Packaging
- **Font**: ≥1mm, bold
- **Language**: English text required
- **Symbols**: Red circle with slash (EN 71-6)
- **Must start with**: "WARNING:"

#### 5. Chemical Warnings/Restrictions
- **Format**: "Contains [fragrance/allergen]"
- **Threshold**: >0.001%
- **Location**: Packaging
- **Standard**: EN 71-7 (fragrances), EN 71-11 (chemicals)
- **2025 Annex II**: 64 CMR banned (e.g., 2-ethylhexanoic acid zinc salt)
- **Testing**: Third-party required

#### 6. Country of Origin
- **Format**: "Made in [Country]"
- **Location**: Packaging (legible)
- **Purpose**: Customs requirement

#### 7. Barcode/GTIN/EAN/FNSKU
- **Format**: GTIN/EAN or FNSKU for scanning
- **Location**: Packaging/Outer
- **Amazon**: Preferred for inventory management

#### 8. Net Quantity/Weight
- **Format**: g/kg if applicable (e.g., play sets)
- **Location**: Packaging
- **Standard**: Trade Measurement Regulations

### Medium Priority Elements (Med)

#### 9. Assembly Instructions
- **Format**: Detailed instructions with adult supervision warning
- **Location**: Packaging/Insert
- **Applies to**: Toys requiring assembly

#### 10. Amazon FBA Label
- **Format**: FNSKU (clear, scannable)
- **Location**: Outer Packaging
- **Requirements**: 
  - Comply with Toys Regs 2011
  - Prep via UK Seller Central
  - Include RP sticker

---

## BABY PRODUCTS (General Product Safety Regulations 2005, EN Standards, UKCA)

### Applicable Standards
- **EN 1888**: Wheeled child conveyances (strollers)
- **EN 1400**: Cots
- **EN 716**: Cribs
- **UKCA** for assessed items (CE accepted until 2027)

### Mandatory Requirements
- Responsible Person if non-UK manufacturer
- Third-party testing
- Amazon UK: UKCA Declaration of Conformity, EN test reports

### Critical Labeling Elements (High)

#### 1. UKCA/CE Marking
- **Format**: ≥5mm, visible/indelible
- **Location**: Product/Packaging
- **Amazon**: Mandatory for gated products

#### 2. Age/Weight Limit
- **Format**: "Suitable for 0-36 months, max 15kg"
- **Location**: Product/Packaging (conspicuous)
- **Standard**: EN 1888 §5.1 (product-specific)
- **Amazon**: Non-compliance risks removal

#### 3. Name/Brand
- **Format**: Product name and brand
- **Location**: Packaging
- **Purpose**: Consumer identification

#### 4. UK Representative/Responsible Person
- **Format**: Name/address if non-UK producer
- **Location**: Packaging/Product
- **Purpose**: Customs/OPSS traceability

#### 5. Safety Information/Warnings
- **Format**: 
  - "Adult assembly only"
  - Suffocation risks
  - Weight limits
- **Location**: Packaging
- **Font**: ≥1mm, bold
- **Symbols**: Required (EN standards)
- **Permanence**: Indelible

#### 6. Producing Company
- **Format**: Name/address
- **Location**: Product/Packaging

#### 7. Product Reference/Batch
- **Format**: Reference, batch, serial/model number
- **Location**: Product
- **Purpose**: Recall traceability

### Medium Priority Elements (Med)

#### 8. Country of Origin
- **Format**: "Made in [Country]"
- **Location**: Packaging

#### 9. Assembly Instructions
- **Format**: Detailed with warnings
- **Location**: Insert/Packaging

#### 10. Amazon FBA Label
- **Format**: FNSKU with compliance sticker
- **Location**: Outer packaging
- **Requirements**: 
  - GB fulfillment centers
  - Poly bag if suffocation risk

### Low Priority Elements (Low)

#### 11. Barcode/GTIN/EAN/FNSKU
- **Format**: GTIN/EAN or FNSKU
- **Location**: Outer packaging

#### 12. Net Weight
- **Format**: kg/g
- **Location**: Packaging
- **Standard**: Trade requirements

---

## COSMETICS & PERSONAL CARE (UK Cosmetics Regulation, OPSS, Aligned to EU 1223/2009)

### Regulatory Framework
- **UKCR**: UK Cosmetics Regulation
- **Responsible Person**: UK-based required
- **SCPN**: Submit Cosmetic Product Notification
- **2025 Annex II**: 64 CMR bans

### Mandatory Requirements
- Amazon UK: Gated; requires SCPN proof

### Critical Labeling Elements (High)

#### 1. Responsible Person
- **Format**: UK name/address
- **Location**: Container/Packaging
- **Amazon**: Required if imported

#### 2. Ingredients List
- **Format**: 
  - INCI descending order
  - "Nano" prefix for nanomaterials
  - Allergens >0.001% (Annex III)
- **Location**: Packaging/Leaflet
- **Language**: English
- **Note**: "Parfum" for fragrance aggregates
- **Banned**: Flag Annex II substances

#### 3. Function/Precautions/Warnings
- **Format**: 
  - Product function
  - Warnings (e.g., "Avoid eye contact")
- **Location**: Packaging
- **Standard**: Annex III-VI

### Medium Priority Elements (Med)

#### 4. Nominal Content
- **Format**: Weight/volume (g/ml)
- **Location**: Container
- **Exemption**: <5g/ml

#### 5. Durability/PAO
- **Format**: 
  - "Best before end of [date]"
  - PAO symbol (Period After Opening) - Annex VII
  - Batch number
- **Location**: Container

#### 6. Amazon FBA Label
- **Format**: FNSKU; GB regulations compliance
- **Location**: Outer packaging
- **Requirements**: Include RP info

### Low Priority Elements (Low)

#### 7. Country of Origin
- **Format**: "Made in [Country]"
- **Location**: Packaging
- **Applies to**: Imported products

#### 8. Barcode/GTIN/EAN
- **Format**: Optional
- **Location**: Packaging

---

## Amazon UK Specific Requirements

### FBA Prep Standards
- FNSKU on outer box
- No tape over labels
- Poly bags for loose items
- Responsible Person details visible

### Gated Category Requirements
- UKCA/CE Declaration of Conformity
- EN test reports
- SCPN proof (cosmetics)
- Product Information File (PIF) if chemicals

### Compliance Scoring
- **High (50%)**: UKCA/CE, warnings, identification
- **Medium (30%)**: Instructions, RP details
- **Low (20%)**: Optional information
- **Pass threshold**: ≥99%`

const EU_RULES = `# European Union (Germany) Compliance Rules

## Regulatory Bodies
- **CE**: Conformité Européenne marking
- **TSD**: Toy Safety Directive 2009/48/EC
- **GPSD**: General Product Safety Directive 2001/95/EC
- **Cosmetics Regulation**: (EC) No 1223/2009
- **EN Standards**: European Norms

---

## TOYS (EU Toy Safety Directive 2009/48/EC, EN 71 Series, CE)

### 2025 Updates (Provisional Regulation)
- **Enhanced Annex II**: 71 CMR bans
  - Example: Styrene/acrylates copolymer banned November 1, 2025
- **Digital Product Passport**: For traceability
- **Chemical restrictions**: Enhanced testing requirements

### Applicable Standards
- **EN 71 Series**: Same as UK (EN 71-1 through EN 71-11)
- **CE Marking**: Mandatory
- **Notified Body**: Required for complex products

### Mandatory Requirements
- EU importer address
- Third-party testing
- Amazon DE: CE declaration, EN test reports

### Critical Labeling Elements (High)

#### 1. CE Marking
- **Format**: 
  - Height ≥5mm
  - Visible, legible, indelible
- **Location**: Product/Packaging (affixed to toy)
- **Certification**: Self-certify or EU notified body
- **Amazon**: Mandatory; requires Declaration of Conformity

#### 2. Multi-lingual Labeling
- **Requirement**: Include German language translations
- **Applies to**: 
  - Age grading
  - Warnings
  - Assembly information
- **Location**: Label
- **Amazon**: Required for German marketplace

#### 3. Age Grading
- **Format**: 
  - German: "Ab 3 Jahren" (From 3 years)
  - Negative: "Nicht geeignet für Kinder unter 36 Monaten"
- **Location**: Packaging (conspicuous)
- **Standard**: EN 71-1
- **Language**: Multilingual (German mandatory)
- **Amazon**: Non-compliance risks removal

#### 4. Identification
- **Format**: 
  - Manufacturer/importer name
  - EU (German) address
  - Type/batch/serial/model number
- **Location**: Product/Packaging
- **Permanence**: Indelible

#### 5. Warnings
- **Format**: 
  - German: "Erstickungsgefahr—Kleine Teile" (Choking hazard—Small parts)
  - 55 fragrance allergens >0.001%
- **Location**: Packaging
- **Font**: ≥1mm
- **Symbols**: EN 71-6
- **Must start with**: "WARNING:" or German equivalent "WARNUNG:"

#### 6. Chemical Restrictions
- **2025 Annex II**: 71 CMR banned
  - Example: TPO (Triphenyl phosphate) banned September 1, 2025
- **Format**: Label trace amounts if allowed
- **Location**: Packaging
- **Testing**: Third-party required
- **App**: Flags violations automatically

### Medium Priority Elements (Med)

#### 7. Assembly Instructions
- **Format**: Detailed instructions
- **Language**: Multilingual (German required)
- **Location**: Packaging/Insert
- **Applies to**: Complex items

#### 8. Amazon FBA Label
- **Format**: FNSKU; EU rep details; indelible
- **Location**: Outer Packaging
- **Requirements**: 
  - DE Seller Central setup
  - PAN-EU compliant

### Low Priority Elements (Low)

#### 9. Country of Origin
- **Format**: "Made in [Country]"
- **Location**: Packaging

#### 10. Barcode/GTIN/EAN/FNSKU
- **Format**: GTIN/EAN or FNSKU
- **Location**: Packaging

#### 11. Net Quantity/Weight
- **Format**: g/kg if applicable
- **Location**: Packaging

---

## BABY PRODUCTS (General Product Safety Directive 2001/95/EC, EN Standards, CE)

### 2025 GPSR Update
- Enhanced traceability requirements
- Strengthened age warning requirements
- Digital compliance tracking

### Applicable Standards
- **EN 1888**: Strollers
- **EN 1400**: Cots
- **EN 716**: Cribs
- **CE marking**: Required for EN standards

### Mandatory Requirements
- EU importer details
- Notified body if complex
- Amazon DE: CE Declaration of Conformity

### Critical Labeling Elements (High)

#### 1. CE Marking
- **Format**: Visible/indelible
- **Location**: Product/Packaging
- **Applies to**: EN 1888/1400/716 products
- **Amazon**: Requires notified body certificate if complex

#### 2. Age/Weight Limit
- **Format**: German: "Für Kinder von 0-36 Monaten, max 15kg"
- **Location**: Product/Packaging
- **Standard**: EN §5.1 (product-specific)
- **Language**: Multilingual (German mandatory)
- **Amazon**: Non-compliance = suspension

#### 3. Name/Brand
- **Format**: Product name/brand
- **Location**: Packaging

#### 4. EU Importer
- **Format**: Name/address (German)
- **Location**: Packaging
- **Purpose**: Customs/traceability

#### 5. Safety Information/Warnings
- **Format**: 
  - Suffocation risks
  - Symbols + German text
- **Location**: Packaging
- **Font**: ≥1mm
- **Standard**: EN §5.3 (product-specific)

#### 6. Producing Company
- **Format**: Name/address
- **Location**: Product

#### 7. Product Reference/Batch
- **Format**: Reference, batch, serial/model
- **Location**: Product

### Medium Priority Elements (Med)

#### 8. Country of Origin
- **Format**: "Made in [Country]"
- **Location**: Packaging

#### 9. Assembly Instructions
- **Format**: Detailed instructions
- **Language**: Multilingual (German required)
- **Location**: Insert

#### 10. Amazon FBA Label
- **Format**: FNSKU; EU rep sticker
- **Location**: Outer packaging
- **Requirements**: PAN-EU fulfillment

### Low Priority Elements (Low)

#### 11. Barcode/GTIN/EAN/FNSKU
- **Format**: GTIN/EAN or FNSKU
- **Location**: Outer packaging

#### 12. Net Weight
- **Format**: kg/g
- **Location**: Packaging

---

## COSMETICS & PERSONAL CARE (EU Cosmetics Regulation 1223/2009)

### 2025 Updates
- **Annex II**: 21 new CMR bans
  - Example: TPO banned September 1, 2025
- Enhanced nanomaterial regulations
- Stricter allergen thresholds

### Mandatory Requirements
- **EU Responsible Person**: Required
- **CPNP Notification**: Cosmetic Product Notification Portal
- Amazon DE: Gated; requires CPNP proof

### Critical Labeling Elements (High)

#### 1. Responsible Person
- **Format**: EU name/address
- **Location**: Container
- **Standard**: Regulation 1223/2009
- **Amazon**: Required for import

#### 2. Ingredients & Function
- **Format**: 
  - INCI descending order
  - Product function
  - Precautions (Annex III-VI)
- **Location**: Packaging/Leaflet
- **Language**: Multilingual (German mandatory)
- **Note**: "Parfum" for fragrances
- **Allergens**: >0.001% must be listed

#### 3. Warnings
- **Format**: 
  - "Nano" prefix for nanomaterials
  - Annex II bans flagged
- **Location**: Packaging

### Medium Priority Elements (Med)

#### 4. Nominal Content
- **Format**: Weight/volume
- **Location**: Container
- **Exemption**: Small quantities

#### 5. Durability/PAO
- **Format**: 
  - Minimum durability date
  - PAO symbol (Annex VII)
  - Batch number
- **Location**: Container

#### 6. Amazon FBA Label
- **Format**: FNSKU; EU rep details
- **Location**: Outer packaging
- **Requirements**: PAN-EU compliance

### Low Priority Elements (Low)

#### 7. Country of Origin
- **Format**: "Made in [Country]"
- **Location**: Packaging
- **Requirement**: Mandatory

#### 8. Barcode/GTIN/EAN
- **Format**: Optional
- **Location**: Packaging

---

## Amazon Germany/EU Specific Requirements

### FBA Prep Standards
- FNSKU on outer box
- EU representative details visible
- PAN-EU fulfillment labels
- German language compliance

### Gated Category Requirements
- CE Declaration of Conformity
- EN test reports
- CPNP proof (cosmetics)
- Digital Product Passport (2025 for toys)

### Non-Compliance Risks
- Fines: €10,000+ for safety violations
- Recall costs: €147,000+ average
- Suspension: Immediate for critical violations
- Marketplace removal: 53% surge in 2024

### Compliance Scoring
- **High (50%)**: CE marking, German translations, warnings
- **Medium (30%)**: Instructions, EU rep details
- **Low (20%)**: Optional elements
- **Pass threshold**: ≥99%

---

## German Language Requirements

### Mandatory Translations
- Age grading ("Ab 3 Jahren")
- All warnings ("WARNUNG:", "Erstickungsgefahr")
- Assembly instructions
- Safety information
- Product function (cosmetics)
- Precautions and usage directions

### Font and Placement
- Minimum 1mm for warnings
- Conspicuous placement on front/side panels
- Bold text for warnings
- Symbols with German text labels`

const MASTER_PROMPT = `You are an expert product compliance analyst specializing in label compliance and regulatory requirements.

**Your Task:**
Analyze the product label IMAGE provided and evaluate it for compliance with applicable regulations.

**Analysis Instructions:**
- Carefully examine ALL text visible on the label image
- Check for ALL required markings, symbols, and graphics (CE, UKCA, warning symbols, etc.)
- Extract ALL visible information including:
  - Product name and description
  - Ingredients list (if applicable)
  - Warning labels and precautions
  - Certifications and compliance marks
  - Manufacturer information and contact details
  - Net weight/quantity and country of origin
  - Batch numbers and expiration dates
- Verify font sizes, placement, and visibility of critical information
- Check for proper formatting and multilingual requirements

**Compliance Scoring:**
Use a weighted scoring system based on issue severity:
- **Critical failures (High priority)**: 50% weight - Missing mandatory safety warnings, banned substances, missing required certifications
- **Medium failures (Med priority)**: 30% weight - Incomplete information, improper formatting, missing optional elements
- **Low failures (Low priority)**: 20% weight - Minor formatting issues, recommendations for improvement

**Pass/Fail Threshold:**
- **Score ≥99% = PASS** ✅
- **Score <99% = FAIL** ❌

**Output Requirements:**
Be thorough and identify all compliance issues. For each issue found:
1. Clearly describe the problem
2. Specify which regulation is violated
3. Provide specific, actionable recommendations to fix the issue
4. Categorize the severity (CRITICAL, WARNING, or INFO)

Focus on safety, accuracy, and regulatory compliance to protect consumers and help businesses meet legal requirements.`

export async function seedComplianceRules(prisma: PrismaClient) {
  // Upsert system settings with compliance rules
  await prisma.systemSettings.upsert({
    where: { id: 'system_settings' },
    update: {
      masterPrompt: MASTER_PROMPT,
      commonRules: COMMON_RULES,
      usRules: US_RULES,
      ukRules: UK_RULES,
      euRules: EU_RULES,
    },
    create: {
      id: 'system_settings',
      masterPrompt: MASTER_PROMPT,
      commonRules: COMMON_RULES,
      usRules: US_RULES,
      ukRules: UK_RULES,
      euRules: EU_RULES,
    },
  })

  console.log(`   - Common Rules: ${COMMON_RULES.split('\n').length} lines`)
  console.log(`   - US Rules: ${US_RULES.split('\n').length} lines`)
  console.log(`   - UK Rules: ${UK_RULES.split('\n').length} lines`)
  console.log(`   - EU Rules: ${EU_RULES.split('\n').length} lines`)
}

