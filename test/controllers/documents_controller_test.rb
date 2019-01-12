require 'test_helper'

class DocumentsControllerTest < ActionDispatch::IntegrationTest
  setup do
    test_file_path = Rails.root.to_s + '/test/fixtures/files/test.pdf'
    @test_file = Rack::Test::UploadedFile.new(test_file_path, 'pdf')
  end
  test "should display homepage" do
    get '/'
    assert_response :success
  end

  test "should display all documents on homepage" do
    @document = Document.create
    @document.file.attach(
      io: File.open(Rails.root.to_s + '/test/fixtures/files/test.pdf'), 
      filename: 'test.pdf'
    )
    get '/'
    assert_select 'ul#documents-list' do
      assert_select 'li.list-group-item', 1
    end
  end

  test "/documents/store should store file and create document" do
    post "/documents/store", params: { file: @test_file, name: 'test file', size: 300 }
    document_count = Document.count
    blob_count = Blob.count
    assert_equal 1, blob_count
    assert_equal 1, document_count
    assert_response :success
  end

  test "Should return 400 if file already exists" do
    params = { file: @test_file, name: 'test.pdf', size: 0 }
    post "/documents/store", params: params
    assert_response :success
    post "/documents/store", params: params
    assert_response :bad_request
    assert_equal @response.body, '{"message":"The file test.pdf already exists on store-box."}'
  end

end
