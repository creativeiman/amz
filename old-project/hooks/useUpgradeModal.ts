'use client'

import { useState, useCallback } from 'react'

export function useUpgradeModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [trigger, setTrigger] = useState<string | undefined>()

  const openUpgradeModal = useCallback((triggerType?: string) => {
    setTrigger(triggerType)
    setIsOpen(true)
  }, [])

  const closeUpgradeModal = useCallback(() => {
    setIsOpen(false)
    setTrigger(undefined)
  }, [])

  const triggerUpgrade = useCallback((triggerType: string) => {
    openUpgradeModal(triggerType)
  }, [openUpgradeModal])

  return {
    isOpen,
    trigger,
    openUpgradeModal,
    closeUpgradeModal,
    triggerUpgrade
  }
}



