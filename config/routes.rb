Rails.application.routes.draw do
  namespace :api do
    # API Overview
    get "/status", to: "pages#status"
    get "/stats", to: "pages#stats"
    get "/server_time", to: "pages#server_time"

    # Books CRUD
    get "/books", to: "books#index"
    get "/books/search", to: "books#search"
    post "/books", to: "books#create"
    patch "/books/:id", to: "books#update"
    delete "/books/:id", to: "books#destroy"
  end
end
