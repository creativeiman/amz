"use client"

import * as React from "react"
import { ScanSearch, CreditCard, Users, LayoutDashboard, ChevronUp, LogOut, UserCircle, Building2 } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSession, signOut } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"

interface MenuItem {
  title: string
  url: string
  icon: React.ComponentType<{ className?: string }>
  ownerOnly?: boolean
}

const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Scans",
    url: "/dashboard/scans",
    icon: ScanSearch,
  },
  {
    title: "Billing",
    url: "/dashboard/billing",
    icon: CreditCard,
    ownerOnly: true,
  },
  {
    title: "Team",
    url: "/dashboard/team",
    icon: Users,
    ownerOnly: true,
  },
  {
    title: "Account Settings",
    url: "/dashboard/settings/account",
    icon: Building2,
    ownerOnly: true,
  },
  {
    title: "Profile",
    url: "/dashboard/settings/profile",
    icon: UserCircle,
  },
]

// Helper function to get plan badge color and label
function getPlanBadge(plan: string) {
  switch (plan) {
    case 'DELUXE':
      return { label: 'Deluxe', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' }
    case 'ONE_TIME':
      return { label: 'One-Time', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' }
    case 'FREE':
    default:
      return { label: 'Free', color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' }
  }
}

// Helper function to get user initials
function getUserInitials(name: string | null | undefined) {
  if (!name) return 'U'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function DashboardSidebar() {
  const { data: session } = useSession()
  const user = session?.user
  const [accountName, setAccountName] = React.useState<string | null>(null)

  const planBadge = getPlanBadge(user?.plan || 'FREE')
  
  // Check if user is an account owner by checking if they have the "isOwner" flag
  // This will be added to the session in the auth callback
  const isAccountOwner = Boolean((user as { isOwner?: boolean })?.isOwner)

  // Fetch account name (refetch when session changes)
  React.useEffect(() => {
    async function fetchAccountName() {
      try {
        const response = await fetch("/dashboard/api/account")
        if (response.ok) {
          const data = await response.json()
          setAccountName(data.account.name)
        }
      } catch (error) {
        console.error("Error fetching account name:", error)
      }
    }

    if (session) {
      fetchAccountName()
    }
  }, [session])

  // Filter menu items based on user role
  const visibleMenuItems = menuItems.filter((item) => {
    // Only show owner-only items to account owners
    if (item.ownerOnly) {
      return isAccountOwner
    }
    return true
  })

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-semibold truncate">
                {accountName || 'Loading...'}
              </h2>
              <p className="text-xs text-muted-foreground">Workspace</p>
            </div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user?.image || ''} alt={user?.name || ''} />
                    <AvatarFallback className="rounded-lg">
                      {getUserInitials(user?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user?.name || 'User'}</span>
                    <span className="truncate text-xs">{user?.email || ''}</span>
                  </div>
                  <ChevronUp className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="top"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={user?.image || ''} alt={user?.name || ''} />
                      <AvatarFallback className="rounded-lg">
                        {getUserInitials(user?.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{user?.name || 'User'}</span>
                      <span className="truncate text-xs">{user?.email || ''}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Current Plan</span>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${planBadge.color}`}>
                    {planBadge.label}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <ThemeToggle />
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
                  onClick={() => signOut({ callbackUrl: '/login' })}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

