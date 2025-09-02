@echo off
echo Starting Stock Analysis Web App...
echo.

echo Step 1: Installing dependencies...
call npm install
if errorlevel 1 (
    echo Error installing dependencies!
    pause
    exit /b 1
)

echo.
echo Step 2: Setting up environment...
if not exist .env (
    copy .env.example .env
    echo Created .env file from template
    echo Please edit .env file with your database settings
    echo For now, using SQLite as default database
    echo.
)

echo Step 3: Setting up database...
call npm run db:generate
if errorlevel 1 (
    echo Error generating Prisma client!
    pause
    exit /b 1
)

echo.
echo Step 4: Starting development server...
echo Opening http://localhost:3000 in your browser...
start http://localhost:3000
call npm run dev

pause