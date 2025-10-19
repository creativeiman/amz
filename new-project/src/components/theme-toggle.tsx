'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // useEffect only runs on the client, so now we can safely show the UI
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <DropdownMenuItem disabled>
        <Sun className="mr-2 h-4 w-4" />
        <span>Loading theme...</span>
      </DropdownMenuItem>
    )
  }

  const isDark = theme === 'dark'
  const isLight = theme === 'light'

  return (
    <DropdownMenuItem
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="cursor-pointer group"
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          {isDark ? (
            <>
              <Sun className="mr-2 h-4 w-4 text-yellow-500" />
              <span>Switch to Light</span>
            </>
          ) : (
            <>
              <Moon className="mr-2 h-4 w-4 text-blue-500" />
              <span>Switch to Dark</span>
            </>
          )}
        </div>
        <div className="ml-2 text-xs text-muted-foreground">
          {isDark ? (
            <Moon className="h-3 w-3 opacity-50" />
          ) : (
            <Sun className="h-3 w-3 opacity-50" />
          )}
        </div>
      </div>
    </DropdownMenuItem>
  )
}

