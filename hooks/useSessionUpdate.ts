'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export function useSessionUpdate() {
  const { data: session, update } = useSession()
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    if (session?.user) {
      setUserData(session.user)
    }
  }, [session])

  // Listen for session updates from other components
  useEffect(() => {
    const handleSessionUpdate = (event: CustomEvent) => {
      setUserData(event.detail.user)
    }

    window.addEventListener('sessionUpdate', handleSessionUpdate as EventListener)
    
    return () => {
      window.removeEventListener('sessionUpdate', handleSessionUpdate as EventListener)
    }
  }, [])

  const currentUser = userData || session?.user

  return {
    session,
    currentUser,
    update
  }
}



