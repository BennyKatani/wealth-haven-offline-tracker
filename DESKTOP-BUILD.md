
# Building Desktop Version

## Prerequisites
- Node.js (v16 or higher)
- npm

## Quick Build Instructions

### For Windows:
1. Double-click `build-desktop.bat`
2. Wait for the build to complete
3. Find your installer in the `electron-dist` folder

### For Mac/Linux:
1. Open terminal in this directory
2. Run: `chmod +x build-desktop.sh`
3. Run: `./build-desktop.sh`
4. Find your installer in the `electron-dist` folder

## Manual Build Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Electron dependencies:
   ```bash
   npm install electron electron-builder
   ```

3. Build the web app:
   ```bash
   npm run build
   ```

4. Build desktop app:
   ```bash
   npx electron-builder --config electron-package.json
   ```

## Output Files

- **Windows**: `.exe` installer in `electron-dist/`
- **Mac**: `.dmg` file in `electron-dist/`
- **Linux**: `.AppImage` file in `electron-dist/`

## Features

- Standalone desktop application
- All data stored locally on your computer
- No internet connection required after installation
- Same functionality as the web version

## File Size
The installer will be approximately 150-200MB due to including the Chromium runtime.
