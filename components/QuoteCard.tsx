'use client'

import { useState, useEffect } from 'react'

interface QuoteData {
  price: number | null
  change: number | null
  changePct: number | null
  marketCap: number | null
  pe: number | null
  range52w: {
    low: number | null
    high: number | null
  }
  lastUpdated: string
}

interface QuoteCardProps {
  symbol: string
}

export default function QuoteCard({ symbol }: QuoteCardProps) {
  const [quote, setQuote] = useState<QuoteData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchQuote = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`/api/quote?symbol=${symbol}`)
        if (!response.ok) {
          throw new Error('Failed to fetch quote')
        }
        
        const data = await response.json()
        
        if (data.error) {
          throw new Error(data.error)
        }
        
        setQuote(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    if (symbol) {
      fetchQuote()
    }
  }, [symbol])

  const formatCurrency = (value: number | null) => {
    if (value === null) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value)
  }

  const formatNumber = (value: number | null) => {
    if (value === null) return 'N/A'
    return new Intl.NumberFormat('en-US').format(value)
  }

  const formatMarketCap = (value: number | null) => {
    if (value === null) return 'N/A'
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
    return formatCurrency(value)
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-red-500">Error loading quote: {error}</div>
      </div>
    )
  }

  if (!quote) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-gray-500">No quote data available</div>
      </div>
    )
  }

  const isPositive = (quote.change || 0) >= 0

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{symbol}</h1>
        <div className="text-right">
          <div className="text-3xl font-bold text-gray-900">
            {formatCurrency(quote.price)}
          </div>
          <div className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}{quote.change?.toFixed(2) || 'N/A'} 
            ({isPositive ? '+' : ''}{quote.changePct?.toFixed(2) || 'N/A'}%)
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-3 bg-gray-50 rounded">
          <div className="text-sm text-gray-500 mb-1">Market Cap</div>
          <div className="font-semibold">{formatMarketCap(quote.marketCap)}</div>
        </div>
        
        <div className="text-center p-3 bg-gray-50 rounded">
          <div className="text-sm text-gray-500 mb-1">P/E Ratio</div>
          <div className="font-semibold">{quote.pe?.toFixed(2) || 'N/A'}</div>
        </div>
        
        <div className="text-center p-3 bg-gray-50 rounded">
          <div className="text-sm text-gray-500 mb-1">52W Low</div>
          <div className="font-semibold">{formatCurrency(quote.range52w.low)}</div>
        </div>
        
        <div className="text-center p-3 bg-gray-50 rounded">
          <div className="text-sm text-gray-500 mb-1">52W High</div>
          <div className="font-semibold">{formatCurrency(quote.range52w.high)}</div>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-400">
        Last updated: {new Date(quote.lastUpdated).toLocaleString()}
      </div>
    </div>
  )
}