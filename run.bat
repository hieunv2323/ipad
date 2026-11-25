@echo off
chcp 65001 >nul
echo ===================================================
echo   🍌 BANANA IPAD STORE - KHỞI ĐỘNG HỆ THỐNG
echo ===================================================
echo [1/2] Đang mở cửa sổ Backend (Spring Boot :8080)...
start "Banana Backend - Spring Boot" cmd /k "cd /d "%~dp0backend-springboot" && java -XX:TieredStopAtLevel=1 -Xms256m -Xmx512m -Dfile.encoding=UTF-8 -jar target\banana-ipad-store-backend-1.0.0.jar"

echo [2/2] Đang mở cửa sổ Frontend (Angular :4200)...
start "Banana Frontend - Angular" cmd /k "cd /d "%~dp0frontend" && npm start"

echo.
echo ===================================================
echo   🚀 Hệ thống đang chạy!
echo   👉 Website: http://localhost:4200
echo   👉 Backend API: http://localhost:8080
echo ===================================================

