
@echo off
title SafeNet AI Launcher

echo ====================================
echo       SAFENET AI WEBSITE
echo ====================================

echo Starting Backend...
start "SafeNet AI Backend" cmd /k "cd /d C:\Users\MEGHANA\OneDrive\desktop\safetynet\backend && venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000"

timeout /t 3 /nobreak >nul

echo Starting Frontend...
start "SafeNet AI Frontend" cmd /k "cd /d C:\Users\MEGHANA\OneDrive\desktop\safetynet\frontend && npm run dev"

timeout /t 5 /nobreak >nul

echo Opening SafeNet AI Website...
start http://localhost:5173/

echo SafeNet AI started!
