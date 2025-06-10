
#!/bin/bash

echo "Building Net Worth Tracker Desktop App..."

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Build the web app
echo "Building web application..."
npm run build

# Copy electron package.json
cp electron-package.json package-electron.json

# Build the desktop app
echo "Building desktop application..."
npx electron-builder --config.extends=./package-electron.json

echo "Desktop app built successfully!"
echo "Check the 'electron-dist' folder for your installer."
