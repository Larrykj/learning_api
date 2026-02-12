class Api::PagesController < ApplicationController
  # GET /api/status
  # Returns API health check and overview
  def status
    render json: {
      api: "Books API",
      version: "1.0",
      status: "running",
      server_time: Time.current.iso8601,
      total_books: Book.count
    }
  end

  # GET /api/stats
  # Returns collection statistics
  def stats
    books = Book.all

    render json: {
      total_books: books.count,
      total_authors: books.distinct.count(:author),
      recent_books: books.order(created_at: :desc).limit(5),
      books_by_author: books.group(:author).count
    }
  end

  # GET /api/server_time
  # Returns the current server time
  def server_time
    render json: { server_time: Time.current.iso8601 }
  end
end
