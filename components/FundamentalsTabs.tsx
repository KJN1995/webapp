'use client'

import { useState, useEffect } from 'react'

interface FundamentalsData {
  fundamentals: any
  scoring: any
  risk: any
  symbol: string
}

interface FundamentalsTabsProps {
  symbol: string
}

export default function FundamentalsTabs({ symbol }: FundamentalsTabsProps) {
  const [data, setData] = useState<FundamentalsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const fetchFundamentals = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`/api/fundamentals?symbol=${symbol}`)
        if (!response.ok) {
          throw new Error('Failed to fetch fundamentals')
        }
        
        const result = await response.json()
        
        if (result.error) {
          throw new Error(result.error)
        }
        
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    if (symbol) {
      fetchFundamentals()
    }
  }, [symbol])

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'valuation', label: 'Valuation' },
    { id: 'profitability', label: 'Profitability' },
    { id: 'growth', label: 'Growth' },
    { id: 'risk', label: 'Risk' },
  ]

  const formatNumber = (value: any) => {
    if (value === null || value === undefined) return 'N/A'
    if (typeof value === 'number') {
      if (value < 0.01 && value > 0) return (value * 100).toFixed(2) + '%'
      if (value < 1) return (value * 100).toFixed(1) + '%'
      return value.toFixed(2)
    }
    return String(value)
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="flex space-x-4 mb-6">
            {tabs.map((tab) => (
              <div key={tab.id} className="h-8 bg-gray-200 rounded w-20"></div>
            ))}
          </div>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
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
        <div className="text-red-500">Error loading fundamentals: {error}</div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-gray-500">No fundamentals data available</div>
      </div>
    )
  }

  const renderTabContent = () => {
    const fundamentals = data.fundamentals || {}
    const scoring = data.scoring || {}
    const risk = data.risk || {}

    switch (activeTab) {
      case 'overview':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded">
              <h4 className="font-medium mb-2">Company</h4>
              <p className="text-sm text-gray-600">{fundamentals.company_name || symbol}</p>
              <p className="text-sm text-gray-500">{fundamentals.sector} - {fundamentals.industry}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded">
              <h4 className="font-medium mb-2">Overall Score</h4>
              <div className="text-2xl font-bold text-blue-600">{formatNumber(scoring.combined_score)}/100</div>
              <p className="text-sm text-gray-500">{scoring.recommendation || 'N/A'}</p>
            </div>
          </div>
        )

      case 'valuation':
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded">
              <h4 className="font-medium mb-1">P/E Ratio</h4>
              <div className="text-lg font-semibold">{formatNumber(fundamentals.pe)}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded">
              <h4 className="font-medium mb-1">Forward P/E</h4>
              <div className="text-lg font-semibold">{formatNumber(fundamentals.forward_pe)}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded">
              <h4 className="font-medium mb-1">P/B Ratio</h4>
              <div className="text-lg font-semibold">{formatNumber(fundamentals.pb)}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded">
              <h4 className="font-medium mb-1">Market Cap</h4>
              <div className="text-lg font-semibold">{fundamentals.market_cap ? `$${(fundamentals.market_cap / 1e9).toFixed(1)}B` : 'N/A'}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded">
              <h4 className="font-medium mb-1">EV/EBITDA</h4>
              <div className="text-lg font-semibold">{formatNumber(fundamentals.ev_ebitda)}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded">
              <h4 className="font-medium mb-1">Price/Sales</h4>
              <div className="text-lg font-semibold">{formatNumber(fundamentals.price_sales)}</div>
            </div>
          </div>
        )

      case 'profitability':
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded">
              <h4 className="font-medium mb-1">ROE</h4>
              <div className="text-lg font-semibold">{formatNumber(fundamentals.roe)}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded">
              <h4 className="font-medium mb-1">ROIC</h4>
              <div className="text-lg font-semibold">{formatNumber(fundamentals.roic)}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded">
              <h4 className="font-medium mb-1">Net Margin</h4>
              <div className="text-lg font-semibold">{formatNumber(fundamentals.net_margin)}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded">
              <h4 className="font-medium mb-1">Gross Margin</h4>
              <div className="text-lg font-semibold">{formatNumber(fundamentals.gross_margin)}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded">
              <h4 className="font-medium mb-1">Operating Margin</h4>
              <div className="text-lg font-semibold">{formatNumber(fundamentals.operating_margin)}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded">
              <h4 className="font-medium mb-1">FCF Yield</h4>
              <div className="text-lg font-semibold">{formatNumber(fundamentals.fcf_yield)}</div>
            </div>
          </div>
        )

      case 'growth':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded">
              <h4 className="font-medium mb-1">Revenue CAGR (5Y)</h4>
              <div className="text-lg font-semibold">{formatNumber(fundamentals.revenue_cagr_5y)}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded">
              <h4 className="font-medium mb-1">Earnings CAGR (5Y)</h4>
              <div className="text-lg font-semibold">{formatNumber(fundamentals.earnings_cagr_5y)}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded">
              <h4 className="font-medium mb-1">Revenue Growth</h4>
              <div className="text-lg font-semibold">{formatNumber(fundamentals.revenue_growth)}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded">
              <h4 className="font-medium mb-1">Earnings Growth</h4>
              <div className="text-lg font-semibold">{formatNumber(fundamentals.earnings_growth)}</div>
            </div>
          </div>
        )

      case 'risk':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded">
                <h4 className="font-medium mb-1">Beta</h4>
                <div className="text-lg font-semibold">{formatNumber(fundamentals.beta)}</div>
              </div>
              <div className="p-4 bg-gray-50 rounded">
                <h4 className="font-medium mb-1">Debt/Equity</h4>
                <div className="text-lg font-semibold">{formatNumber(fundamentals.debt_to_equity)}</div>
              </div>
              <div className="p-4 bg-gray-50 rounded">
                <h4 className="font-medium mb-1">Current Ratio</h4>
                <div className="text-lg font-semibold">{formatNumber(fundamentals.current_ratio)}</div>
              </div>
            </div>
            {risk.risk_summary && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                <h4 className="font-medium mb-2 text-yellow-800">Risk Assessment</h4>
                <p className="text-sm text-yellow-700">{risk.risk_summary}</p>
              </div>
            )}
          </div>
        )

      default:
        return <div>Select a tab</div>
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {renderTabContent()}
      </div>
    </div>
  )
}