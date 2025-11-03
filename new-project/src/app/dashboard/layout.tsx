import Image from "next/image"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { DashboardSidebar } from "./_components/dashboard-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <div className="flex items-center gap-2">
            <Image
              src="/plabiq-logo-black.png"
              alt="PlabIQ"
              width={100}
              height={33}
              priority
              className="h-7 w-auto dark:hidden"
            />
            <Image
              src="/plabiq-logo-white.png"
              alt="PlabIQ"
              width={100}
              height={33}
              priority
              className="h-7 w-auto hidden dark:block"
            />
          </div>
        </header>
        <main className="flex-1 p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

