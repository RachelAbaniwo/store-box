require 'test_helper'

class DocumentsControllerTest < ActionDispatch::IntegrationTest
  test "should get new" do
    get documents_new_url
    assert_response :success
  end

  test "should get store" do
    get documents_store_url
    assert_response :success
  end

end
