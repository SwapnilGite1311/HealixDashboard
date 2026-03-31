#!/bin/bash

# Healix - Start both backend and frontend dev servers

echo ""
echo "  ██╗  ██╗███████╗ █████╗ ██╗     ██╗██╗  ██╗"
echo "  ██║  ██║██╔════╝██╔══██╗██║     ██║╚██╗██╔╝"
echo "  ███████║█████╗  ███████║██║     ██║ ╚███╔╝ "
echo "  ██╔══██║██╔══╝  ██╔══██║██║     ██║ ██╔██╗ "
echo "  ██║  ██║███████╗██║  ██║███████╗██║██╔╝ ██╗"
echo "  ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚══════╝╚═╝╚═╝  ╚═╝"
echo ""
echo "  Healthcare Intelligence Platform"
echo "  ─────────────────────────────────────────────"
echo ""

# Kill any existing processes on our ports
kill $(lsof -t -i:3001) 2>/dev/null
kill $(lsof -t -i:5173) 2>/dev/null

# Start backend
echo "  🏥  Starting backend on http://localhost:3001"
cd "$(dirname "$0")/backend" && node server.js &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 1

# Start frontend
echo "  ⚡  Starting frontend on http://localhost:5173"
cd "$(dirname "$0")/frontend" && npm run dev &
FRONTEND_PID=$!

echo ""
echo "  ─────────────────────────────────────────────"
echo "  ✅  Dashboard:  http://localhost:5173"
echo "  ✅  API:        http://localhost:3001"
echo ""
echo "  Demo login:  admin@healix.com / admin123"
echo "  ─────────────────────────────────────────────"
echo ""
echo "  Press Ctrl+C to stop all services"
echo ""

# Handle Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo '  Stopped.'; exit 0" INT TERM

wait
