# Test Images

This directory contains sample product label images for testing the AI label analysis service.

## Available Test Images

- **cosmetic-face-mask.png** - Hydrating face mask label with ingredients, warnings, and batch information

## How to Use

### Using Makefile

```bash
# Basic test with default settings (BABY_PRODUCTS, US marketplace)
make test-ai IMAGE=./test-images/cosmetic-face-mask.png

# Specify category
make test-ai IMAGE=./test-images/cosmetic-face-mask.png CATEGORY=COSMETICS

# Specify marketplaces (comma-separated)
make test-ai IMAGE=./test-images/cosmetic-face-mask.png CATEGORY=COSMETICS MARKETS=US,UK

# Full example
make test-ai IMAGE=./test-images/cosmetic-face-mask.png CATEGORY=COSMETICS MARKETS=DE
```

### Using Direct Script

```bash
# Basic
pnpm tsx scripts/test-ai-analysis.ts ./test-images/cosmetic-face-mask.png

# With category
pnpm tsx scripts/test-ai-analysis.ts ./test-images/cosmetic-face-mask.png COSMETICS

# With category and marketplaces
pnpm tsx scripts/test-ai-analysis.ts ./test-images/cosmetic-face-mask.png COSMETICS US,UK,DE
```

## Expected Output

The test will:
1. ✅ Load the image
2. ✅ Send it to Claude AI for analysis
3. ✅ Extract information (product name, ingredients, warnings, etc.)
4. ✅ Check compliance against regulations
5. ✅ Generate a compliance score (0-100%)
6. ✅ List any issues found with recommendations
7. ✅ Output results in both human-readable and JSON formats

## Available Categories

- `TOYS` - Toy products
- `BABY_PRODUCTS` - Baby and children's products
- `COSMETICS` - Cosmetic and personal care products

## Available Marketplaces

- `US` - United States (FDA regulations)
- `UK` - United Kingdom (UKCA regulations)
- `DE` - Germany/EU (CE marking, EU regulations)

## Add Your Own Images

Simply drop your product label images (JPG or PNG) into this directory and run the test command!

