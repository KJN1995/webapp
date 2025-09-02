# Stock Analysis Web App

A modern Next.js web application that transforms your Python stock analysis tool into an interactive web platform.

## Features

- **Real-time Stock Analysis**: Live quotes, fundamentals, and technical indicators
- **Interactive Charts**: Dynamic price charts with multiple timeframes
- **AI-Powered Insights**: Advanced scoring algorithms and news sentiment analysis
- **User Management**: Watchlists, favorites, and viewing history
- **Responsive Design**: Works seamlessly on desktop and mobile
- **SEO Optimized**: Server-side rendering for fast loading and search visibility

## Tech Stack

- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes with Python integration
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with Google OAuth and email magic links
- **Charts**: Recharts for interactive visualizations
- **Caching**: Redis for performance optimization
- **Monitoring**: Sentry for error tracking and OpenTelemetry for observability

## Getting Started

### Prerequisites

- Node.js 18+ 
- Python 3.8+
- PostgreSQL database
- Redis (optional, for caching)

### Installation

1. **Clone and setup**:
   ```bash
   cd webapp
   npm install
   ```

2. **Environment setup**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Database setup**:
   ```bash
   npm run db:generate
   npm run db:push
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

### Environment Variables

Required variables (see `.env.example`):

- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Random string for NextAuth encryption
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: Google OAuth credentials
- `ALPHA_VANTAGE_API_KEY`: For stock data
- `FINNHUB_API_KEY`: For additional market data
- `NEWSAPI_KEY`: For news aggregation

## API Endpoints

- `GET /api/search?q=AAPL` - Search stock symbols
- `GET /api/quote?symbol=AAPL` - Get stock quote
- `GET /api/ohlc?symbol=AAPL&range=1Y` - Get price history
- `GET /api/fundamentals?symbol=AAPL` - Get fundamental analysis
- `GET /api/news?symbol=AAPL` - Get news and sentiment
- `GET/POST /api/watchlists` - Manage watchlists
- `GET/POST /api/favorites` - Manage favorites

## Architecture

The app integrates your existing Python analysis modules through subprocess calls, ensuring all your sophisticated analysis logic is preserved while providing a modern web interface.

### Key Integration Points

- **Data Providers**: Uses existing `data/providers.py` for market data
- **Analysis Modules**: Calls `analysis/` modules for fundamentals, scoring, risk assessment
- **Caching**: Inherits Python caching plus adds Redis for web-specific caching

## Database Management

```bash
npm run db:studio    # Open Prisma Studio
npm run db:migrate   # Create new migration
npm run db:push      # Push schema changes
```

## Performance Features

- **Server-Side Rendering**: Fast initial page loads
- **Incremental Static Regeneration**: Cached stock pages with automatic updates
- **Redis Caching**: API response caching
- **Python Process Optimization**: Efficient subprocess management
- **Code Splitting**: Optimized bundle sizes
