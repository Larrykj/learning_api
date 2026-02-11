class Api::PagesController < ApplicationController
  def home
    render json: { message: "Hello, this is my first Rails endpoint!" }
  end

  def about_me
    render json: { name: "Your Name", learning_style: "Roadmap" }
  end

  def add
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
end
