'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'

interface WatchlistItem {
  id: string
  symbol: string
  note?: string
}

interface Watchlist {
  id: string
  name: string
  items: WatchlistItem[]
  createdAt: string
}

interface WatchlistWidgetProps {
  watchlists: Watchlist[]
}

export default function WatchlistWidget({ watchlists: initialWatchlists }: WatchlistWidgetProps) {
  const [watchlists, setWatchlists] = useState(initialWatchlists)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newWatchlistName, setNewWatchlistName] = useState('')

  const createWatchlist = async () => {
    if (!newWatchlistName.trim()) return

    try {
      const response = await fetch('/api/watchlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newWatchlistName.trim() }),
      })

      if (response.ok) {
        const { watchlist } = await response.json()
        setWatchlists([watchlist, ...watchlists])
        setNewWatchlistName('')
        setShowCreateForm(false)
      }
    } catch (error) {
      console.error('Failed to create watchlist:', error)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Watchlists</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="p-2 text-gray-400 hover:text-gray-600"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {showCreateForm && (
        <div className="mb-4 p-3 bg-gray-50 rounded">
          <input
            type="text"
            value={newWatchlistName}
            onChange={(e) => setNewWatchlistName(e.target.value)}
            placeholder="Watchlist name"
            className="w-full p-2 border rounded mb-2"
            onKeyDown={(e) => e.key === 'Enter' && createWatchlist()}
          />
          <div className="flex gap-2">
            <button
              onClick={createWatchlist}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
            >
              Create
            </button>
            <button
              onClick={() => {
                setShowCreateForm(false)
                setNewWatchlistName('')
              }}
              className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {watchlists.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            No watchlists yet. Create your first one!
          </div>
        ) : (
          watchlists.map((watchlist) => (
            <div key={watchlist.id} className="border border-gray-200 rounded p-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{watchlist.name}</h3>
                <span className="text-sm text-gray-500">
                  {watchlist.items.length} stocks
                </span>
              </div>
              
              {watchlist.items.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {watchlist.items.slice(0, 5).map((item) => (
                    <a
                      key={item.id}
                      href={`/symbol/${item.symbol}`}
                      className="px-2 py-1 bg-gray-100 rounded text-sm hover:bg-gray-200"
                    >
                      {item.symbol}
                    </a>
                  ))}
                  {watchlist.items.length > 5 && (
                    <span className="px-2 py-1 text-sm text-gray-500">
                      +{watchlist.items.length - 5} more
                    </span>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}