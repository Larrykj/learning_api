RSpec.describe "Books API", type: :request do
  describe "GET /books" do
    it "returns a successful response" do
      # Use that Factory we talked about!
      FactoryBot.create(:book, title: "The Hobbit")

      get "/books"

      # Check if the status is 200 OK
      expect(response).to have_http_status(:success)

      # Check if the JSON contains our book
      expect(response.body).to include("The Hobbit")
    end
  end

  describe "POST /books" do
    it "creates a new book" do
      expect do
        post "/books", params: { title: "1984", author: "George Orwell" }
      end.to change(Book, :count).by(1)

      expect(response).to have_http_status(:created)
    end
  end
end
