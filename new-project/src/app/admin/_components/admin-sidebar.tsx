"use client"

import { LayoutDashboard, Users, Settings, Shield, ChevronUp, LogOut, Languages } from "lucide-react"
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
import { useTranslation } from "@/hooks/useTranslation"
import { useLanguage, Language } from "@/contexts/LanguageContext"
import { getLanguageName, getLanguageFlag } from "@/lib/translation-loader"

const menuItemsConfig = [
  {
    key: "dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    key: "accounts",
    url: "/admin/accounts",
    icon: Users,
  },
  {
    key: "settings",
    url: "/admin/settings",
    icon: Settings,
  },
]

// Helper function to get role badge color and label
function getRoleBadge(role: string) {
  switch (role) {
    case 'ADMIN':
      return { label: 'Admin', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' }
    case 'USER':
    default:
      return { label: 'User', color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' }
  }
}

// Helper function to get user initials
function getUserInitials(name: string | null | undefined) {
  if (!name) return 'A'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function AdminSidebar() {
  const { data: session } = useSession()
  const user = session?.user
  const { t } = useTranslation('admin-sidebar')
  const { language, setLanguage } = useLanguage()

  const menuItems = menuItemsConfig.map(item => ({
    ...item,
    title: t(`menu.${item.key}`, item.key)
  }))

  const roleBadge = getRoleBadge(user?.role || 'USER')

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-4 py-2 flex items-center gap-2">
          <Shield className="h-5 w-5 text-red-600" />
          <h2 className="text-lg font-semibold">{t('title', 'Admin Panel')}</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t('title', 'Administration')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.key}>
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
                    <AvatarFallback className="rounded-lg bg-red-100 text-red-800">
                      {getUserInitials(user?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user?.name || 'Admin'}</span>
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
                      <AvatarFallback className="rounded-lg bg-red-100 text-red-800">
                        {getUserInitials(user?.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{user?.name || 'Admin'}</span>
                      <span className="truncate text-xs">{user?.email || ''}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{t('user.role', 'Role')}</span>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${roleBadge.color}`}>
                    {t(`user.role.${user?.role?.toLowerCase() || 'user'}`, roleBadge.label)}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>{t('user.adminSettings', 'Admin Settings')}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="flex items-center px-2 py-1.5 text-sm cursor-pointer hover:bg-accent rounded-sm">
                      <Languages className="mr-2 h-4 w-4" />
                      <span className="flex-1">Language</span>
                      <span className="text-xs">{getLanguageFlag(language)}</span>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="right" align="start">
                    {(['en', 'es', 'fr', 'de'] as Language[]).map((lang) => (
                      <DropdownMenuItem
                        key={lang}
                        onClick={() => setLanguage(lang)}
                        className={language === lang ? 'bg-accent' : ''}
                      >
                        <span className="mr-2">{getLanguageFlag(lang)}</span>
                        {getLanguageName(lang)}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenuSeparator />
                <ThemeToggle />
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
                  onClick={() => signOut({ callbackUrl: '/login' })}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t('user.logout', 'Log Out')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

