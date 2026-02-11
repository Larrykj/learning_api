namespace :frontend do
  desc "Build React frontend and copy to Rails public directory"
  task :build do
    puts "Building React frontend..."

    # Change to frontend directory and run npm build
    Dir.chdir(Rails.root.join("frontend")) do
      system("npm run build") || abort("Frontend build failed!")
    end

    puts "✅ Frontend built successfully!"
  end

  desc "Install frontend dependencies"
  task :install do
    puts "Installing frontend dependencies..."

    Dir.chdir(Rails.root.join("frontend")) do
      system("npm install") || abort("Frontend install failed!")
    end

    puts "✅ Frontend dependencies installed!"
  end

  desc "Install dependencies and build frontend"
  task setup: [ :install, :build ]
end
