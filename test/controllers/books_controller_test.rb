require "test_helper"

class BooksControllerTest < ActionDispatch::IntegrationTest
  test "search finds books by title (case-insensitive)" do
    get "/api/books/search", params: { q: "harry" }
    assert_response :success
    
    json_response = JSON.parse(response.body)
    assert_equal 1, json_response.length
    assert_equal "Harry Potter and the Philosopher's Stone", json_response[0]["title"]
  end

  test "search finds books by author (case-insensitive)" do
    get "/api/books/search", params: { q: "tolkien" }
    assert_response :success
    
    json_response = JSON.parse(response.body)
    assert_equal 2, json_response.length
  end

  test "search returns empty array when no matches" do
    get "/api/books/search", params: { q: "nonexistent" }
    assert_response :success
    
    json_response = JSON.parse(response.body)
    assert_equal 0, json_response.length
  end

  test "search returns empty array when query is empty" do
    get "/api/books/search", params: { q: "" }
    assert_response :success
    
    json_response = JSON.parse(response.body)
    assert_equal 0, json_response.length
  end
end
