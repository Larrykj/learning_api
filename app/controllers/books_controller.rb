class BooksController < ApplicationController
  def index
    render json: Book.all
  end

  def create
    book = Book.new(title: params[:title], author: params[:author])
    if book.save
      render json: book, status: :created
    else
      render json: { errors: book.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    book = Book.find_by(id: params[:id])
    if book
      book.update(title: params[:title])
      render json: book
    else
      head :not_found
    end
  end

  def destroy
    book = Book.find_by(id: params[:id])
    if book.nil?
      render json: { error: "Book not found" }, status: :not_found
    elsif params[:admin_password] == ENV.fetch("ADMIN_PASSWORD", "admin123")
      book.destroy
      head :no_content
    else
      render json: { error: "Unauthorized" }, status: :unauthorized
    end
  end
end
