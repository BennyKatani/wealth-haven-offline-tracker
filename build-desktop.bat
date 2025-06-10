
@echo off
echo Building Net Worth Tracker Desktop App...

REM Install dependencies if needed
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
)

REM Build the web app
echo Building web application...
npm run build

REM Copy electron package.json
copy electron-package.json package-electron.json

REM Build the desktop app
echo Building desktop application...
npx electron-builder --config.extends=./package-electron.json

echo Desktop app built successfully!
echo Check the 'electron-dist' folder for your installer.
pause
