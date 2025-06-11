
@echo off
echo Building Net Worth Tracker for distribution...

echo Installing dependencies...
call npm install

echo Building project...
call npm run build

echo Creating distribution package...
if not exist dist-package mkdir dist-package

echo Copying built files...
xcopy /E /I /Y dist\* dist-package\

echo Creating server file...
(
echo const express = require('express'^);
echo const path = require('path'^);
echo const app = express(^);
echo const PORT = process.env.PORT ^|^| 3000;
echo.
echo app.use(express.static(__dirname^)^);
echo.
echo app.get('*', (req, res^) =^> {
echo   res.sendFile(path.join(__dirname, 'index.html'^)^);
echo }^);
echo.
echo app.listen(PORT, (^) =^> {
echo   console.log(`Net Worth Tracker is running at http://localhost:${PORT}`^);
echo   console.log('Press Ctrl+C to stop the server'^);
echo }^);
) > dist-package\server.js

echo Creating package.json...
(
echo {
echo   "name": "net-worth-tracker",
echo   "version": "1.0.0",
echo   "description": "A privacy-focused net worth tracking application",
echo   "main": "server.js",
echo   "scripts": {
echo     "start": "node server.js",
echo     "install-deps": "npm install express"
echo   },
echo   "dependencies": {
echo     "express": "^4.18.2"
echo   },
echo   "author": "Net Worth Tracker",
echo   "license": "MIT"
echo }
) > dist-package\package.json

echo Creating README...
(
echo # Net Worth Tracker - Standalone Distribution
echo.
echo A privacy-focused net worth tracking application that runs entirely offline.
echo.
echo ## Installation ^& Setup
echo.
echo ### Option 1: Simple File Opening (Recommended^)
echo 1. Open the `index.html` file directly in your web browser
echo 2. That's it! The app will work immediately
echo.
echo ### Option 2: Local Server (Advanced^)
echo 1. Make sure you have Node.js installed
echo 2. Open command prompt in this folder
echo 3. Run: `npm run install-deps`
echo 4. Run: `npm start`
echo 5. Open browser to `http://localhost:3000`
echo.
echo Your financial data stays completely private and never leaves your device!
) > dist-package\README.md

echo.
echo Package created successfully in 'dist-package' folder!
echo.
echo To use the app:
echo 1. Open dist-package\index.html directly in your browser, OR
echo 2. Run 'npm run install-deps && npm start' from the dist-package folder
echo.
pause
