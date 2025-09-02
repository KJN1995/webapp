'use client'

import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, CandlestickChart } from 'recharts'

interface CandleData {
  t: number
  o: number
  h: number
  l: number
  c: number
  v: number
}

interface ChartProps {
  symbol: string
  range?: '1D' | '1W' | '1M' | '6M' | '1Y' | '5Y'
  type?: 'line' | 'candlestick'
}

interface ChartDataPoint {
  date: string
  timestamp: number
  price: number
  open?: number
  high?: number
  low?: number
  close?: number
  volume?: number
}

export default function Chart({ symbol, range = '1Y', type = 'line' }: ChartProps) {
  const [data, setData] = useState<ChartDataPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedRange, setSelectedRange] = useState(range)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`/api/ohlc?symbol=${symbol}&range=${selectedRange}`)
        if (!response.ok) {
          throw new Error('Failed to fetch chart data')
        }
        
        const result = await response.json()
        
        if (result.error) {
          throw new Error(result.error)
        }
        
        // Transform the data for Recharts
        const chartData: ChartDataPoint[] = result.candles?.map((candle: CandleData) => ({
          date: new Date(candle.t * 1000).toLocaleDateString(),
          timestamp: candle.t,
          price: candle.c,
          open: candle.o,
          high: candle.h,
          low: candle.l,
          close: candle.c,
          volume: candle.v,
        })) || []
        
        setData(chartData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    if (symbol) {
      fetchData()
    }
  }, [symbol, selectedRange])

  const ranges = ['1D', '1W', '1M', '6M', '1Y', '5Y'] as const

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="text-gray-500">Loading chart...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    )
  }

  if (!data.length) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="text-gray-500">No chart data available</div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Range selector */}
      <div className="flex gap-2 mb-4">
        {ranges.map((r) => (
          <button
            key={r}
            onClick={() => setSelectedRange(r)}
            className={`px-3 py-1 text-sm rounded ${
              selectedRange === r
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis 
              domain={['dataMin - 5', 'dataMax + 5']}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              labelFormatter={(label) => `Date: ${label}`}
              formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}