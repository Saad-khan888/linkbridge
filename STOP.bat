@echo off
echo ========================================
echo   Stopping LINKBRIDGE...
echo ========================================
echo.

echo Stopping all services...
taskkill /F /IM mongod.exe >nul 2>&1
taskkill /F /IM node.exe >nul 2>&1

echo.
echo ========================================
echo   LINKBRIDGE STOPPED!
echo ========================================
echo.
echo Press any key to exit...
pause >nul
