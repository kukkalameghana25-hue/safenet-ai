
@echo off
title SafeNet AI Launcher

echo ========================================
echo          SAFENET AI WEBSITE
echo ========================================

cd /d "%~dp0"

echo.
echo Checking project folders...

if not exist "backend\main.py" (
    echo ERROR: Backend main.py not found!
    pause
    exit /b 1
)

if not exist "backend\venv\Scripts\python.exe" (
    echo ERROR: Backend virtual environment not found!
    pause
    exit /b 1
)

if not exist "frontend\package.json" (
    echo ERROR: Frontend package.json not found!
    pause
    exit /b 1
)

echo Starting Backend...
start "SafeNet AI Backend" cmd /k "cd /d ""%~dp0backend"" && ""venv\Scripts\python.exe"" -m uvicorn main:app --reload --port 8000"

timeout /t 4 /nobreak >nul

echo Starting Frontend...
start "SafeNet AI Frontend" cmd /k "cd /d ""%~dp0frontend"" && npm run dev"

timeout /t 6 /nobreak >nul

echo Opening SafeNet AI...
start "" http://localhost:5173/

echo.
echo SafeNet AI launcher completed!
echo Keep both server windows open while using the website.
pause
