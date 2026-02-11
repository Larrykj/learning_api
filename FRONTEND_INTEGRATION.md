# Frontend Integration Guide

## Overview

The React frontend is now fully integrated with Rails and serves from the same port (3000).

## How It Works

- API routes are now under `/api` namespace (e.g., `/api/books`, `/api/server_time`)
- React app is built and served from Rails' `public` directory
- When you run `rails server`, both the API and frontend are available at `http://localhost:3000`

## Development Workflow

### Option 1: Integrated Mode (Production-like)

```bash
# Build the frontend
rake frontend:build

# Or build using npm directly
cd frontend && npm run build

# Start Rails server
rails server

# Visit http://localhost:3000
```

### Option 2: Separate Development (Hot Reload)

If you want hot reloading during frontend development:

```bash
# Terminal 1: Run Rails API
rails server

# Terminal 2: Run React dev server
cd frontend && npm start

# Visit http://localhost:3001 (React dev server)
# API calls will proxy to http://localhost:3000
```

## Build Commands

### Build Frontend

```bash
rake frontend:build
```

### Install Frontend Dependencies

```bash
rake frontend:install
```

### Setup Everything (Install + Build)

```bash
rake frontend:setup
```

## What Changed

1. **Routes**: All API endpoints moved to `/api` namespace
   - Old: `GET /books` → New: `GET /api/books`
   - Old: `POST /books` → New: `POST /api/books`
2. **React App**: Updated to use relative URLs (`/api` instead of `http://localhost:3000`)

3. **Rails Controller**: Added `pages#index` action to serve the React app

4. **Build Process**: React builds directly into Rails' `public` directory

5. **Routing**: Added catch-all route to serve React app for all non-API routes

## First Time Setup

After pulling these changes:

```bash
# Install frontend dependencies
cd frontend && npm install

# Build the frontend
npm run build

# Start Rails server
cd .. && rails server
```

## Notes

- The frontend is automatically copied to `public/` during build
- Rails serves `index.html` for all non-API routes (React handles client-side routing)
- No need to run separate `npm start` unless you want hot reload during development
- CORS is still configured for flexibility, but not needed when serving from same origin
