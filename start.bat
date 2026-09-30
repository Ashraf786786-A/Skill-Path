@echo off
title SkillPath Launcher
cls

echo ==============================================================================
echo                      SKILLPATH APPLICATION LAUNCHER                           
echo          Evidence-Based Career Recommendation and Audit System                
echo ==============================================================================
echo.

pushd "%~dp0"
set "CURR=%CD%"
popd

if exist "%CURR%\backend\main.py" (
    set "BACKEND_DIR=%CURR%\backend"
    set "FRONTEND_DIR=%CURR%"
) else if exist "%CURR%\Skill-Path-main\backend\main.py" (
    set "BACKEND_DIR=%CURR%\Skill-Path-main\backend"
    set "FRONTEND_DIR=%CURR%\Skill-Path-main"
) else (
    goto ProjectNotFound
)

echo [*] Project Root: %FRONTEND_DIR%
echo [*] Backend Dir:  %BACKEND_DIR%
echo.

:: Check Python
echo [*] Checking Python...
python --version >nul 2>&1
if errorlevel 1 goto NoPython

for /f "tokens=*" %%i in ('python --version 2^>^&1') do set "PY_VER=%%i"
echo     Found: %PY_VER%

:: Check Node.js and npm
echo [*] Checking Node.js and npm...
node -v >nul 2>&1
if errorlevel 1 goto NoNode

call npm -v >nul 2>&1
if errorlevel 1 goto NoNpm

for /f "tokens=*" %%i in ('node -v 2^>^&1') do set "NODE_VER=%%i"
echo     Found Node:   %NODE_VER%
for /f "tokens=*" %%i in ('call npm -v 2^>^&1') do set "NPM_VER=%%i"
echo     Found npm:    %NPM_VER%
echo.

:: Check backend dependencies
echo [*] Checking backend packages...
python -c "import fastapi, uvicorn" >nul 2>&1
if errorlevel 1 goto InstallPythonDeps
echo     Backend packages verified.
goto CheckFrontend

:InstallPythonDeps
echo     Installing backend requirements from requirements.txt...
python -m pip install -r "%BACKEND_DIR%\requirements.txt"
if errorlevel 1 goto DepError
echo     Backend dependencies installed successfully.

:CheckFrontend
echo [*] Checking frontend packages...
if exist "%FRONTEND_DIR%\node_modules" goto LaunchServers
echo     node_modules missing. Installing npm packages (this may take a minute)...
pushd "%FRONTEND_DIR%"
call npm install
popd
if errorlevel 1 goto NpmError
echo     Frontend packages installed successfully.

:LaunchServers
echo.
echo [*] Launching Backend Server in separate window (FastAPI on Port 8000)...
start "SkillPath - Backend (:8000)" /D "%BACKEND_DIR%" cmd /k "(if exist venv\Scripts\activate.bat call venv\Scripts\activate.bat) & python -m uvicorn main:app --reload --port 8000"

echo [*] Launching Frontend App in separate window (Vite on Port 5173)...
start "SkillPath - Frontend (:5173)" /D "%FRONTEND_DIR%" cmd /k "call npm run dev"

echo.
echo [*] Waiting 3 seconds for servers to initialize...
ping 127.0.0.1 -n 4 >nul

echo [*] Opening browser at http://localhost:5173 ...
start http://localhost:5173

cls
echo ==============================================================================
echo                     SKILLPATH IS RUNNING SUCCESSFULLY!                        
echo ==============================================================================
echo.
echo   Web Application:       http://localhost:5173
echo   Backend REST API:      http://127.0.0.1:8000
echo   Interactive API Docs:  http://127.0.0.1:8000/docs
echo   ReDoc Documentation:   http://127.0.0.1:8000/redoc
echo.
echo ------------------------------------------------------------------------------
echo   DEMO CREDENTIALS / ACCESS TOKENS (Use in /access or Authorization header):
echo ------------------------------------------------------------------------------
echo   Student [Aisha Patel]:       student-token-aisha
echo   Student [Marcus Thompson]:   student-token-marcus
echo   Counselor [Dr. Jane Miller]: counselor-token-jane
echo   Counselor [Prof. Raj Verma]: counselor-token-raj
echo   Employer [TechCorp]:         employer-token-techcorp
echo   Administrator:               admin-token-system
echo ------------------------------------------------------------------------------
echo.
echo   [Tip] To stop the servers, simply close their console windows.
echo.
echo Press any key to close this launcher window (servers keep running)...
pause >nul
exit /b 0

:ProjectNotFound
echo.
echo [ERROR] Could not find backend\main.py!
echo Please make sure start.bat is in the SkillPath folder.
echo Current directory: %CURR%
echo.
pause
exit /b 1

:NoPython
echo.
echo [ERROR] Python was not found on your system!
echo Please download and install Python 3.10+ from:
echo https://www.python.org/downloads/
echo Make sure to check the box "Add Python to PATH" during installation.
echo.
pause
exit /b 1

:NoNode
echo.
echo [ERROR] Node.js was not found on your system!
echo Please download and install Node.js (LTS version) from:
echo https://nodejs.org/
echo.
pause
exit /b 1

:NoNpm
echo.
echo [ERROR] npm was not found on your system!
echo Please reinstall Node.js from https://nodejs.org/
echo.
pause
exit /b 1

:DepError
echo.
echo [ERROR] Failed to install Python dependencies.
echo.
pause
exit /b 1

:NpmError
echo.
echo [ERROR] Failed to install npm dependencies.
echo.
pause
exit /b 1
