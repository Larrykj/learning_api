require "test_helper"

class PagesControllerTest < ActionDispatch::IntegrationTest
  test "user_info returns formatted user data" do
    get "/api/user_info", params: { name: "Alice", age: "25", city: "Nairobi" }
    assert_response :success
    
    json_response = JSON.parse(response.body)
    assert_equal "Alice", json_response["user"]["name"]
    assert_equal "25", json_response["user"]["age"]
    assert_equal "Nairobi", json_response["user"]["city"]
    assert_equal "Alice is 25 years old and lives in Nairobi.", json_response["summary"]
  end

  test "user_info returns error when parameters are missing" do
    get "/api/user_info", params: { name: "Alice" }
    assert_response :bad_request
    
    json_response = JSON.parse(response.body)
    assert_includes json_response["error"], "Missing required parameters"
  end
end
