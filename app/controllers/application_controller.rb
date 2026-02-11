class ApplicationController < ActionController::Base
  # Disable CSRF for API endpoints in the api namespace
  protect_from_forgery with: :null_session, if: -> { request.format.json? }
end
