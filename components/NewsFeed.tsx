'use client'

import { useState, useEffect } from 'react'
import { ExternalLink } from 'lucide-react'

interface NewsArticle {
  title: string
  description?: string
  summary?: string
  url: string
  source: string
  published_at: string
  image?: string
  category?: string
}

interface NewsData {
  articles: NewsArticle[]
  summary?: string
  sentiment?: number
  sentiment_label?: string
}

interface NewsFeedProps {
  symbol: string
}

export default function NewsFeed({ symbol }: NewsFeedProps) {
  const [newsData, setNewsData] = useState<NewsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`/api/news?symbol=${symbol}`)
        if (!response.ok) {
          throw new Error('Failed to fetch news')
        }
        
        const result = await response.json()
        
        if (result.error) {
          throw new Error(result.error)
        }
        
        setNewsData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    if (symbol) {
      fetchNews()
    }
  }, [symbol])

  const getSentimentColor = (sentiment: number | undefined) => {
    if (!sentiment) return 'text-gray-500'
    if (sentiment > 0.6) return 'text-green-600'
    if (sentiment < 0.4) return 'text-red-600'
    return 'text-yellow-600'
  }

  const getSentimentLabel = (sentiment: number | undefined) => {
    if (!sentiment) return 'Neutral'
    if (sentiment > 0.6) return 'Positive'
    if (sentiment < 0.4) return 'Negative'
    return 'Neutral'
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return dateString
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">News & Sentiment</h2>
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">News & Sentiment</h2>
        <div className="text-red-500">Error loading news: {error}</div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">News & Sentiment</h2>

      {/* Sentiment Summary */}
      {newsData?.sentiment !== undefined && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">Market Sentiment</h3>
            <span className={`font-semibold ${getSentimentColor(newsData.sentiment)}`}>
              {getSentimentLabel(newsData.sentiment)}
            </span>
          </div>
          {newsData.summary && (
            <p className="text-sm text-gray-600">{newsData.summary}</p>
          )}
        </div>
      )}

      {/* News Articles */}
      <div className="space-y-4">
        {newsData?.articles?.slice(0, 10).map((article, index) => (
          <article key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
            <h3 className="font-medium text-gray-900 mb-1 leading-tight">
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 flex items-start gap-1"
              >
                {article.title}
                <ExternalLink className="h-3 w-3 mt-1 flex-shrink-0" />
              </a>
            </h3>
            
            {(article.description || article.summary) && (
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {article.description || article.summary}
              </p>
            )}
            
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>{article.source}</span>
              <span>{formatDate(article.published_at)}</span>
            </div>
          </article>
        )) || (
          <div className="text-gray-500 text-center py-8">
            No news articles available
          </div>
        )}
      </div>
    </div>
  )
}