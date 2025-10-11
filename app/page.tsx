import { HeroSection } from '@/components/sections/HeroSection'
import { FeaturesSection } from '@/components/sections/FeaturesSection'
import { MarketplacesSection } from '@/components/sections/MarketplacesSection'
import { ProcessSection } from '@/components/sections/ProcessSection'
import { PricingSection } from '@/components/sections/PricingSection'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'
import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Navigation />
      
      <main>
        <HeroSection />
        <FeaturesSection />
        <MarketplacesSection />
        <ProcessSection />
        <PricingSection />
        <TestimonialsSection />
      </main>
      
      <Footer />
    </div>
  )
}
