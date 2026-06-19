@echo off
echo ========================================
echo   LINKBRIDGE - FIRST TIME SETUP
echo ========================================
echo   This will create the admin user
echo ========================================
echo.

REM Kill any existing processes
echo [1/6] Cleaning up existing processes...
taskkill /F /IM mongod.exe >nul 2>&1
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 >nul

REM Create mongodb-data folder if it doesn't exist
if not exist "mongodb-data" (
    echo [2/6] Creating MongoDB data directory...
    mkdir mongodb-data
) else (
    echo [2/6] MongoDB data directory exists...
)

REM Start MongoDB
echo [3/6] Starting MongoDB...
start "MongoDB" "C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe" --dbpath "%cd%\mongodb-data" --bind_ip 127.0.0.1 --port 27017

REM Wait for MongoDB to be ready
echo [4/6] Waiting for MongoDB to start...
timeout /t 8 >nul

REM Seed the database
echo [5/6] Creating admin user...
cd server
call node seed.js
cd ..

echo.
echo [6/6] Starting all services...
timeout /t 2 >nul

REM Start Backend Server
cd server
start "Backend Server" cmd /k "npm start"
cd ..

REM Wait for backend to initialize
timeout /t 3 >nul

REM Start Frontend
cd client
start "Frontend" cmd /k "npm run dev"
cd ..

echo.
echo ========================================
echo   SETUP COMPLETE!
echo ========================================
echo   Admin Login: http://localhost:5173/admin/login
echo   Email: saad@gmail.com
echo   Password: saad12345
echo ========================================
echo.
echo Press any key to exit this window...
pause >nul
