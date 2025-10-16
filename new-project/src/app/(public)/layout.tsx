export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      {/* Public Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-bold">Product Label Checker</h1>
        </div>
      </header>
      {children}
      {/* Public Footer */}
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-600">
          © 2025 Product Label Checker. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

