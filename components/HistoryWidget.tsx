'use client'

import { Clock } from 'lucide-react'

interface HistoryItem {
  id: string
  symbol: string
  viewedAt: string
}

interface HistoryWidgetProps {
  history: HistoryItem[]
}

export default function HistoryWidget({ history }: HistoryWidgetProps) {
  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diff = now.getTime() - date.getTime()
      
      const minutes = Math.floor(diff / 60000)
      const hours = Math.floor(diff / 3600000)
      const days = Math.floor(diff / 86400000)
      
      if (minutes < 60) return `${minutes}m ago`
      if (hours < 24) return `${hours}h ago`
      return `${days}d ago`
    } catch {
      return 'Recently'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5 text-gray-500" />
        <h2 className="text-xl font-semibold">Recent Views</h2>
      </div>

      <div className="space-y-2">
        {history.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            No recent views yet. Start exploring stocks!
          </div>
        ) : (
          history.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
              <a
                href={`/symbol/${item.symbol}`}
                className="font-medium text-blue-600 hover:text-blue-800"
              >
                {item.symbol}
              </a>
              <span className="text-sm text-gray-500">
                {formatTime(item.viewedAt)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}