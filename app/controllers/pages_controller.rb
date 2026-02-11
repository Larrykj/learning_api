class PagesController < ApplicationController
  def index
    # Serve the React app
    render file: Rails.root.join('public', 'index.html'), layout: false
  end

  def home
    # render json:is how we send data back to the browser/client
    render json: { message: "Hello, this is my first Rails endpoint!" }
  end

  def about_me
    # Returning specific keys as requested
    render json: { name: "Your Name", learning_style: "Roadmap" }
  end

  def add
    # convert params into integers
    a = params[:num1].to_i
    b = params[:num2].to_i

    result = a + b

    render json: { input_a: a, input_b: b, sum: result }
  end

  def check_age
    age = params[:age].to_i
    if age >= 18
      render json: { status: "allowed", message: "Welcome to the club!" }
    else
      render json: { status: "denied", message: "You are too young." }
    end
  end

  def server_time
    render json: { server_time: Time.current.iso8601 }
  end

  def books_ui
    render template: "pages/books_ui"
  end
end
