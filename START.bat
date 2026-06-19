@echo off
echo ========================================
echo   Starting LINKBRIDGE...
echo ========================================
echo.

REM Kill any existing processes first
echo Cleaning up existing processes...
taskkill /F /IM mongod.exe >nul 2>&1
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 >nul

REM Start MongoDB
echo Starting MongoDB...
start "MongoDB" "C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe" --dbpath "%cd%\mongodb-data" --bind_ip 127.0.0.1 --port 27017

REM Wait for MongoDB
echo Waiting for MongoDB to start...
timeout /t 5 >nul

REM Start Backend
echo Starting Backend Server...
cd server
start "Backend Server" cmd /k "npm start"
cd ..

REM Wait for backend
timeout /t 3 >nul

REM Start Frontend
echo Starting Frontend...
cd client
start "Frontend" cmd /k "npm run dev"
cd ..

echo.
echo ========================================
echo   LINKBRIDGE STARTED!
echo ========================================
echo   Frontend: http://localhost:5173
echo   Backend: http://localhost:5000
echo ========================================
echo.
echo Press any key to exit this window...
pause >nul
