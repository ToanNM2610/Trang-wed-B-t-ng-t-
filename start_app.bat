@echo off
chcp 65001 >nul
title LexiMatrix - Tra cuu Dong tu Bat quy tac va Ma tran 12 Thi
cd /d "%~dp0"
echo ===================================================================
echo     KHOI DONG UNG DUNG LEXIMATRIX
echo ===================================================================
echo.
echo Dang mo trinh duyet tai dia chi http://localhost:5173 ...
start "" "http://localhost:5173"
echo.
echo Nhan Ctrl + C de dung may chu local.
npx serve -l 5173 .
pause

