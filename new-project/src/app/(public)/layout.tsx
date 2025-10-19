import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      {/* Add padding-top to account for fixed navigation */}
      <div className="pt-16">
        {children}
      </div>
      <Footer />
    </div>
  )
}
