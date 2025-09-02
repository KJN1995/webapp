'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'

interface Favorite {
  id: string
  symbol: string
  createdAt: string
}

interface FavoritesWidgetProps {
  favorites: Favorite[]
}

export default function FavoritesWidget({ favorites: initialFavorites }: FavoritesWidgetProps) {
  const [favorites, setFavorites] = useState(initialFavorites)

  const removeFavorite = async (symbol: string) => {
    try {
      const response = await fetch(`/api/favorites/${symbol}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setFavorites(favorites.filter(f => f.symbol !== symbol))
      }
    } catch (error) {
      console.error('Failed to remove favorite:', error)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <Heart className="h-5 w-5 text-red-500" />
        <h2 className="text-xl font-semibold">Favorites</h2>
      </div>

      <div className="space-y-2">
        {favorites.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            No favorites yet. Heart stocks to add them here!
          </div>
        ) : (
          favorites.map((favorite) => (
            <div key={favorite.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
              <a
                href={`/symbol/${favorite.symbol}`}
                className="font-medium text-blue-600 hover:text-blue-800"
              >
                {favorite.symbol}
              </a>
              <button
                onClick={() => removeFavorite(favorite.symbol)}
                className="text-gray-400 hover:text-red-500"
              >
                <Heart className="h-4 w-4 fill-current" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}