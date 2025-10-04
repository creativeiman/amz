#!/bin/bash

# Amazon Label Compliance Checker - Quick Deploy Script
# This script helps you deploy your application quickly

echo "🚀 Amazon Label Compliance Checker - Deployment Script"
echo "======================================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed. Please install Node.js 18+ first"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed. Please install npm first"
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  Warning: .env.local not found"
    echo "📝 Creating .env.local from template..."
    cp env.example .env.local
    echo "✅ Created .env.local - Please update it with your actual values"
    echo ""
    echo "🔧 Required environment variables:"
    echo "   - DATABASE_URL (PostgreSQL connection string)"
    echo "   - NEXTAUTH_SECRET (random string)"
    echo "   - GOOGLE_CLIENT_ID (from Google Cloud Console)"
    echo "   - GOOGLE_CLIENT_SECRET (from Google Cloud Console)"
    echo "   - STRIPE_PUBLISHABLE_KEY (from Stripe Dashboard)"
    echo "   - STRIPE_SECRET_KEY (from Stripe Dashboard)"
    echo "   - OPENAI_API_KEY (from OpenAI Platform)"
    echo ""
    echo "📖 See DEPLOYMENT.md for detailed setup instructions"
    echo ""
    read -p "Press Enter to continue after updating .env.local..."
fi

# Generate Prisma client
echo "🗄️  Generating Prisma client..."
npx prisma generate

# Check if database is accessible
echo "🔍 Checking database connection..."
if npx prisma db push --accept-data-loss; then
    echo "✅ Database connection successful"
else
    echo "❌ Database connection failed"
    echo "Please check your DATABASE_URL in .env.local"
    exit 1
fi

# Build the application
echo "🏗️  Building application..."
if npm run build; then
    echo "✅ Build successful"
else
    echo "❌ Build failed"
    exit 1
fi

echo ""
echo "🎉 Setup complete! Your application is ready to deploy."
echo ""
echo "🚀 Next steps:"
echo "1. Update .env.local with your production values"
echo "2. Choose a deployment platform:"
echo "   - Vercel (recommended): https://vercel.com"
echo "   - Railway: https://railway.app"
echo "   - DigitalOcean: https://digitalocean.com"
echo "3. Connect your GitHub repository"
echo "4. Set environment variables in your platform"
echo "5. Deploy!"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT.md"
echo ""
echo "🌐 To run locally: npm run dev"
echo "🌐 To run in production: npm run start"
