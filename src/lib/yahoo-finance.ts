import { cache } from './redis'

export interface YahooQuoteResponse {
  price: number
  change: number
  changePercent: number
  dayHigh: number
  dayLow: number
  fiftyTwoWeekHigh: number
  fiftyTwoWeekLow: number
  marketCap: number
  volume: number
  avgVolume: number
  pe: number
  eps: number
  dividend: number
  dividendYield: number
  beta: number
  bookValue: number
  priceToBook: number
  trailingAnnualDividendYield: number
}

export interface YahooHistoricalData {
  timestamp: number[]
  open: number[]
  high: number[]
  low: number[]
  close: number[]
  volume: number[]
}

export interface YahooSearchResult {
  symbol: string
  name: string
  exch: string
  type: string
  exchDisp: string
  typeDisp: string
}

export class YahooFinanceAPI {
  private baseUrl = 'https://query1.finance.yahoo.com'
  private headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  }

  async searchSymbols(query: string): Promise<YahooSearchResult[]> {
    const cacheKey = `yahoo_search_${query}`
    const cached = await cache.get<YahooSearchResult[]>(cacheKey)
    if (cached) return cached

    try {
      const url = `${this.baseUrl}/v1/finance/search?q=${encodeURIComponent(query)}&lang=en-US&region=US&quotesCount=15&newsCount=0`
      
      const response = await fetch(url, { headers: this.headers })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      
      const data = await response.json()
      const results = data.quotes?.filter((item: any) => 
        item.isYahooFinance && 
        (item.quoteType === 'EQUITY' || item.quoteType === 'ETF')
      ).map((item: any) => ({
        symbol: item.symbol,
        name: item.longname || item.shortname,
        exch: item.exchange,
        type: item.quoteType,
        exchDisp: item.exchDisp,
        typeDisp: item.typeDisp
      })) || []

      await cache.set(cacheKey, results, 3600) // Cache for 1 hour
      return results
    } catch (error) {
      console.error('Yahoo search error:', error)
      return []
    }
  }

  async getQuote(symbol: string): Promise<YahooQuoteResponse | null> {
    const cacheKey = `yahoo_quote_${symbol}`
    const cached = await cache.get<YahooQuoteResponse>(cacheKey)
    if (cached) return cached

    try {
      const url = `${this.baseUrl}/v8/finance/chart/${symbol}?interval=1d&range=1d&includePrePost=false`
      
      const response = await fetch(url, { headers: this.headers })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      
      const data = await response.json()
      const result = data.chart?.result?.[0]
      
      if (!result) return null

      const meta = result.meta
      const quote: YahooQuoteResponse = {
        price: meta.regularMarketPrice || 0,
        change: meta.regularMarketPrice - meta.previousClose || 0,
        changePercent: ((meta.regularMarketPrice - meta.previousClose) / meta.previousClose * 100) || 0,
        dayHigh: meta.regularMarketDayHigh || 0,
        dayLow: meta.regularMarketDayLow || 0,
        fiftyTwoWeekHigh: meta.fiftyTwoWeekHigh || 0,
        fiftyTwoWeekLow: meta.fiftyTwoWeekLow || 0,
        marketCap: meta.marketCap || 0,
        volume: meta.regularMarketVolume || 0,
        avgVolume: meta.averageDailyVolume10Day || 0,
        pe: 0, // Will be fetched from summary
        eps: 0,
        dividend: 0,
        dividendYield: 0,
        beta: 0,
        bookValue: 0,
        priceToBook: 0,
        trailingAnnualDividendYield: 0
      }

      await cache.set(cacheKey, quote, 60) // Cache for 1 minute
      return quote
    } catch (error) {
      console.error('Yahoo quote error:', error)
      return null
    }
  }

  async getHistoricalData(symbol: string, period: string = '1y', interval: string = '1d'): Promise<YahooHistoricalData | null> {
    const cacheKey = `yahoo_historical_${symbol}_${period}_${interval}`
    const cached = await cache.get<YahooHistoricalData>(cacheKey)
    if (cached) return cached

    try {
      const url = `${this.baseUrl}/v8/finance/chart/${symbol}?interval=${interval}&range=${period}`
      
      const response = await fetch(url, { headers: this.headers })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      
      const data = await response.json()
      const result = data.chart?.result?.[0]
      
      if (!result || !result.timestamp) return null

      const historicalData: YahooHistoricalData = {
        timestamp: result.timestamp,
        open: result.indicators.quote[0].open || [],
        high: result.indicators.quote[0].high || [],
        low: result.indicators.quote[0].low || [],
        close: result.indicators.quote[0].close || [],
        volume: result.indicators.quote[0].volume || []
      }

      const cacheTTL = interval === '1d' ? 3600 : 300 // 1 hour for daily, 5 min for intraday
      await cache.set(cacheKey, historicalData, cacheTTL)
      return historicalData
    } catch (error) {
      console.error('Yahoo historical data error:', error)
      return null
    }
  }

  async getFundamentals(symbol: string): Promise<any> {
    const cacheKey = `yahoo_fundamentals_${symbol}`
    const cached = await cache.get(cacheKey)
    if (cached) return cached

    try {
      const modules = [
        'assetProfile',
        'summaryProfile', 
        'summaryDetail',
        'esgScores',
        'price',
        'incomeStatementHistory',
        'incomeStatementHistoryQuarterly',
        'balanceSheetHistory',
        'balanceSheetHistoryQuarterly',
        'cashflowStatementHistory',
        'cashflowStatementHistoryQuarterly',
        'defaultKeyStatistics',
        'financialData',
        'calendarEvents',
        'secFilings',
        'recommendationTrend',
        'upgradeDowngradeHistory',
        'institutionOwnership',
        'fundOwnership',
        'majorDirectHolders',
        'majorHoldersBreakdown',
        'insiderTransactions',
        'insiderHolders',
        'netSharePurchaseActivity',
        'earnings',
        'earningsHistory',
        'earningsTrend',
        'industryTrend'
      ].join(',')

      const url = `${this.baseUrl}/v10/finance/quoteSummary/${symbol}?modules=${modules}`
      
      const response = await fetch(url, { headers: this.headers })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      
      const data = await response.json()
      const result = data.quoteSummary?.result?.[0]
      
      if (!result) return null

      // Transform to standardized format
      const fundamentals = this.transformFundamentals(result)
      
      await cache.set(cacheKey, fundamentals, 21600) // Cache for 6 hours
      return fundamentals
    } catch (error) {
      console.error('Yahoo fundamentals error:', error)
      return null
    }
  }

  async getNews(symbol: string): Promise<any[]> {
    const cacheKey = `yahoo_news_${symbol}`
    const cached = await cache.get<any[]>(cacheKey)
    if (cached) return cached

    try {
      // Yahoo Finance news endpoint
      const url = `${this.baseUrl}/v1/finance/search?q=${symbol}&lang=en-US&region=US&quotesCount=0&newsCount=20`
      
      const response = await fetch(url, { headers: this.headers })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      
      const data = await response.json()
      const news = data.news?.map((item: any) => ({
        title: item.title,
        summary: item.summary,
        url: item.link,
        source: item.publisher,
        published_at: new Date(item.providerPublishTime * 1000).toISOString(),
        image: item.thumbnail?.resolutions?.[0]?.url
      })) || []

      await cache.set(cacheKey, news, 1800) // Cache for 30 minutes
      return news
    } catch (error) {
      console.error('Yahoo news error:', error)
      return []
    }
  }

  private transformFundamentals(data: any): any {
    const summaryDetail = data.summaryDetail || {}
    const financialData = data.financialData || {}
    const defaultKeyStatistics = data.defaultKeyStatistics || {}
    const assetProfile = data.assetProfile || {}
    const price = data.price || {}
    const earnings = data.earnings || {}

    return {
      // Basic info
      company_name: assetProfile.longName || price.longName,
      sector: assetProfile.sector,
      industry: assetProfile.industry,
      description: assetProfile.longBusinessSummary,
      
      // Price metrics
      price: summaryDetail.regularMarketPrice?.raw,
      market_cap: summaryDetail.marketCap?.raw || price.marketCap?.raw,
      
      // Valuation ratios
      pe: summaryDetail.trailingPE?.raw,
      forward_pe: summaryDetail.forwardPE?.raw,
      pb: defaultKeyStatistics.priceToBook?.raw,
      price_sales: defaultKeyStatistics.priceToSalesTrailing12Months?.raw,
      ev_ebitda: defaultKeyStatistics.enterpriseToEbitda?.raw,
      
      // Profitability
      roe: financialData.returnOnEquity?.raw,
      roa: financialData.returnOnAssets?.raw,
      roic: financialData.returnOnAssets?.raw, // Approximation
      net_margin: financialData.profitMargins?.raw,
      gross_margin: financialData.grossMargins?.raw,
      operating_margin: financialData.operatingMargins?.raw,
      
      // Financial health
      debt_to_equity: financialData.debtToEquity?.raw,
      current_ratio: financialData.currentRatio?.raw,
      quick_ratio: financialData.quickRatio?.raw,
      
      // Growth & returns
      revenue_growth: financialData.revenueGrowth?.raw,
      earnings_growth: financialData.earningsGrowth?.raw,
      revenue_ttm: financialData.totalRevenue?.raw,
      
      // Risk metrics
      beta: defaultKeyStatistics.beta?.raw,
      
      // Dividend info
      dividend_yield: summaryDetail.dividendYield?.raw || summaryDetail.trailingAnnualDividendYield?.raw,
      dividend_rate: summaryDetail.dividendRate?.raw,
      
      // Share metrics
      eps: defaultKeyStatistics.trailingEps?.raw,
      shares_outstanding: defaultKeyStatistics.sharesOutstanding?.raw,
      float_shares: defaultKeyStatistics.floatShares?.raw,
      
      // Trading metrics
      volume: summaryDetail.volume?.raw,
      avg_volume: summaryDetail.averageVolume?.raw,
      
      // 52-week range
      range52w_high: summaryDetail.fiftyTwoWeekHigh?.raw,
      range52w_low: summaryDetail.fiftyTwoWeekLow?.raw,
      
      // Earnings
      next_earnings_date: earnings.earningsChart?.currentQuarterEstimateDate,
      
      // Source tracking
      _sources: ['yahoo_finance'],
      _last_updated: new Date().toISOString()
    }
  }
}

export const yahooFinance = new YahooFinanceAPI()