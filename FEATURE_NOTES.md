# Feature Chapter - New Changes

This branch demonstrates how pull requests work on GitHub.

## Changes Made

### 1. New Greet Endpoint
- **File**: `app/controllers/api/pages_controller.rb`
- **What it does**: Accepts a name parameter and returns a personalized greeting
- **Example**: `/api/greet?name=John` returns `{"greeting": "Hello, John! Welcome to the feature branch."}`

### 2. Updated Routes
- **File**: `config/routes.rb`
- **What changed**: Added a new route `GET /api/greet` that points to the greet action

## How to Test
1. Start the Rails server: `rails server`
2. Visit: `http://localhost:3000/api/greet?name=YourName`
3. You should see a JSON response with a personalized greeting

## Purpose
These simple changes will show up in the pull request comparison:
- **Green lines** (additions): The new greet method and route
- **Red lines** (deletions): None in this case
- **Modified files**: Will show which files were changed

This makes it easy to review what's different between the `feature_chapter` branch and the `main` branch before merging.
