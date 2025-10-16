# Amazon Label Compliance Checker

A modern, AI-powered SaaS platform that enables Amazon sellers to validate product label compliance across US, UK, and German marketplaces for Toys, Baby Products, and Cosmetics/Personal Care categories.

## 🚀 Features

### ✅ Completed
- **Modern UI/UX**: Beautiful, responsive design with glassmorphism effects and smooth animations
- **Authentication**: Complete auth system with email/password and Google OAuth
- **Database Schema**: Comprehensive PostgreSQL schema for users, scans, payments, and regulatory rules
- **Dashboard**: User dashboard with stats, quick actions, and scan history
- **Landing Page**: Professional homepage with features, pricing, and testimonials sections

### 🚧 In Progress
- **File Upload System**: OCR integration with Google Cloud Vision API
- **Compliance Rules Engine**: Database of regulations for different categories and marketplaces
- **Results Page**: Comprehensive compliance scoring and issue reporting
- **Payment Integration**: Stripe integration for subscriptions and one-time payments
- **Plan Management**: Usage limits and feature restrictions based on subscription tier

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **Payments**: Stripe
- **OCR**: Google Cloud Vision API
- **AI**: OpenAI GPT-4
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- Google Cloud account (for Vision API)
- Stripe account (for payments)
- OpenAI account (for AI features)

## 🚀 Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd amazon-label-compliance-checker

# Install dependencies
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/amazon_compliance_checker"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Stripe
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# OpenAI
OPENAI_API_KEY="sk-..."

# Google Cloud Vision API
GOOGLE_CLOUD_PROJECT_ID="your-project-id"
GOOGLE_CLOUD_KEY_FILE="path/to/service-account-key.json"

# Email (Optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Seed the database with regulatory rules
npx prisma db seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
├── app/                    # Next.js 14 App Router
│   ├── api/               # API routes
│   │   └── auth/          # Authentication endpoints
│   ├── auth/              # Auth pages (signin, signup)
│   ├── dashboard/         # User dashboard
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── layout/           # Layout components (Navigation, Footer)
│   └── sections/         # Page sections (Hero, Features, etc.)
├── lib/                  # Utility libraries
│   └── prisma.ts         # Prisma client
├── prisma/               # Database schema and migrations
│   └── schema.prisma     # Database schema
├── public/               # Static assets
└── types/                # TypeScript type definitions
```

## 🎨 Design System

The application uses a modern design system with:

- **Colors**: Purple/blue gradient theme with semantic color tokens
- **Typography**: Inter (body) and Lato (headings) fonts
- **Components**: Custom components with Tailwind CSS
- **Animations**: Smooth transitions and micro-interactions
- **Responsive**: Mobile-first design approach

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:push      # Push schema changes to database
npm run db:generate  # Generate Prisma client
npm run db:studio    # Open Prisma Studio
```

### Code Style

- **ESLint**: Configured with Next.js recommended rules
- **Prettier**: Code formatting (recommended)
- **TypeScript**: Strict mode enabled
- **Import Organization**: Absolute imports with `@/` prefix

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm run start
```

## 📊 Database Schema

### Key Tables

- **Users**: User accounts with plan information
- **Scans**: Label scan records with results
- **Issues**: Individual compliance issues found
- **Payments**: Stripe payment records
- **RegulatoryRules**: Compliance requirements database

### Relationships

- Users have many Scans
- Scans have many Issues
- Users have many Payments
- Scans reference RegulatoryRules

## 🔐 Security

- **Authentication**: NextAuth.js with JWT tokens
- **Password Hashing**: bcrypt with 12 rounds
- **CSRF Protection**: Built-in NextAuth.js protection
- **Rate Limiting**: Implemented for API routes
- **Input Validation**: Zod schemas for form validation

## 📈 Performance

- **Next.js 14**: App Router with server components
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic route-based splitting
- **Caching**: Redis for session and data caching
- **CDN**: Vercel Edge Network

## 🧪 Testing

```bash
# Run tests (when implemented)
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📝 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/signin` - User sign in
- `GET /api/auth/session` - Get current session

### Scan Endpoints

- `POST /api/scans` - Create new scan
- `GET /api/scans` - Get user scans
- `GET /api/scans/[id]` - Get specific scan
- `DELETE /api/scans/[id]` - Delete scan

### Payment Endpoints

- `POST /api/payments/create-checkout-session` - Create Stripe checkout
- `POST /api/payments/webhook` - Stripe webhook handler

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.labelcompliance.com](https://docs.labelcompliance.com)
- **Email**: support@labelcompliance.com
- **Discord**: [Join our community](https://discord.gg/labelcompliance)

## 🗺 Roadmap

### Phase 1 (Current)
- [x] Basic authentication and user management
- [x] Modern UI/UX design
- [x] Database schema and setup
- [ ] File upload and OCR integration
- [ ] Basic compliance checking

### Phase 2 (Next 2 months)
- [ ] Advanced compliance rules engine
- [ ] Payment integration and subscription management
- [ ] Comprehensive results reporting
- [ ] Team collaboration features

### Phase 3 (Future)
- [ ] Amazon Seller Central integration
- [ ] Mobile app (iOS/Android)
- [ ] API access for enterprise customers
- [ ] Advanced analytics and insights

---

**Built with ❤️ for Amazon sellers worldwide**



