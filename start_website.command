#!/bin/bash
# Navigate to the script's directory (project folder)
cd "$(dirname "$0")"

echo "---------------------------------------------------"
echo "   RISE UP WEBSITE LAUNCHER"
echo "---------------------------------------------------"

# 1. Kill any existing instances to prevent conflicts
echo "1. Cleaning up old processes..."
pkill -f "python3 server.py" 2>/dev/null
pkill -f "node server.js" 2>/dev/null

# 2. Start the Python server in the background
echo "2. Starting server..."
# Check if python3 is available
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 is not found. Please install Python."
    exit 1
fi

python3 server.py &
SERVER_PID=$!

# 3. Wait a moment for it to initialize
echo "3. Waiting for server to initialize..."
sleep 2

# 4. Open the correct URL in the default browser
echo "4. Opening website..."
open "http://localhost:8000"

echo "---------------------------------------------------"
echo "   SUCCESS! Website is running."
echo "   Feedback saved to database. View at: http://localhost:8000/view-feedback"
echo "   DO NOT CLOSE THIS WINDOW while using the site."
echo "---------------------------------------------------"

# Keep the script running to keep the server alive
wait $SERVER_PID
