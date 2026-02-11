# Learning API with React Frontend

A Rails 8 API backend with a React frontend for managing books.

## Project Structure

```
learning_api/
├── app/                    # Rails API backend
│   ├── controllers/
│   ├── models/
│   └── serializers/
├── frontend/              # React frontend
│   ├── public/
│   └── src/
│       ├── components/
│       ├── App.js
│       └── index.js
└── config/                # Rails configuration
```

## Setup Instructions

### Backend (Rails API)

1. Install dependencies:

```bash
bundle install
```

2. Setup database:

```bash
rails db:create
rails db:migrate
```

3. Start Rails server (runs on port 3000):

```bash
rails server
```

### Frontend (React)

1. Navigate to frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start React development server (runs on port 3001):

```bash
npm start
```

The React app will automatically open at `http://localhost:3001`

## API Endpoints

### Pages

- `GET /home` - Welcome message
- `GET /about_me` - About info
- `GET /add?num1=X&num2=Y` - Add two numbers
- `GET /check_age?age=X` - Check age eligibility
- `GET /server_time` - Get current server time

### Books CRUD

- `GET /books` - List all books
- `POST /books` - Create a new book
  - Body: `{ "title": "Book Title", "author": "Author Name" }`
- `PATCH /books/:id` - Update a book
  - Body: `{ "title": "New Title" }`
- `DELETE /books/:id?admin_password=YOUR_PASSWORD` - Delete a book
  - Requires admin password set in `.env` file

## Features

### Backend

- RESTful API built with Rails 8
- PostgreSQL database
- CORS enabled for React frontend
- BookSerializer for JSON responses
- Admin password protection for deletions

### Frontend

- Modern React UI with hooks
- Full CRUD operations for books
- Real-time server time display
- Responsive design
- Error handling and status messages

## Technologies

- **Backend**: Ruby on Rails 8.1, PostgreSQL
- **Frontend**: React 18, CSS3
- **CORS**: rack-cors gem

## Development Notes

- Rails API runs on `http://localhost:3000`
- React app runs on `http://localhost:3001`
- CORS is configured to allow requests from localhost:3001
- Admin password for deleting books: Set `ADMIN_PASSWORD` in `.env` file (see `.env.example`)
