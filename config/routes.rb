Rails.application.routes.draw do
  # API routes
  namespace :api do
    get "/home", to: "pages#home"
    get "/about_me", to: "pages#about_me"
    get "/add", to: "pages#add"
    get "/check_age", to: "pages#check_age"
    get "/server_time", to: "pages#server_time"
    get "/greet", to: "pages#greet"
    get "/user_info", to: "pages#user_info"

    get "/books", to: "books#index"
    get "/books/search", to: "books#search"
    post "/books", to: "books#create"
    patch "/books/:id", to: "books#update"
    delete "/books/:id", to: "books#destroy"
  end

  # Serve React app - this must be last
  get "*path", to: "pages#index", constraints: ->(req) {
    !req.xhr? && req.format.html?
  }

  root "pages#index"
end
