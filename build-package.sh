
#!/bin/bash

# Net Worth Tracker - Build Package Script
echo "Building Net Worth Tracker for distribution..."

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the project
echo "Building project..."
npm run build

# Create distribution folder
echo "Creating distribution package..."
mkdir -p dist-package

# Copy built files
cp -r dist/* dist-package/

# Create a simple server file for local hosting
cat > dist-package/server.js << 'EOF'
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the current directory
app.use(express.static(__dirname));

// Handle client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Net Worth Tracker is running at http://localhost:${PORT}`);
  console.log('Press Ctrl+C to stop the server');
});
EOF

# Create package.json for the distribution
cat > dist-package/package.json << 'EOF'
{
  "name": "net-worth-tracker",
  "version": "1.0.0",
  "description": "A privacy-focused net worth tracking application",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "install-deps": "npm install express"
  },
  "dependencies": {
    "express": "^4.18.2"
  },
  "author": "Net Worth Tracker",
  "license": "MIT"
}
EOF

# Create README for distribution
cat > dist-package/README.md << 'EOF'
# Net Worth Tracker - Standalone Distribution

A privacy-focused net worth tracking application that runs entirely offline.

## Features
- 100% Private: All data stays on your device
- 100% Free: No subscriptions or hidden costs
- 100% Offline: Works without internet connection
- Track assets, liabilities, and financial goals
- Beautiful, responsive interface

## Installation & Setup

### Option 1: Simple File Opening (Recommended)
1. Open the `index.html` file directly in your web browser
2. That's it! The app will work immediately

### Option 2: Local Server (Advanced)
1. Make sure you have Node.js installed on your computer
2. Open terminal/command prompt in this folder
3. Run: `npm run install-deps`
4. Run: `npm start`
5. Open your browser to `http://localhost:3000`

## Usage
- Open the app and click "Start Tracking" to add your first account
- Add your bank accounts, investments, properties, and debts
- Set financial goals and track your progress
- All data is stored locally in your browser - no cloud storage

## Privacy & Security
- No data is ever transmitted to external servers
- No tracking, analytics, or telemetry
- Works completely offline
- Your financial data never leaves your device

## Technical Details
- Built with React, TypeScript, and Tailwind CSS
- Uses browser localStorage for data persistence
- Responsive design works on desktop and mobile
- No external dependencies or API calls

Enjoy tracking your financial progress with complete privacy!
EOF

echo "Package created successfully in 'dist-package' folder!"
echo ""
echo "To use the app:"
echo "1. Open dist-package/index.html directly in your browser, OR"
echo "2. Run 'npm run install-deps && npm start' from the dist-package folder"
echo ""
echo "The dist-package folder contains everything needed to run the app offline."
