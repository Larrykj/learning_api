# Feature Chapter - New Changes

This branch demonstrates how pull requests work on GitHub.

## Changes Made

### 1. New Greet Endpoint
- **File**: `app/controllers/api/pages_controller.rb`
- **What it does**: Accepts a name parameter and returns a personalized greeting
- **Example**: `/api/greet?name=John` returns `{"greeting": "Hello, John! Welcome to the feature branch."}`

### 2. New User Info Endpoint
- **File**: `app/controllers/api/pages_controller.rb`
- **What it does**: Accepts name, age, and city parameters and returns formatted user information
- **Example**: `/api/user_info?name=Alice&age=25&city=Nairobi` returns user object with summary

### 3. New Book Search Endpoint
- **File**: `app/controllers/api/books_controller.rb`
- **What it does**: Searches books by title or author using case-insensitive matching
- **Example**: `/api/books/search?q=Harry` returns all books with "Harry" in title or author

### 4. Updated Routes
- **File**: `config/routes.rb`
- **What changed**: Added routes for `GET /api/user_info` and `GET /api/books/search`

## How to Test
1. Start the Rails server: `rails server`
2. Test endpoints:
   - `http://localhost:3000/api/greet?name=YourName`
   - `http://localhost:3000/api/user_info?name=Alice&age=25&city=Nairobi`
   - `http://localhost:3000/api/books/search?q=Harry`

## Purpose
These changes demonstrate adding multiple features in a feature branch:
- **Green lines** (additions): New methods and routes
- **Modified files**: 3 files changed (pages_controller, books_controller, routes)
- **Feature scope**: Shows how to add related functionality together

This makes it easy to review what's different between the `feature_chapter` branch and the `main` branch before merging.
