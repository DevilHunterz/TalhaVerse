@echo off
echo ========================================
echo TalhaVerse Quick Start
echo ========================================
echo.

echo Checking if dependencies are installed...
echo.

cd backend
if not exist "node_modules" (
    echo Installing backend dependencies...
    call npm install
) else (
    echo Backend dependencies already installed.
)
echo.

cd ..\frontend
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
) else (
    echo Frontend dependencies already installed.
)
echo.

cd ..

echo ========================================
echo Starting TalhaVerse...
echo ========================================
echo.
echo Backend will start on: http://localhost:5000
echo Frontend will start on: http://localhost:5173
echo.
echo Press Ctrl+C to stop the servers
echo.

start "TalhaVerse Backend" cmd /k "cd backend && npm start"
timeout /t 3 /nobreak >nul
start "TalhaVerse Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo TalhaVerse is starting!
echo ========================================
echo.
echo Open your browser and go to: http://localhost:5173
echo.
