@echo off
chcp 65001 >nul
cd /d "%~dp0backend-springboot"
java -Dfile.encoding=UTF-8 -jar target\banana-ipad-store-backend-1.0.0.jar
