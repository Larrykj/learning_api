# Books API React Frontend

This is a React frontend for the Books API.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Make sure your Rails API is running on `http://localhost:3000`

3. Start the React development server:

```bash
npm start
```

The app will open at `http://localhost:3001`

## Features

- View all books
- Add new books
- Update book titles
- Delete books (with admin password: "secret123")
- View server time

## API Endpoints Used

- `GET /books` - List all books
- `POST /books` - Create a new book
- `PATCH /books/:id` - Update a book
- `DELETE /books/:id` - Delete a book
- `GET /server_time` - Get server time
