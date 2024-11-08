@echo off

IF NOT EXIST "node_modules" (
    echo "SCRIPT HECHA POR ERICK PAJARES"
    echo.  & REM Salto de línea
    echo "Instalando las dependencias necesarias..."
    echo.  & REM Salto de línea
    npm install
    echo.  & REM Salto de línea
    echo.  & REM Salto de línea
    echo "Instalación finalizada"
    echo.  & REM Salto de línea
    pause
    cls
    echo "SCRIPT HECHA POR ERICK PAJARES"
    echo.  & REM Salto de línea
    node index.js
    echo.  & REM Salto de línea
    pause
) ELSE (
    echo "SCRIPT HECHA POR ERICK PAJARES"
    echo.  & REM Salto de línea
    node index.js
    echo.  & REM Salto de línea
    pause
)