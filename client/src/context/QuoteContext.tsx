import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

export interface QuoteTrayItem {
  id: string
  slug?: string
  sku?: string
  name: string
  brand?: string
  category?: string
  isConsumable?: boolean
  imageUrl?: string
  quantity: number
  notes?: string
}

export interface QuoteContextValue {
  selectedItems: QuoteTrayItem[]
  itemCount: number
  uniqueCount: number
  addItem: (item: Omit<QuoteTrayItem, 'quantity'> & { quantity?: number }) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearTray: () => void
  isInTray: (id: string) => boolean
}

const STORAGE_KEY = 'sudabelt_quote_tray_v1'

const QuoteContext = createContext<QuoteContextValue | undefined>(undefined)

const loadStoredTray = (): QuoteTrayItem[] => {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as QuoteTrayItem[]) : []
  } catch {
    return []
  }
}

export const QuoteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedItems, setSelectedItems] = useState<QuoteTrayItem[]>(loadStoredTray)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedItems))
    } catch {
      // Ignore storage quota errors in restricted environments
    }
  }, [selectedItems])

  const addItem = (item: Omit<QuoteTrayItem, 'quantity'> & { quantity?: number }) => {
    const addQty = Math.max(1, item.quantity ?? 1)
    setSelectedItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.id === item.id)
      if (existingIndex > -1) {
        const updated = [...prev]
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + addQty,
        }
        return updated
      }
      return [...prev, { ...item, quantity: addQty }]
    })
  }

  const removeItem = (id: string) => {
    setSelectedItems((prev) => prev.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    setSelectedItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    )
  }

  const clearTray = () => {
    setSelectedItems([])
  }

  const isInTray = (id: string): boolean => {
    return selectedItems.some((item) => item.id === id)
  }

  const itemCount = useMemo(
    () => selectedItems.reduce((sum, item) => sum + item.quantity, 0),
    [selectedItems]
  )

  const uniqueCount = selectedItems.length

  const value = useMemo<QuoteContextValue>(
    () => ({
      selectedItems,
      itemCount,
      uniqueCount,
      addItem,
      removeItem,
      updateQuantity,
      clearTray,
      isInTray,
    }),
    [selectedItems, itemCount, uniqueCount]
  )

  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>
}

export const useQuote = (): QuoteContextValue => {
  const context = useContext(QuoteContext)
  if (!context) {
    throw new Error('useQuote must be used within a QuoteProvider')
  }
  return context
}

export default QuoteProvider
